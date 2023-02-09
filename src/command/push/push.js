const inquirer = require('inquirer');
const {
  log,
  getStepData,
  getProjectData,
  execSteps,
} = require('../../utils');

// 默认步骤
const defaultStep = [{
  name: '切换到dev->提交代码->推送->合并到test->合并dev->推送->切换到dev',
  value: 'checkout<dev>-add-commit-push-checkout<test>-merge<dev>-push-checkout<dev>',
}];

// 获取项目名称
function getProjectName(filePath) {
  if (filePath.indexOf(':') !== -1) {
    return filePath.split('\\')[filePath.split('\\').length - 1];
  }
  return filePath.split('\/')[filePath.split('\/').length - 1];
}

// 选择应用
async function chooseProject() {
  const filesData = getProjectData();
  if (filesData.length === 0) {
    log.warning('暂未配置任何项目，请先进行配置！');
    process.exit(0);
  }
  const choices = filesData.map((file) => ({
    name: file.name,
    value: file.path,
  }));
  let { projectList } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'projectList',
    message: '选择应用',
    validate: (value) => {
      if (value.length === 0) return '至少选择一个应用'
      return true;
    },
    choices,
  }]);
  // 若用户没有选择，则结束程序
  if (!projectList || (Array.isArray(projectList) && projectList.length === 0)) {
    process.exit(0)
  }
  chooseStep(projectList);
}

// 执行步骤
async function startExecSteps(filePath, stepStr) {
  await execSteps(filePath, stepStr);
  log.success("执行完成！");
}
// 选择步骤
async function chooseStep(projectList) {
  const customStep = getStepData();
  const { stepStr } = await inquirer.prompt([{
    type: 'list',
    name: 'stepStr',
    choices: defaultStep.concat(customStep),
  }]);
  for (let i = 0; i < projectList.length; i += 1) {
    log.tip(`当前应用[${getProjectName(projectList[i])}]`);
    log.tip(`当前步骤[${stepStr}`);
    await startExecSteps(projectList[i], stepStr);
  }
}

function execPush(options) {
  if (options.choose) {
    // 列出项目，自行选择
    chooseProject();
  } else {
    // 以当前目录进行操作
    chooseStep([process.cwd()]);
  }
}

module.exports = execPush;
