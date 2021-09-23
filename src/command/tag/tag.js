const inquirer = require('inquirer');
const {
  getDate,
  yellow,
  yellowBright,
  execCMD,
  readFilesPath,
} = require('../../utils/utils');

// 获取已存在的tag
async function getAlreadyTag(filePath) {
  const result = await execCMD.CMD(filePath, 'git tag');
  const vList = result.split(/\n/);
  vList.pop();
  return vList;
}

// 标签命令
const tag = (filePath, tagName, tagDesc) => execCMD.CMD(filePath, `git tag -a ${tagName} -m '${tagDesc}'`, `已打标签!(${tagName})`);
const pushTag = (filePath) => execCMD.CMD(filePath, `git push origin --tags`, '已推送标签到仓库!');
const delTag = (filePath, tagName) => execCMD.CMD(filePath, `git tag -d ${tagName}`, `已删除本地标签!(${tagName})`);
const delOriginTag = (filePath, tagName) => execCMD.CMD(filePath, `git push origin :refs/tags/${tagName}`, `已删除远程标签!(${tagName})`);
const tagCMD = {
  tag,
  pushTag,
  delTag,
  delOriginTag,
};

// 展示所有项目的tag
async function showAllTag(filesData) {
  for (let i = 0; i < filesData.length; i += 1) {
    const vList = await getAlreadyTag(filesData[i].path);
    yellow(filesData[i].name);
    yellowBright(vList.join('\n'));
  }
}

// tag操作参数
async function getTagParams(vList) {
  const answers = await inquirer.prompt([{
    type: 'input',
    name: 'tagName',
    default: () => {
      let lastV = vList[vList.length - 1];
      const regex = /\.(\d)\./;
      return lastV.replace(regex, (match, value) => {
        return `.${Number(value) + 1}.`;
      })
    },
    message: '请输入tag名称(为空则为小版本加1)',
  }, {
    type: 'input',
    name: 'tagDesc',
    default: `${getDate()}发布`,
    message: '请输入tag发布日期(为空则为今天)',
    validate: (value) => {
      if (!value) return true;
      const regex = /^\d{4}-\d{1,2}-\d{1,2}发布$/;
      if (!regex.test(value)) return 'tag描述格式错误(yyyy-mm-dd发布)';
      return true;
    }
  }]);
  return [answers.tagName, answers.tagDesc]
}

// del操作参数
async function getDelParams(vList) {
  const answers = await inquirer.prompt([{
    type: 'list',
    name: 'tagName',
    message: '请选择要删除的tag',
    choices: vList,
  }]);
  return [answers.tagName];
}

// 选择操作
async function chooseOptions() {
  const filesData = readFilesPath();
  const { options } = await inquirer.prompt([{
    type: 'list',
    name: 'options',
    message: '选择操作',
    choices: [{
      name: '打标签',
      value: 'tag',
    }, {
      name: '打标签->推送到远程仓库',
      value: 'tag-pushTag',
    }, {
      name: '删除本地标签',
      value: 'delTag',
    }, {
      name: '删除本地标签->删除远程标签',
      value: 'delTag-delOriginTag',
    }, {
      name: '展示所有项目的标签',
      value: 'showAllTag',
    }],
  }]);
  if (options === 'showAllTag') {
    await showAllTag(filesData);
  } else {
    let params = [];
    const vList = await getAlreadyTag(filesData[0].path);
    if (options.indexOf('tag') !== -1) {
      params = await getTagParams(vList);
    }
    if (options.indexOf('del') !== -1) {
      params = await getDelParams(vList);
    }
    for (let i = 0; i < filesData.length; i += 1) {
      yellowBright(`***当前应用[${filesData[i].name}]***`);
      await chooseSubOptions(filesData[i].path, options, params);
    }
  }
}

// 子操作
async function chooseSubOptions(filePath, options, specParams) {
  const steps = options.split('-');
  const params = [filePath, ...specParams];
  for (let i = 0; i < steps.length; i += 1) {
    await tagCMD[steps[i]](...params);
  }
}

module.exports = chooseOptions;
