const {
  execCMD,
  red,
} = require('../../utils/utils');
const {
  setOrigin,
  init,
} = require('../../init');

const abnormalList = {
  pull: pull,
  origin: origin,
  errorOriginUrl: errorOriginUrl,
  init: initGit,
  noUpStream: noUpStream,
  timeOut: timeOut,
  notMatchBranch: notMatchBranch,
  notCommitCode: notCommitCode,
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
async function noUpStream(params, filePath, targetBranch) {
  await execCMD.pushUpStream(filePath, targetBranch);
}
// 推送网络超时
async function timeOut(params, filePath, targetBranch, CMD) {
  let num = 1;
  await (async function reTry() {
    const res = await execCMD[CMD](...params);
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
}
// 沒有对应的分支名称
async function notMatchBranch(params, filePath, targetBranch) {
  await execCMD.branch(filePath, targetBranch);
}
// 没有commit代码
async function notCommitCode(params, filePath) {
  await execCMD.add(filePath);
  await execCMD.commit(filePath);
}

async function abnormal(resultObj, params, filePath, targetBranch, CMD) {
  console.log(resultObj);
  await abnormalList[resultObj.value](params, filePath, targetBranch, CMD);
  resultObj.isReCMD && await execCMD[CMD](...params);
}

module.exports = abnormal;