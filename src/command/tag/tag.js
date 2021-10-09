
const inquirer = require('inquirer');
const {
  getDate,
  yellow,
  yellowBright,
  execCMD,
  readFilesPath,
} = require('../../utils/utils');
const abnormal = require('../push/abnormal');

// 获取已存在的tag
async function getAlreadyTag(filePath) {
  const result = await execCMD.CMD(filePath, 'git tag');
  if (typeof result === 'object') {
    process.exit(0);
  }
  const vList = result.split(/\n/);
  vList.pop();
  return vList;
}

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
      if (vList.length === 0) {
        return '1.0.0';
      }
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
  const choices = filesData.map((file) => ({
    name: file.name,
    value: file.path,
  }));
  let { filesList } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'filesList',
    message: '选择应用(不选择则全部应用)',
    choices: choices,
  }]);
  const { options } = await inquirer.prompt([{
    type: 'list',
    name: 'options',
    message: '选择操作',
    choices: [{
      name: '打标签',
      value: 'tag',
    }, {
      name: '推送到远程仓库',
      value: 'pushTag',
    }, {
      name: '打标签->推送到远程仓库',
      value: 'tag-pushTag',
    }, {
      name: '删除本地标签',
      value: 'delTag',
    }, {
      name: '删除远程标签',
      value: 'delOriginTag',
    }, {
      name: '删除本地标签->删除远程标签',
      value: 'delTag-delOriginTag',
    }, {
      name: '展示所有项目的标签',
      value: 'showAllTag',
    }],
  }]);
  if (!filesList) {
    filesList = filesData;
  }
  filesList = filesData.filter((file) => filesList.includes(file.path));
  if (options === 'showAllTag') {
    await showAllTag(filesData);
  } else {
    let params = [];
    const vList = await getAlreadyTag(filesList[0].path);
    if (options.indexOf('tag') !== -1) {
      params = await getTagParams(vList);
    }
    if (options.indexOf('del') !== -1) {
      params = await getDelParams(vList);
    }
    for (let i = 0; i < filesList.length; i += 1) {
      yellowBright(`***当前应用[${filesList[i].name}]***`);
      await chooseSubOptions(filesList[i].path, options, params);
    }
  }
}

// 子操作
async function chooseSubOptions(filePath, options, specParams) {
  const steps = options.split('-');
  const params = [filePath, ...specParams];
  for (let i = 0; i < steps.length; i += 1) {
    const errObj = await execCMD[steps[i]](...params);
    if (typeof errObj === 'object') {
      await abnormal(errObj, params, filePath, '', steps[i]);
    }
  }
}

module.exports = chooseOptions;
