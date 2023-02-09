const inquirer = require('inquirer');
const {
  log,
  getStepData,
  writeDataToHomeDir,
  stepFileName,
} = require('../../utils/index');

async function delStep() {
  const stepData = await getStepData();
  if (!stepData.length) {
    log.warning("没有配置自定义步骤。");
    return;
  }
  const { delSteps } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'delSteps',
    message: '请选择要删除步骤',
    validate: (value) => {
      if (value.length === 0) return '至少选择一个步骤'
      return true;
    },
    choices: stepData.map((step) => ({
      name: step.name,
      value: step.name,
    })),
  }]);
  delSteps.forEach((delStep) => {
    const findIndex = stepData.findIndex((step) => step.name === delStep);
    if (~findIndex) {
      stepData.splice(findIndex, 1);
    }
  });
  await writeDataToHomeDir(stepFileName, stepData);
  log.success(`删除${delSteps.join(',')}步骤成功`);
}

module.exports = delStep;
