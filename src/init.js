const inquirer = require('inquirer');
const {
  execCMD,
  writeFile,
  resolve,
} = require('./utils/utils');

// 初始化项目
async function init(filePath) {
  await execCMD.init(filePath);
  writeFile(resolve(filePath, '.gitignore'), 'node_modules\n');
  await execCMD.add(filePath);
  await execCMD.commit(filePath);
  await execCMD.branch(filePath, 'dev');
  await execCMD.branch(filePath, 'test');
  await execCMD.checkout(filePath, 'dev');
}
// 获取当前分支
async function getCurrBranch(filePath) {
  const result = await execCMD.status(filePath);
  const regx = /^On branch (.*)/;
  const res = result.match(regx);
  if (res) {
    return res[1];
  }
  return 'dev';
}
// 配置远程仓库地址
async function setOrigin(filePath) {
  const { orginUrl } = await inquirer.prompt([{
    type: 'input',
    name: 'orginUrl',
    message: '请输入远程仓库地址!',
    validate: (res) => {
      if (!res) return '远程仓库地址不能为空';
      return true;
    },
  }]);
  await execCMD.remoteAdd(filePath, orginUrl);
  const res = await execCMD.pushOrigin(filePath, 'master');
  if (res === 'errorOriginUrl') {
    await execCMD.remoteDel(filePath);
    await setOrigin(filePath);
  }
}

module.exports = {
  init,
  getCurrBranch,
  setOrigin,
}
