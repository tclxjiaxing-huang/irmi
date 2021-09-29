const inquirer = require('inquirer');
const {
  execCMD,
  red,
  yellowBright,
  readFilesPath,
  readTempData,
  tempStepFile,
} = require('../../utils/utils');
const {
  init,
  setOrigin,
  getCurrBranch,
} = require('../../init');

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
}];

// 执行系列命令前，先切换到dev分支
async function checkoutDev(filePath) {
  const branch = 'dev';
  const result = await execCMD.checkout(filePath, branch);
  if (result === 'notMatchBranch') {
    await execCMD.branch(filePath, branch);
    await checkoutDev(filePath);
  }
}

async function chooseSubOptions(filePath, options) {
  const steps = options.split('-'); // 所有步骤
  const branchRegx = /^(.*)\((.*)\)$/; //带有分支的命令正则
  for (let i = 0; i < steps.length; i += 1) {
    let currBranch = await getCurrBranch(); // 当前分支
    let targetBranch = currBranch; // 如果涉及到分支操作的目标分支
    const isBranch = branchRegx.test(steps[i]); // 当前步骤是否有分支操作
    let CMD = steps[i]; // 统一命令方法
    const param = [filePath]; // 统一命令方法的参数 [文件路径, commit说明/分支]
    const isCommit = steps[i].indexOf('commit') !== -1; // 当前步骤是否有commit操作，有的话会提示输入备注
    if (isCommit) {
      const { commitMsg } = await inquirer.prompt([{
        type: 'input',
        name: 'commitMsg',
        message: '请输入commit说明',
        default: '提交',
      }]);
      param.push(commitMsg)
    }
    if (isBranch) {
      targetBranch = steps[i].match(branchRegx)[2]; // 如果是分支操作，则第二个参数为分支名称
      param.push(targetBranch);
      CMD = steps[i].match(branchRegx)[1]; // 如果是分支操作，则匹配出分支操作的正确方法名
    }
    const result = await execCMD[CMD](...param);
    if (result === 'pull') {
      await execCMD.pull(...param);
      await execCMD[CMD](...param);
    } else if (result === 'origin') {
      await setOrigin(...param);
      await execCMD[CMD](...param);
    } else if (result === 'errorOriginUrl') {
      await execCMD.remoteDel(filePath);
      await setOrigin(filePath);
      await execCMD[CMD](...param);
    } else if (result === 'init') {
      await init(filePath);
    } else if (result === 'noUpStream') {
      await execCMD.pushUpStream(filePath, targetBranch);
    } else if (result === 'timeOut') {
      let num = 1;
      await (async function reTry() {
        const res = await execCMD[CMD](...param);
        if (res === 'timeOut') {
          num++;
          if (num >= 3) {
            red('网络错误!');
            process.exit(0);
            return;
          } else {
            await reTry();
          }
        };
      })();
    } else if (result === 'notMatchBranch') {
      await execCMD.branch(filePath, targetBranch);
      await execCMD[CMD](...param);
    } else if (result === 'notCommitCode') {
      await execCMD.add(filePath);
      await execCMD.commit(filePath);
      await execCMD[CMD](...param);
    }
  }
}

// 读取缓存中的自定义步骤
async function getCustomStep() {
  const res = await JSON.parse(readTempData(tempStepFile));
  if (res && res.push) {
    return res.push;
  }
  return [];
}
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
    yellowBright(`***当前应用[${filesList[i]}]***`);
    await chooseSubOptions(filesList[i], options);
  }
}

module.exports = chooseOptions;
