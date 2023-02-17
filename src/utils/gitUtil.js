const execCMD = require('./execCMD');

// 获取所有分支
async function getAllBranch(filePath, isRemote = false) {
  const branch = await execCMD.checkBranch(filePath);
  if (typeof branch === 'object') {
    process.exit(0);
  }
  const allBranch = branch.split('\n').map((item) => item.replace(/^[\s\*]*/, ''));
  if (isRemote) return allBranch.filter((item) => item && item.indexOf('remotes') !== -1);
  return allBranch.filter((item) => item && item.indexOf('remotes') === -1);
}

// 检测是否有远程分支
async function checkRemote(filePath) {
  const result = await execCMD.checkRemote(filePath);
  if (result.indexOf('push') !== -1) {
    return true;
  }
  return false;
}
// 检测远程是否有目标分支
async function checkOriginBranch(filePath, targetBranch) {
  const branchList = await getAllBranch(filePath, true);
  const res = branchList.find((branch) => {
    if (branch.indexOf(targetBranch) !== -1) return true;
    return false;
  });
  if (!res) return false;
  return true;
}

// 执行命令
async function executeCMD(CMD, params) {
  let result = '';
  await (async function execute() {
    result = await execCMD[CMD](...params);
  })();
  return result;
}

// 获取当前分支
async function getCurrBranch(filePath) {
  const result = await execCMD.status(filePath);
  if (typeof result === 'object') {
    return null;
  }
  const regx = /^On branch (.*)/;
  const res = result.match(regx);
  if (res) {
    return res[1];
  }
  return 'dev';
}

async function isTempClear(filePath) {
  const result = await execCMD.status(filePath);
  if (!~result.indexOf('Changes to be committed')) {
    // 说明暂存区是干净的
    return true;
  }
  return false;
}
async function isWorkClear(filePath) {
  const result = await execCMD.status(filePath);
  if (!~result.indexOf('Changes not staged for commit') && !isHasUntracked(filePath)) {
    // 说明工作区干净
    return true;
  }
  return false;
}

// 是否有新文件添加
async function isHasUntracked(filePath) {
  const result = await execCMD.status(filePath);
  if (!~result.indexOf('Untracked files:')) {
    return true;
  }
  return false;
}
async function isNeedPush(filePath) {
  const result = await execCMD.status(filePath);
  if (~result.indexOf('use "git push" to publish your local commits')) {
    // 说明需要push
    return true;
  }
  return false;
}

// 获取已存在的tag
async function getAlreadyTag(filePath) {
  const result = await executeCMD('checkTag', [filePath]);
  if (!result) process.exit(0);
  const vList = result.split(/\n/);
  vList.pop();
  return vList;
}

module.exports = {
  isNeedPush,
  executeCMD,
  isTempClear,
  isWorkClear,
  checkRemote,
  getAllBranch,
  getCurrBranch,
  getAlreadyTag,
  checkOriginBranch,
}
