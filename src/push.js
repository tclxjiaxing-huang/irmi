const inquirer = require('inquirer');
const {
  execCMD,
  yellowBright,
  readFilesPath,
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

async function chooseSubOptions(filePath, options) {
  const steps = options.split('-'); // 所有步骤
  const branchRegx = /^(.*)\((.*)\)$/; //带有分支的命令正则
  console.log(steps);
  for (let i = 0; i < steps.length; i += 1) {
    const isBranch = branchRegx.test(steps[i]); // 当前步骤是否有分支操作
    let CMD = steps[i]; // 统一命令方法
    const param = [filePath]; // 统一命令方法的参数 [文件路径, commit说明/分支]
    const isCommit = steps[i].indexOf('commit') !== -1; // 当前步骤是否有commit操作，有的话会提示输入备注
    if (isCommit) {
      const { commitMsg } = await inquirer.prompt([{
        type: 'input',
        name: 'commitMsg',
        message: '请输入commit说明',
        default: '提交',
      }]);
      param.push(commitMsg)
    }
    isBranch && param.push(steps[i].match(branchRegx)[2]); // 如果是分支操作，则第二个参数为分支名称
    isBranch && (CMD = steps[i].match(branchRegx)[1]); // 如果是分支操作，则匹配出分支操作的正确方法名
    const result = await execCMD[CMD](...param);
    if (result === 'pull') {
      await execCMD.pull(...param);
      await execCMD[CMD](...param);
    } else if (result === 'origin') {
      await setOrigin(...param);
      await execCMD[CMD](...param);
    } else if (result === 'errorOriginUrl') {
      await execCMD.remoteDel(filePath);
      await setOrigin(filePath);
      await execCMD[CMD](...param);
    } else if (result === 'init') {
      await init(filePath);
    } else if (result === 'noUpStream') {
      await execCMD.pushUpStream(filePath, 'dev');
    } else if (result === 'timeOut') {
      await (async function reTry() {
        const res = await execCMD[CMD](...param);
        if (res === 'timeOut') {
          await reTry();
        };
      })();
    }
  }
}

async function chooseOptions() {
  const filesData = readFilesPath();
  const choices = filesData.map((file) => ({
    name: file.name,
    value: file.path,
  }));
  const { fileList } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'fileList',
    message: '选择应用',
    choices: choices,
    validate: (res) => {
      if (res.length > 0) return true;
      return '必须选择至少一个项目!';
    },
  }]);
  const { options } = await inquirer.prompt([{
    type: 'list',
    name: 'options',
    choices: [{
      name: '提交代码',
      value: 'add-commit',
    }, {
      name: '提交代码->推送',
      value: 'add-commit-push',
    }, {
      name: '合并到test',
      value: 'checkout(test)-merge(dev)-checkout(dev)',
    }, {
      name: '提交代码->合并到test',
      value: 'add-commit-checkout(test)-merge(dev)-checkout(dev)',
    }, {
      name: '提交代码->推送->合并到test->推送',
      value: 'add-commit-push-checkout(test)-merge(dev)-push-checkout(dev)',
    }, {
      name: '合并到master',
      value: 'checkout(master)-merge(dev)-checkout(dev)',
    }, {
      name: '合并到master->推送',
      value: 'checkout(master)-merge(dev)-push-checkout(dev)',
    }],
  }]);
  for (let i = 0; i < fileList.length; i += 1) {
    yellowBright(`***当前应用[${fileList[i]}]***`);
    await chooseSubOptions(fileList[i], options);
  }
}

module.exports = chooseOptions;
