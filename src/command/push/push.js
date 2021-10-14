const inquirer = require('inquirer');
const {
  execCMD,
  yellowBright,
  readFilesPath,
  readTempData,
  tempStepFile,
} = require('../../utils/utils');
const {
  checkOriginBranch,
  checkRemote,
  getAllBranch,
  executeCMD,
  getCurrBranch,
} = require('../../utils/gitUtil');

// 默认步骤
const defaultStep = [{
  name: '提交代码',
  value: 'add-commit',
}, {
  name: '提交代码->推送',
  value: 'add-commit-push',
},  {
  name: '提交代码->推送->合并到test->推送',
  value: 'add-commit-push-checkout(test)-merge(dev)-push-checkout(dev)',
},  {
  name: '删除分支',
  value: 'delBranch',
},  {
  name: '创建分支',
  value: 'branch',
}];


// 询问是否删除远程分支
async function askDelOriginBranch(params) {
  const hasRemote = await checkRemote(params[0]);
  const hasRemoteBranch = await checkOriginBranch(params[0], params[1]);
  if (hasRemote && hasRemoteBranch) {
    // 询问是否删除远程分支
    const { isDelRemote } = await inquirer.prompt([{
      type: 'confirm',
      message: '该分支存在远程分支，是否删除？',
      name: 'isDelRemote',
    }]);
    isDelRemote && await executeCMD('delOriginBranch', params, params[1]);
  }
}

// 询问是否添加远程分支
async function askAddOriginBranch(params) {
  const hasRemote = await checkRemote(params[0]);
  const hasRemoteBranch = await checkOriginBranch(params[0], params[1]);
  if (hasRemote) {
    if (hasRemoteBranch) {
      // 询问是否链接远程仓库并拉取远程分支代码
      const { isUpstreamRemote } = await inquirer.prompt([{
        type: 'confirm',
        message: '该分支存在远程分支，是否链接？',
        name: 'isUpstreamRemote',
      }]);
      isUpstreamRemote && await executeCMD('pushUpStream', params, params[1]);
    } else {
      // 询问是否推送当前分支到远程分支上
      const { isPushRemote } = await inquirer.prompt([{
        type: 'confirm',
        message: '是否推送到远程仓库？',
        name: 'isPushRemote',
      }]);
      isPushRemote && await executeCMD('pushUpStream', params, params[1]);
    }
  }
}

// 执行系列命令前，先切换到dev分支
async function checkoutDev(filePath) {
  const branch = 'dev';
  const result = await execCMD.checkout(filePath, branch);
  if (result.value === 'notMatchBranch') {
    await execCMD.branch(filePath, branch);
    await checkoutDev(filePath);
  }
}

// 执行步骤
async function chooseSubOptions(filePath, options) {
  const steps = options.split('-'); // 所有步骤
  const branchRegx = /^(.*)\((.*)\)$/; //带有分支的命令正则
  for (let i = 0; i < steps.length; i += 1) {
    let currBranch = await getCurrBranch(filePath); // 当前分支
    let targetBranch = currBranch; // 如果涉及到分支操作的目标分支
    const isSubBranch = branchRegx.test(steps[i]); // 当前步骤是否有分支操作
    let CMD = steps[i]; // 统一命令方法
    const params = [filePath]; // 统一命令方法的参数 [文件路径, commit说明/分支]
    const isCommit = ['commit'].includes(steps[i]); // 当前步骤是否有commit操作，有的话会提示输入备注
    const isDelBranch = ['delBranch', 'delOriginBranch'].includes(steps[i]); // 当前步骤是否有删除分支操作，有的话会提示输入备注
    const isCreateBranch = ['branch', 'pushUpStream'].includes(steps[i]); // 当前步骤是否有创建分钟操作，有的话会提示输入备注
    if (isCommit) {
      // commit操作
      const { commitMsg } = await inquirer.prompt([{
        type: 'input',
        name: 'commitMsg',
        message: '请输入commit说明',
        default: '提交',
      }]);
      params.push(commitMsg);
    }
    if (isDelBranch) {
      // 删除分支
      const branchList = await getAllBranch(filePath);
      const { delBranch } = await inquirer.prompt([{
        type: 'list',
        name: 'delBranch',
        message: '请选择要删除的分支',
        choices: branchList.map((item) => ({
          name: item,
          value: item,
        })),
      }]);
      params.push(delBranch);
    }
    if (isCreateBranch) {
      // 创建分支
      const { branchName } = await inquirer.prompt([{
        type: 'input',
        name: 'branchName',
        message: '请输入分支名称',
        default: 'dev',
      }]);
      params.push(branchName);
    }
    if (isSubBranch) {
      targetBranch = steps[i].match(branchRegx)[2]; // 如果是分支操作，则第二个参数为分支名称
      params.push(targetBranch);
      CMD = steps[i].match(branchRegx)[1]; // 如果是分支操作，则匹配出分支操作的正确方法名
    }
    await executeCMD(CMD, params, targetBranch);
    isCreateBranch && await askAddOriginBranch(params);
    isDelBranch && await askDelOriginBranch(params);
  }
}

// 读取缓存中的自定义步骤
async function getCustomStep() {
  const res = await JSON.parse(readTempData(tempStepFile));
  if (res && res.push) {
    return res.push.map((item) => ({
      name: item.label,
      value: item.value,
    }));
  }
  return [];
}
// 获取项目名称
function getProjectName(filePath) {
  return filePath.split('\\')[filePath.split('\\').length - 1];
}
// 选择应用
async function chooseOptions() {
  const filesData = readFilesPath();
  const choices = filesData.map((file) => ({
    name: file.name,
    value: file.path,
  }));
  const customStep = await getCustomStep();
  let { filesList } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'filesList',
    message: '选择应用(不选择则全部应用)',
    choices: choices,
  }]);
  if (!filesList) {
    filesList = filesData;
  }
  const { options } = await inquirer.prompt([{
    type: 'list',
    name: 'options',
    choices: defaultStep.concat(customStep),
  }]);
  for (let i = 0; i < filesList.length; i += 1) {
    await checkoutDev(filesList[i]);
    yellowBright(`***当前应用[${getProjectName(filesList[i])}]***`);
    yellowBright(`***当前步骤[${options}]***`);
    await chooseSubOptions(filesList[i], options);
  }
}

module.exports = chooseOptions;
