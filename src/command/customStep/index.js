const inquirer = require('inquirer');
const {
  log,
  getStepData,
  writeDataToHomeDir,
  stepFileName,
} = require('../../utils/index');
const delStep = require('./delStep');

// 推送步骤
const pushStepList = [
  {
    name: '添加到暂存区(add)',
    value: 'add',
  },
  {
    name: '添加到本地仓库(commit)',
    value: 'commit',
  },
  {
    name: '推送到远程仓库(push)',
    value: 'push',
  },
  {
    name: '切换分支(checkout)',
    value: 'checkout',
  },
  {
    name: '合并分支(merge)',
    value: 'merge',
  },
  {
    name: '创建分支(branch)',
    value: 'branch',
  },
  {
    name: '删除分支(delBranch)',
    value: 'delBranch',
  },
  {
    name: '拉取代码(pull)',
    value: 'pull',
  },
  {
    name: '打标签(tag)',
    value: 'tag',
  },
  {
    name: '推送标签(pushTag)',
    value: 'pushTag',
  },
  {
    name: '完成',
    value: 'finish',
  },
]

// 保存步骤
async function saveStep(stepList, stepName) {
  let stepData = getStepData();
  if (!stepData) {
    stepData = [];
  }
  stepList = stepList.join('-');
  stepData.push({
    name: stepName || stepList,
    value: stepList,
  });
  writeDataToHomeDir(stepFileName, stepData);
  log.yellow(stepList);
  log.success('***保存步骤成功***');
}

async function branch() {
  let { branchName } = await inquirer.prompt([{
    type: 'input',
    name: 'branchName',
    message: '输入创建分支名称(回车可跳过)',
  }]);
  if (branchName) {
    return `<${branchName}>`;
  }
  return '';
}
async function checkout() {
  let { branchName } = await inquirer.prompt([{
    type: 'input',
    name: 'branchName',
    message: '输入切换分支名称(回车可跳过)',
  }]);
  if (branchName) {
    return `<${branchName}>`;
  }
  return '';
}
async function delBranch() {
  let { branchName } = await inquirer.prompt([{
    type: 'input',
    name: 'branchName',
    message: '输入删除分支名称(回车可跳过)',
  }]);
  if (branchName) {
    return `<${branchName}>`;
  }
  return '';
}
const inquirerPrompt = {
  branch,
  checkout,
  delBranch,
}
async function addStep() {
  const matchNameRegex = /^([a-zA-Z]+)(?:<([\w,]+)>)?/;
  const stepList = []; // 步骤列表
  let lastStep = ''; // 当前最新步骤
  let stepNum = 0; // 第几步
  while (lastStep !== 'finish') {
    await process.stdout.write('\r')
    stepNum++;
    if (stepList.length > 0) {
      log.success(`当前步骤：${stepList.join('-')}`)
    }
    let { stepTag } = await inquirer.prompt([{
      type: 'list',
      name: 'stepTag',
      message: `选择第${stepNum}步骤`,
      choices: pushStepList.filter((step) => step.value !== lastStep),
    }]);
    const matched = stepTag.match(matchNameRegex);
    if (matched) {
      let [, stepName] = matched;
      lastStep = stepName;
      // 判断是否有追加选项
      if (inquirerPrompt[stepName]) {
        const argStr = await inquirerPrompt[stepName]();
        stepName += argStr;
      }
      stepList.push(stepName);
    }
  }

  let { stepName } = await inquirer.prompt([{
    type: 'input',
    name: 'stepName',
    message: '为步骤创建一个名称(回车可跳过)',
  }]);
  await saveStep(stepList, stepName);
}

async function customStep() {
  const { stepType } = await inquirer.prompt([{
    type: 'list',
    name: 'stepType',
    choices: [{
      name: '新建步骤',
      value: 'add'
    }, {
      name: '删除步骤',
      value: 'del',
    }]
  }]);
  if (stepType === 'add') {
    await addStep();
  } else if (stepType === 'del') {
    await delStep();
  }
}

module.exports = customStep;
