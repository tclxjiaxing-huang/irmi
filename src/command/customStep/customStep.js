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
    name: '添加到暂存区(add)',
    value: 'add',
  },
  commit: {
    name: '添加到本地仓库(commit)',
    value: 'commit',
  },
  push: {
    name: '推送到远程仓库(push)',
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
  branch: {
    name: '创建分支(branch)',
    value: 'branch',
  },
  pushUpStream: {
    name: '创建远程分支(pushUpStream)',
    value: 'pushUpStream',
  },
  delBranch: {
    name: '删除分支(delBranch)',
    value: 'delBranch',
  },
  delOriginBranch: {
    name: '删除远程分支(delOriginBranch)',
    value: 'delOriginBranch',
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

// 保存步骤
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

// 命名
async function setName() {
  const { name } = await inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: '请为步骤输入一个名字',
    validate: (value) => {
      if (!value) return '名字不能为空';
      return true;
    }
  }]);
  return name;
}

async function pushStep() {
  let isFinsh = false;
  const subStepRegx = /^(.*)\((.*)\)$/;
  const stepList = [];
  let lastStep = null;
  let stepNum = 0;
  while (!isFinsh) {
    console.log(isFinsh);
    stepNum++;
    let { stepTag } = await inquirer.prompt([{
      type: 'list',
      name: 'stepTag',
      message: `选择第${stepNum}步骤`,
      choices: Object.keys(pushStepList).filter((step) => pushStepList[step].value !== lastStep).map((step) => ({
        name: pushStepList[step].name,
        value: pushStepList[step].value,
      })),
    }]);
    let stepName = '';
    let stepValue = stepTag;
    // 判断是否有追加选项
    const subStep = stepTag.match(subStepRegx);
    if (subStep) {
      stepValue = stepTag = subStep[1]; // 匹配值
      stepName = pushStepList[stepTag].name.replace(/\(.*\)/, '');
      const answer = await inquirer.prompt(pushStepList[stepTag].prompt);
      stepValue += `(${answer[subStep[2]]})`;
      stepName += `(${answer[subStep[2]]})`;
    } else {
      stepName = pushStepList[stepTag].name;
    }
    if (stepTag === 'finish') {
      if (stepList.length === 0) {
        yellow('至少包含一个步骤');
        stepNum--;
      } else {
        isFinsh = true;
      }
    } else if (stepValue !== lastStep){
      stepList.push({
        name: stepName,
        value: stepValue,
      });
      lastStep = stepValue;
    }
  }
  const stepPrompt = {
    name: [],
    value: [],
    label: '',
  };
  stepList.forEach((step) => {
    stepPrompt.name.push(step.name);
    stepPrompt.value.push(step.value);
  });
  stepPrompt.name = stepPrompt.name.join('->');
  stepPrompt.value = stepPrompt.value.join('-');
  stepPrompt.label = await setName();
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
