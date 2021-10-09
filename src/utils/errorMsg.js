const errList = [{
  msg: 'git pull ...', // 匹配文字
  desc: '正在拉取远程代码', // 描述
  value: 'pull', // 返回值
  isReCMD: true, // 是否再次执行上一步操作
}, {
  msg: 'No staged files match any of provided globs',
  desc: '未发现有修改的文件!',
  isReCMD: false,
  value: 'skip',
}, {
  msg: 'not a git repository',
  desc: '该项目没有git初始化!',
  value: 'init',
  isReCMD: false,
}, {
  msg: 'No configured push destination',
  desc: '该项目未配置远程仓库地址',
  value: 'origin',
  isReCMD: true,
}, {
  msg: ' does not appear to be a git repository',
  desc: '远程仓库地址有误!',
  value: 'errorOriginUrl',
  isReCMD: true,
}, {
  msg: 'To push the current branch and set the remote as upstream',
  desc: '当前分支没有与远程仓库建立连接!',
  value: 'errorOriginUrl',
  isReCMD: false,
}, {
  msg: 'Timed out',
  desc: '网络超时,正在重试!',
  value: 'timeOut',
  isReCMD: false,
}, {
  msg: 'Connection was reset',
  desc: '网络超时,正在重试!',
  value: 'timeOut',
  isReCMD: false,
}, {
  msg: 'did not match any file(s) known to git',
  desc: '分支不存在, 正在创建',
  value: 'notMatchBranch',
  isReCMD: true,
}, {
  msg: 'Please commit your changes or stash them before you switch branches',
  desc: '当前分支有代码未提交，正在提交',
  value: 'notCommitCode',
  isReCMD: true,
}, {
  msg: 'commit-msg hook exited with code 1',
  desc: 'commit描述格式错误',
  value: 'commitMsgErr',
  isReCMD: true,
}];

function errorMsg(msg) {
  for (let i = 0; i < errList.length; i += 1) {
    if (msg.indexOf(errList[i].msg) !== -1) {
      return errList[i];
    }
  }
  return null;
}

module.exports = errorMsg;
