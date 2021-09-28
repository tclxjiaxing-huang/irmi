const inquirer = require('inquirer');
const {
  readTempData,
  writeTempData,
  tempStepFile,
  green,
  yellow,
} = require('../../utils/utils');
const delStep = require('./delStep');


// 推送步骤
const pushStepList = {
  add: {
    name: '添加代码到暂存区(add)',
    value: 'add',
  },
  commit: {
    name: '添加代码到本地仓库(commit)',
    value: 'commit',
  },
  push: {
    name: '推送代码到远程仓库(push)',
    value: 'push',
  },
  checkout: {
    name: '切换分支(checkout)',
    value: 'checkout(branchName)',
    prompt: [{
      type: 'input',
      name: 'branchName',
      message: '请输入切换的分支名称',
    }],
  },
  merge: {
    name: '合并分支(merge)',
    value: 'merge(branchName)',
    prompt: [{
      type: 'input',
      name: 'branchName',
      message: '请输入目标分支名称',
    }],
  },
  pull: {
    name: '拉取代码(pull)',
    value: 'pull',
  },
  finish: {
    name: '完成',
    value: 'finish',
    prompt: null,
  },
}

async function saveStep(data, type) {
  let stepData = JSON.parse(readTempData(tempStepFile));
  if (!stepData) {
    stepData = {
      push: [],
      tag: [],
    };
  }
  if (type === 'push') {
    stepData['push'].push(data);
  }
  writeTempData(tempStepFile, stepData);
  yellow(data.value);
  green('***推送步骤保存成功***');
}

async function pushStep() {
  let isFinsh = false;
  const subStepRegx = /^(.*)\((.*)\)$/;
  const stepList = [];
  while (!isFinsh) {
    let { stepTag } = await inquirer.prompt([{
      type: 'list',
      name: 'stepTag',
      choices: Object.keys(pushStepList).map((step) => ({
        name: pushStepList[step].name,
        value: pushStepList[step].value,
      })),
    }]);
    let stepName = '';
    let stepValue = stepTag;
    // 判断是否有追加选项
    const subStep = stepTag.match(subStepRegx);
    if (subStep) {
      stepValue = stepTag = subStep[1];
      stepName = pushStepList[stepTag].name.replace(/\(.*\)/, '');
      const answer = await inquirer.prompt(pushStepList[stepTag].prompt);
      stepValue += `(${answer[subStep[2]]})`;
      stepName += `(${answer[subStep[2]]})`;
    } else {
      stepName = pushStepList[stepTag].name;
    }
    if (stepTag === 'finish') {
      isFinsh = true;
    } else {
      stepList.push({
        name: stepName,
        value: stepValue,
      });
    }
  }
  const stepPrompt = {
    name: [],
    value: [],
  };
  stepList.forEach((step) => {
    stepPrompt.name.push(step.name);
    stepPrompt.value.push(step.value);
  });
  stepPrompt.name = stepPrompt.name.join('->');
  stepPrompt.value = stepPrompt.value.join('-');
  await saveStep(stepPrompt, 'push');
}

async function customStep() {
  const { stepType } = await inquirer.prompt([{
    type: 'list',
    name: 'stepType',
    choices: [{
      name: '推送步骤',
      value: 'push'
    }, {
      name: '打标签步骤',
      value: 'tag',
    }, {
      name: '删除步骤',
      value: 'del',
    }]
  }]);
  if (stepType === 'push') {
    await pushStep();
  } else if (stepType === 'tag') {

  } else if (stepType === 'del') {
    await delStep();
  }
}

module.exports = customStep;
