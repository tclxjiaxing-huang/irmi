const inquirer = require('inquirer');
const {
  execCMD,
  red,
} = require('../../utils/utils');
const {
  setOrigin,
  init,
} = require('../../init');

// 异常情况策略
const abnormalList = {
  pull: pull,
  origin: origin,
  errorOriginUrl: errorOriginUrl,
  init: initGit,
  noUpStream: noUpStream,
  timeOut: timeOut,
  notMatchBranch: notMatchBranch,
  notCommitCode: notCommitCode,
  commitMsgErr: commitMsgErr,
}

// 先拉取
async function pull(params) {
  await execCMD.pull(...params);
}
// 设置远程仓库地址
async function origin(params) {
  await setOrigin(...params);
}
// 无效的远程仓库地址
async function errorOriginUrl(params, filePath) {
  await execCMD.remoteDel(filePath);
  await setOrigin(filePath);
}
// 初始化git项目
async function initGit(params, filePath) {
  await init(filePath);
}
// 当前分支需要先链接远程仓库
async function noUpStream(params, filePath, targetBranch, CMD) {
  const errObj = await execCMD.pushUpStream(filePath, targetBranch);
  if (typeof errObj === 'object') {
    await abnormal(errObj, params, filePath, targetBranch, CMD);
  }
}
// 推送网络超时
async function timeOut(params, filePath, targetBranch, CMD) {
  let num = 1;
  await (async function reTry() {
    await execCMD[CMD](...params).catch(async (errObj) => {
      if (errObj.value === 'timeOut') {
        num++;
        if (num >= 3) {
          red('网络错误!');
          process.exit(0);
          return;
        } else {
          await reTry();
        }
      };
    });
  })();
}
// 沒有对应的分支名称
async function notMatchBranch(params, filePath, targetBranch) {
  // 询问是否创建对应的分支
  const { isConfirm } = await inquirer.prompt([{
    type: 'confirm',
    message: `是否创建${targetBranch}分支`,
    name: 'isConfirm',
  }]);
  if (isConfirm) {
    await execCMD.branch(filePath, targetBranch);
  } else {
    process.exit(0);
  }
}
// 没有commit代码
async function notCommitCode(params, filePath) {
  await execCMD.add(filePath);
  await execCMD.commit(filePath);
}
// commit描述文字错误
async function commitMsgErr(params) {
  const { commitMsg } = await inquirer.prompt([{
    type: 'input',
    name: 'commitMsg',
    message: '请输入commit说明',
    default: '提交',
  }]);
  params[1] = commitMsg;
}

async function abnormal(resultObj, params, filePath, targetBranch, CMD) {
  if (resultObj.value !== 'skip') {
    await abnormalList[resultObj.value](params, filePath, targetBranch, CMD);
  }
}

module.exports = abnormal;
