const inquirer = require('inquirer');
const {
  execCMD,
} = require('./CMD');
const {
  red,
} = require('./log')
const {
  setOrigin,
  init,
} = require('../init');

// 异常情况策略
const abnormalList = {
  pull: pull,
  origin: origin,
  errorOriginUrl: errorOriginUrl,
  notConnectOriginUrl: notConnectOriginUrl,
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
async function errorOriginUrl(params) {
  await execCMD.remoteDel(params[0]);
  await setOrigin(params[0]);
}
// 当前分支没有与远程分支建立连接
async function notConnectOriginUrl(params, targetBranch) {
  await execCMD.pushUpStream(...params, targetBranch);
}
// 初始化git项目
async function initGit(params) {
  await init(params[0]);
}
// 当前分支需要先链接远程仓库
async function noUpStream(params, targetBranch, CMD) {
  const errObj = await execCMD.pushUpStream(params[0], targetBranch);
  if (typeof errObj === 'object') {
    await abnormal(errObj, params, targetBranch, CMD);
  }
}
// 推送网络超时
async function timeOut(params, targetBranch, CMD) {
  let num = 1;
  await (async function reTry() {
    const errObj = await execCMD[CMD](...params);
    if (typeof errObj === 'object' && errObj.value === 'timeOut') {
      num++;
      if (num >= 3) {
        red('网络错误!请检查网络!!');
        process.exit(0);
        return;
      } else {
        await reTry();
      }
    }
  })();
}
// 沒有对应的分支名称
async function notMatchBranch(params, targetBranch) {
  // 询问是否创建对应的分支
  const { isConfirm } = await inquirer.prompt([{
    type: 'confirm',
    message: `是否创建${targetBranch}分支`,
    name: 'isConfirm',
  }]);
  if (isConfirm) {
    await execCMD.branch(params[0], targetBranch);
  } else {
    process.exit(0);
  }
}
// 没有commit代码
async function notCommitCode(params) {
  await execCMD.add(params[0]);
  await execCMD.commit(params[0]);
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

async function abnormal(resultObj, params, targetBranch, CMD) {
  if (resultObj.value !== 'skip') {
    await abnormalList[resultObj.value](params, targetBranch, CMD);
  }
}

module.exports = abnormal;
