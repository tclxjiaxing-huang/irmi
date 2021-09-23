const errList = [{
  msg: 'git pull ...', // 匹配文字
  desc: '正在拉取远程代码', // 描述
  value: 'pull', // 返回值
}, {
  msg: 'Command failed: git commit',
  desc: '未发现有修改的文件!',
  value: 'skip',
}, {
  msg: 'not a git repository',
  desc: '该项目没有git初始化!',
  value: 'init',
}, {
  msg: 'No configured push destination',
  desc: '该项目未配置远程仓库地址',
  value: 'origin',
}, {
  msg: 'src refspec czx does not match any',
  desc: '远程仓库地址有误!',
  value: 'errorOriginUrl',
}, {
  msg: 'has no upstream branch',
  desc: '当前分支没有与远程仓库建立连接!',
  value: 'noUpStream',
}, {
  msg: 'Timed out',
  desc: '网络超时,正在重试!',
  value: 'timeOut',
}, {
  msg: 'Connection was reset',
  desc: '网络超时,正在重试!',
  value: 'timeOut',
}, {
  msg: 'did not match any file(s) known to git',
  desc: '分支不存在, 正在创建',
  value: 'notMatchBranch',
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
