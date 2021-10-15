const { exec } = require('child_process');
const spinner = require('./spinner');
const errorMsg = require('./errorMsg');
const {
  red,
  yellow,
  green,
} = require('./log');

async function CMD(path, execCode, afterTips = '', beforeTips = '') {
  return new Promise(async (resolve) => {
    beforeTips && await spinner.start(beforeTips);
    exec(execCode, {
      cwd: path,
    }, async (err, stdout) => {
      spinner.isSpinning && await spinner.clear();
      if (err) {
        const errObj = errorMsg(JSON.stringify(err.message));
        errObj && yellow(`提示: ${errObj.desc}`);
        !errObj && red(`error: ${err}`);
        errObj && errObj.value && resolve(errObj);
        return;
      };
      afterTips && await spinner.succeed(afterTips);
      // afterTips && green(afterTips);
      resolve(stdout);
    });
  });
}

const init = async (path) => await CMD(path, 'git init', '已初始化', '正在初始化...');
const add = async (path) => await CMD(path, 'git add .', '已添加到暂存区', '正在添加到暂存区...');
const commit = async (path, msg = '提交') => await CMD(path, `git commit -m "${msg}"`, '已添加到本地仓库', '正在添加到本地仓库...');
const push = async (path) => await CMD(path, `git push`, '已推送到远程仓库', '正在推送到远程仓库...');
const pushOrigin = async (path, branch = 'master') => await CMD(path, `git push -u origin ${branch}`, `已推送${branch}分支到远程仓库`, `正在推送${branch}分支到远程仓库...`);
const pushUpStream = async (path, branch = 'dev') => await CMD(path, `git push --set-upstream origin ${branch}`, `已与远程${branch}分支建立连接并推送`, `正在与远程${branch}分支建立连接并推送...`);
const checkRemote = async (path) => await CMD(path, `git remote -v`, '');
const pull = async (path) => await CMD(path, `git pull`, '已从远程仓库拉取代码', '正在从远程仓库拉取代码...');
const checkout = async (path, branch = 'test') => await CMD(path, `git checkout ${branch}`, `已切换${branch}分支`, `正在切换${branch}分支...`);
const merge = async (path, branch = 'dev') => await CMD(path, `git merge ${branch}`, `已与${branch}分支合并`, `正在与${branch}分支合并...`);
const remoteSet = async (path, url) => await CMD(path, `git remote origin set-url ${url}`, `已修改远程仓库地址`, `正在修改远程仓库地址...`);
const remoteDel = async (path) => await CMD(path, `git remote rm origin`, `已删除远程仓库地址`, `正在删除远程仓库地址...`);
const remoteAdd = async (path, url) => await CMD(path, `git remote add origin ${url}`, `已配置远程仓库地址`, `正在配置远程仓库地址...`);
const branch = async (path, branch = 'dev') => await CMD(path, `git branch ${branch}`, `已创建${branch}分支`, `正在创建${branch}分支...`);
const delBranch = async (path, branch = 'dev') => await CMD(path, `git branch -D ${branch}`, `已删除${branch}分支`, `正在删除${branch}分支...`);
const delOriginBranch = async (path, branch = 'dev') => await CMD(path, `git push origin --delete ${branch}`, `已删除远程${branch}分支`, `正在删除远程${branch}分支...`);
const checkBranch = async (path) => await CMD(path, `git branch -a`);
const status = async (path) => await CMD(path, `git status`, '');
// 标签命令
const tag = (filePath, tagName, tagDesc) => execCMD.CMD(filePath, `git tag -a ${tagName} -m '${tagDesc}'`, `已打标签!(${tagName})`, `正在打标签!(${tagName})...`);
const pushTag = (filePath) => execCMD.CMD(filePath, `git push origin --tags`, '已推送标签到仓库!', '正在推送标签到仓库!...');
const delTag = (filePath, tagName) => execCMD.CMD(filePath, `git tag -d ${tagName}`, `已删除本地标签!(${tagName})`, `正在删除本地标签!(${tagName})...`);
const delOriginTag = (filePath, tagName) => execCMD.CMD(filePath, `git push origin :refs/tags/${tagName}`, `已删除远程标签!(${tagName})`, `正在删除远程标签!(${tagName})...`);
const checkTag = (filePath) => execCMD.CMD(filePath, 'git tag');

const execCMD = {
  CMD,
  add,
  commit,
  push,
  pushOrigin,
  pushUpStream,
  checkRemote,
  checkout,
  merge,
  pull,
  init,
  branch,
  delBranch,
  checkBranch,
  remoteAdd,
  remoteDel,
  remoteSet,
  status,
  tag,
  pushTag,
  delTag,
  delOriginTag,
  delOriginBranch,
  checkTag,
}

module.exports = {
  execCMD,
};
