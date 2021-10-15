const inquirer = require('inquirer');
const {
  getDate
} = require('../../utils/utils');
const {
  getAlreadyTag,
} = require('../../utils/gitUtil');

// 打标签
async function tagAction(params) {
  const vList = await getAlreadyTag(params[0].path);
  const { tagName, tagDesc } = await inquirer.prompt([{
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
  params.push(tagName);
  params.push(tagDesc);
  return params;
}

async function delAction(params) {
  const { tagName } = await inquirer.prompt([{
    type: 'list',
    name: 'tagName',
    message: '请选择要删除的tag',
    choices: vList,
  }]);
  params.push(tagName);
  return params;
}

async function handleTag(CMD, params) {
  if (CMD === 'tag') {
    // 打标签操作
    params = await tagAction(params);
  } else if (CMD === 'del') {
    params = await delAction(params);
  }
  return params;
}

module.exports = handleTag;
