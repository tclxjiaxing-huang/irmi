const inquirer = require('inquirer');
const {
  readTempData,
  writeTempData,
  tempStepFile,
  red,
  green,
} = require('../../utils/utils');

async function delPush() {
  const step = await JSON.parse(readTempData(tempStepFile));
  if (step && Array.isArray(step.push) && step.push.length > 0) {
    const { push } = step;
    const { stepList } = await inquirer.prompt([{
      type: 'checkbox',
      name: 'stepList',
      message: '选择推送步骤',
      choices: push,
    }]);
    for (let i = 0; i < push.length; i += 1) {
      for (let j = 0; j < stepList.length; j += 1) {
        if (push[i].value === stepList[j]) {
          push.splice(i, 1);
          i--;
          break;
        }
      }
    }
    step.push = push;
    await writeTempData(tempStepFile, step);
    green('***删除步骤成功***');
  } else {
    red('暂无自定义的推送步骤');
  }
}

async function delStep() {
  const { type } = await inquirer.prompt([{
    type: 'list',
    name: 'type',
    choices: [{
      name: '推送步骤',
      value: 'push'
    }, {
      name: '打标签步骤',
      value: 'tag'
    }],
  }]);
  if (type === 'push') {
    await delPush();
  }
}

module.exports = delStep;
