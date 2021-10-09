#!/usr/bin/env node
'use strict';

var commander$1 = require('commander');
var inquirer = require('inquirer');
var path = require('path');
var fs = require('fs');
var os = require('os');
var chalk = require('chalk');
var child_process = require('child_process');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
	if (e && e.__esModule) return e;
	var n = Object.create(null);
	if (e) {
		Object.keys(e).forEach(function (k) {
			if (k !== 'default') {
				var d = Object.getOwnPropertyDescriptor(e, k);
				Object.defineProperty(n, k, d.get ? d : {
					enumerable: true,
					get: function () {
						return e[k];
					}
				});
			}
		});
	}
	n['default'] = e;
	return Object.freeze(n);
}

var commander__default = /*#__PURE__*/_interopDefaultLegacy(commander$1);
var inquirer__default = /*#__PURE__*/_interopDefaultLegacy(inquirer);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var child_process__default = /*#__PURE__*/_interopDefaultLegacy(child_process);

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

const log = (colorLog) => {
  return (...rest) => console.log(colorLog(...rest));
};
const yellow$6 = log(chalk__default['default'].yellow);
const yellowBright$3 = log(chalk__default['default'].yellowBright);
const green$4 = log(chalk__default['default'].green);
const red$6 = log(chalk__default['default'].red);
const gray$1 = log(chalk__default['default'].gray);

var log_1 = {
  gray: gray$1,
  red: red$6,
  green: green$4,
  yellow: yellow$6,
  yellowBright: yellowBright$3,
  chalk: chalk__default['default'],
};
log_1.gray;
log_1.red;
log_1.green;
log_1.yellow;
log_1.yellowBright;
log_1.chalk;

const {
  red: red$5,
  yellow: yellow$5,
} = log_1;

const tempDirName = 'gat';
const tempFileName$2 = 'projectsPath.txt';
const tempStepFile$3 = 'customStep.txt';

// 查询文件是否存在
const isFileExist$1 = (file) => {
  return fs__default['default'].existsSync(file);
};

// 创建文件夹
const createFile = (path) => {
  return fs__default['default'].mkdirSync(path);
};

// 写入文件
const writeFile$1 = (path, data) => {
  return fs__default['default'].writeFileSync(path, data);
};

// 读取文件
const readFile = (path) => {
  return fs__default['default'].readFileSync(path, {
    encoding: 'utf8',
  });
};

// 向暂存目录中保存数据
const writeTempData$4 = (fileName, data) => {
  const tempDir = resolve$1(os__default['default'].tmpdir(), tempDirName);
  // 判断暂存目录中是否有缓存目录
  const isExistTempDir = isFileExist$1(tempDir);
  if (!isExistTempDir) {
    // 创建缓存目录
    createFile(tempDir);
  }
  const tempFile = resolve$1(os__default['default'].tmpdir(), tempDirName, fileName);
  writeFile$1(tempFile, JSON.stringify(data));
};
// 读取暂存目录中的文件数据
const readTempData$4 = (fileName) => {
  const tempDir = resolve$1(os__default['default'].tmpdir(), tempDirName);
  const tempFile = resolve$1(tempDir, fileName);
  if (isFileExist$1(tempFile)) {
    return readFile(tempFile);
  } else {
    return null;
  }
};

const resolve$1 = (...args) => {
  return path__default['default'].resolve(...args);
};

// 读取项目
const readFilesPath$3 = () => {
  const tempFile = resolve$1(os__default['default'].tmpdir(), tempDirName, tempFileName$2);
  if (isFileExist$1(tempFile)) {
    const fileData = JSON.parse(readFile(tempFile));
    if (fileData.length === 0) {
      yellow$5('暂无项目，请先添加');
      process.exit(0);
    }
    return fileData.map((file) => ({
      path: file.path,
      name: file.name.split('\\')[file.name.split('\\').length - 1],
    }));
  } else {
    red$5('暂无配置项目，请先执行config添加项目');
    process.exit(0);
  }
};

var files = {
  tempDirName,
  isFileExist: isFileExist$1,
  createFile,
  writeFile: writeFile$1,
  readFile,
  resolve: resolve$1,
  readFilesPath: readFilesPath$3,
  tempFileName: tempFileName$2,
  tempStepFile: tempStepFile$3,
  writeTempData: writeTempData$4,
  readTempData: readTempData$4,
};
files.tempDirName;
files.isFileExist;
files.createFile;
files.writeFile;
files.readFile;
files.resolve;
files.readFilesPath;
files.tempFileName;
files.tempStepFile;
files.writeTempData;
files.readTempData;

var getDate$1 = (value = new Date()) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  date.getHours();
  date.getMinutes();
  date.getSeconds();
  return `${year}-${month}-${day}`;
};

var date = {
	getDate: getDate$1
};

const errList = [{
  msg: 'git pull ...', // 匹配文字
  desc: '正在拉取远程代码', // 描述
  value: 'pull', // 返回值
  isReCMD: true, // 是否再次执行上一步操作
}, {
  msg: 'Command failed: git commit',
  desc: '未发现有修改的文件!',
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
  msg: 'src refspec czx does not match any',
  desc: '远程仓库地址有误!',
  value: 'errorOriginUrl',
  isReCMD: true,
}, {
  msg: 'To push the current branch and set the remote as upstream',
  desc: '当前分支没有与远程仓库建立连接!',
  value: 'noUpStream',
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
}];

function errorMsg(msg) {
  for (let i = 0; i < errList.length; i += 1) {
    if (msg.indexOf(errList[i].msg) !== -1) {
      return errList[i];
    }
  }
  return null;
}

var errorMsg_1 = errorMsg;

const { exec } = child_process__default['default'];
async function spin() {
  const ora = await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('ora')); });
  const spinner = ora.default({
    color: 'yellow',
  });
  return spinner;
}

const {
  red: red$4,
  yellow: yellow$4,
} = log_1;

async function CMD(path, execCode, afterTips = '', beforeTips = '') {
  return new Promise(async (resolve, reject) => {
    const spinner = await spin();
    beforeTips && spinner.start(beforeTips);
    exec(execCode, {
      cwd: path,
    }, (err, stdout) => {
      spinner.clear();
      if (err) {
        const errObj = errorMsg_1(JSON.stringify(err.message));
        errObj && yellow$4(`提示: ${errObj.desc}`);
        errObj && errObj.value && reject(errObj);
        !errObj && red$4(`error: ${err}`);
        return;
      }      afterTips && spinner.succeed(afterTips);
      resolve(stdout);
    });
  });
}

const init$3 = async (path) => await CMD(path, 'git init', '已初始化', '正在初始化...');
const add = async (path) => await CMD(path, 'git add .', '已添加到暂存区', '正在添加到暂存区...');
const commit = async (path, msg = '提交') => await CMD(path, `git commit -m ${msg}`, '已添加到本地仓库', '正在添加到本地仓库...');
const push$1 = async (path) => await CMD(path, `git push`, '已推送到远程仓库', '正在推送到远程仓库...');
const pushOrigin = async (path, branch = 'master') => await CMD(path, `git push -u origin ${branch}`, `已推送${branch}分支到远程仓库`, `正在推送${branch}分支到远程仓库...`);
const pushUpStream = async (path, branch = 'dev') => await CMD(path, `git push --set-upstream origin ${branch}`, `已与远程${branch}分支建立连接并推送`, `正在与远程${branch}分支建立连接并推送...`);
const pull$1 = async (path) => await CMD(path, `git pull`, '已从远程仓库拉取代码', '正在从远程仓库拉取代码...');
const checkout = async (path, branch = 'test') => await CMD(path, `git checkout ${branch}`, `已切换${branch}分支`, `正在切换${branch}分支...`);
const merge = async (path, branch = 'dev') => await CMD(path, `git merge ${branch}`, `已与${branch}分支合并`, `正在与${branch}分支合并...`);
const remoteSet = async (path, url) => await CMD(path, `git remote origin set-url ${url}`, `已修改远程仓库地址`, `正在修改远程仓库地址...`);
const remoteDel = async (path) => await CMD(path, `git remote rm origin`, `已删除远程仓库地址`, `正在删除远程仓库地址...`);
const remoteAdd = async (path, url) => await CMD(path, `git remote add origin ${url}`, `已配置远程仓库地址`, `正在配置远程仓库地址...`);
const branch = async (path, branch = 'dev') => await CMD(path, `git branch ${branch}`, `已创建${branch}分支`, `正在创建${branch}分支...`);
const delBranch = async (path, branch = 'dev') => await CMD(path, `git branch -D ${branch}`, `已删除${branch}分支`, `正在删除${branch}分支...`);
const checkBranch = async (path) => await CMD(path, `git branch -a`);
const status = async (path) => await CMD(path, `git status`, '');

// 标签命令
const tag$1 = (filePath, tagName, tagDesc) => execCMD$4.CMD(filePath, `git tag -a ${tagName} -m '${tagDesc}'`, `已打标签!(${tagName})`, `正在打标签!(${tagName})...`);
const pushTag = (filePath) => execCMD$4.CMD(filePath, `git push origin --tags`, '已推送标签到仓库!', '正在推送标签到仓库!...');
const delTag = (filePath, tagName) => execCMD$4.CMD(filePath, `git tag -d ${tagName}`, `已删除本地标签!(${tagName})`, `正在删除本地标签!(${tagName})...`);
const delOriginTag = (filePath, tagName) => execCMD$4.CMD(filePath, `git push origin :refs/tags/${tagName}`, `已删除远程标签!(${tagName})`, `正在删除远程标签!(${tagName})...`);

const execCMD$4 = {
  CMD,
  add,
  commit,
  push: push$1,
  pushOrigin,
  pushUpStream,
  checkout,
  merge,
  pull: pull$1,
  init: init$3,
  branch,
  delBranch,
  checkBranch,
  remoteAdd,
  remoteDel,
  remoteSet,
  status,
  tag: tag$1,
  pushTag,
  delTag,
  delOriginTag,
};

var CMD_1 = {
  execCMD: execCMD$4,
};
CMD_1.execCMD;

var utils = createCommonjsModule(function (module, exports) {
[
  files,
  date,
  log_1,
  CMD_1,
].forEach((util) => Object.assign(exports, util));
});

const {
  getDate,
  yellow: yellow$3,
  yellowBright: yellowBright$2,
  execCMD: execCMD$3,
  readFilesPath: readFilesPath$2,
} = utils;

// 获取已存在的tag
async function getAlreadyTag(filePath) {
  const result = await execCMD$3.CMD(filePath, 'git tag');
  const vList = result.split(/\n/);
  vList.pop();
  return vList;
}

// 展示所有项目的tag
async function showAllTag(filesData) {
  for (let i = 0; i < filesData.length; i += 1) {
    const vList = await getAlreadyTag(filesData[i].path);
    yellow$3(filesData[i].name);
    yellowBright$2(vList.join('\n'));
  }
}

// tag操作参数
async function getTagParams(vList) {
  const answers = await inquirer__default['default'].prompt([{
    type: 'input',
    name: 'tagName',
    default: () => {
      if (vList.length === 0) {
        return '1.0.0';
      }
      let lastV = vList[vList.length - 1];
      const regex = /\.(\d)\./;
      return lastV.replace(regex, (match, value) => {
        return `.${Number(value) + 1}.`;
      })
    },
    message: '请输入tag名称(为空则为小版本加1)',
  }, {
    type: 'input',
    name: 'tagDesc',
    default: `${getDate()}发布`,
    message: '请输入tag发布日期(为空则为今天)',
    validate: (value) => {
      if (!value) return true;
      const regex = /^\d{4}-\d{1,2}-\d{1,2}发布$/;
      if (!regex.test(value)) return 'tag描述格式错误(yyyy-mm-dd发布)';
      return true;
    }
  }]);
  return [answers.tagName, answers.tagDesc]
}

// del操作参数
async function getDelParams(vList) {
  const answers = await inquirer__default['default'].prompt([{
    type: 'list',
    name: 'tagName',
    message: '请选择要删除的tag',
    choices: vList,
  }]);
  return [answers.tagName];
}

// 选择操作
async function chooseOptions$1() {
  const filesData = readFilesPath$2();
  const choices = filesData.map((file) => ({
    name: file.name,
    value: file.path,
  }));
  let { filesList } = await inquirer__default['default'].prompt([{
    type: 'checkbox',
    name: 'filesList',
    message: '选择应用(不选择则全部应用)',
    choices: choices,
  }]);
  const { options } = await inquirer__default['default'].prompt([{
    type: 'list',
    name: 'options',
    message: '选择操作',
    choices: [{
      name: '打标签',
      value: 'tag',
    }, {
      name: '推送到远程仓库',
      value: 'pushTag',
    }, {
      name: '打标签->推送到远程仓库',
      value: 'tag-pushTag',
    }, {
      name: '删除本地标签',
      value: 'delTag',
    }, {
      name: '删除远程标签',
      value: 'delOriginTag',
    }, {
      name: '删除本地标签->删除远程标签',
      value: 'delTag-delOriginTag',
    }, {
      name: '展示所有项目的标签',
      value: 'showAllTag',
    }],
  }]);
  if (!filesList) {
    filesList = filesData;
  }
  filesList = filesData.filter((file) => filesList.includes(file.path));
  if (options === 'showAllTag') {
    await showAllTag(filesData);
  } else {
    let params = [];
    const vList = await getAlreadyTag(filesList[0].path);
    if (options.indexOf('tag') !== -1) {
      params = await getTagParams(vList);
    }
    if (options.indexOf('del') !== -1) {
      params = await getDelParams(vList);
    }
    for (let i = 0; i < filesList.length; i += 1) {
      yellowBright$2(`***当前应用[${filesList[i].name}]***`);
      await chooseSubOptions$1(filesList[i].path, options, params);
    }
  }
}

// 子操作
async function chooseSubOptions$1(filePath, options, specParams) {
  const steps = options.split('-');
  const params = [filePath, ...specParams];
  for (let i = 0; i < steps.length; i += 1) {
    await execCMD$3[steps[i]](...params);
  }
}

var tag = chooseOptions$1;

const {
  execCMD: execCMD$2,
  writeFile,
  resolve,
} = utils;

// 初始化项目
async function init$2(filePath) {
  await execCMD$2.init(filePath);
  writeFile(resolve(filePath, '.gitignore'), 'node_modules\n');
  await execCMD$2.add(filePath);
  await execCMD$2.commit(filePath);
  await execCMD$2.branch(filePath, 'dev');
  await execCMD$2.branch(filePath, 'test');
  await execCMD$2.checkout(filePath, 'dev');
}
// 获取当前分支
async function getCurrBranch$1(filePath) {
  const result = await execCMD$2.status(filePath);
  const regx = /^On branch (.*)/;
  const res = result.match(regx);
  if (res) {
    return res[1];
  }
  return 'dev';
}
// 配置远程仓库地址
async function setOrigin$2(filePath) {
  const { orginUrl } = await inquirer__default['default'].prompt([{
    type: 'input',
    name: 'orginUrl',
    message: '请输入远程仓库地址!',
    validate: (res) => {
      if (!res) return '远程仓库地址不能为空';
      return true;
    },
  }]);
  await execCMD$2.remoteAdd(filePath, orginUrl);
  const res = await execCMD$2.pushOrigin(filePath, 'master');
  if (res === 'errorOriginUrl') {
    await execCMD$2.remoteDel(filePath);
    await setOrigin$2(filePath);
  }
}

var init_1 = {
  init: init$2,
  getCurrBranch: getCurrBranch$1,
  setOrigin: setOrigin$2,
};

const {
  execCMD: execCMD$1,
  red: red$3,
} = utils;
const {
  setOrigin: setOrigin$1,
  init: init$1,
} = init_1;

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
};

// 先拉取
async function pull(params) {
  await execCMD$1.pull(...params);
}
// 设置远程仓库地址
async function origin(params) {
  await setOrigin$1(...params);
}
// 无效的远程仓库地址
async function errorOriginUrl(params, filePath) {
  await execCMD$1.remoteDel(filePath);
  await setOrigin$1(filePath);
}
// 初始化git项目
async function initGit(params, filePath) {
  await init$1(filePath);
}
// 当前分支需要先链接远程仓库
async function noUpStream(params, filePath, targetBranch) {
  await execCMD$1.pushUpStream(filePath, targetBranch);
}
// 推送网络超时
async function timeOut(params, filePath, targetBranch, CMD) {
  let num = 1;
  await (async function reTry() {
    await execCMD$1[CMD](...params).catch(async (errObj) => {
      if (errObj.value === 'timeOut') {
        num++;
        if (num >= 3) {
          red$3('网络错误!');
          process.exit(0);
          return;
        } else {
          await reTry();
        }
      }    });
  })();
}
// 沒有对应的分支名称
async function notMatchBranch(params, filePath, targetBranch) {
  // 询问是否创建对应的分支
  const { isConfirm } = await inquirer__default['default'].prompt([{
    type: 'confirm',
    message: `是否创建${targetBranch}分支`,
    name: 'isConfirm',
  }]);
  if (isConfirm) {
    await execCMD$1.branch(filePath, targetBranch);
  } else {
    process.exit(0);
  }
}
// 没有commit代码
async function notCommitCode(params, filePath) {
  await execCMD$1.add(filePath);
  await execCMD$1.commit(filePath);
}

async function abnormal(resultObj, params, filePath, targetBranch, CMD) {
  await abnormalList[resultObj.value](params, filePath, targetBranch, CMD);
  resultObj.isReCMD && await execCMD$1[CMD](...params);
}

var abnormal_1 = abnormal;

const {
  execCMD,
  red: red$2,
  yellow: yellow$2,
  readFilesPath: readFilesPath$1,
  readTempData: readTempData$3,
  tempStepFile: tempStepFile$2,
} = utils;
const {
  init,
  setOrigin,
  getCurrBranch,
} = init_1;


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
// 获取所有分支
async function getAllBranch(filePath) {
  const branch = await execCMD.checkBranch(filePath);
  return branch.split('\n').map((item) => item.replace(/^[\s\*]*/, '')).filter((item) => item && item.indexOf('remotes') === -1);
}

async function chooseSubOptions(filePath, options) {
  const steps = options.split('-'); // 所有步骤
  const branchRegx = /^(.*)\((.*)\)$/; //带有分支的命令正则
  for (let i = 0; i < steps.length; i += 1) {
    let currBranch = await getCurrBranch(); // 当前分支
    let targetBranch = currBranch; // 如果涉及到分支操作的目标分支
    const isBranch = branchRegx.test(steps[i]); // 当前步骤是否有分支操作
    let CMD = steps[i]; // 统一命令方法
    const params = [filePath]; // 统一命令方法的参数 [文件路径, commit说明/分支]
    const isCommit = steps[i].indexOf('commit') !== -1; // 当前步骤是否有commit操作，有的话会提示输入备注
    const isDelBranch = steps[i].indexOf('delBranch') !== -1; // 当前步骤是否有commit操作，有的话会提示输入备注
    if (isCommit) {
      const { commitMsg } = await inquirer__default['default'].prompt([{
        type: 'input',
        name: 'commitMsg',
        message: '请输入commit说明',
        default: '提交',
      }]);
      params.push(commitMsg);
    }
    if (isDelBranch) {
      const branchList = await getAllBranch(filePath);
      const { delBranch } = await inquirer__default['default'].prompt([{
        type: 'list',
        name: 'delBranch',
        message: '请输入commit说明',
        choices: branchList.map((item) => ({
          name: item,
          value: item,
        })),
      }]);
      params.push(delBranch);
    }
    if (isBranch) {
      targetBranch = steps[i].match(branchRegx)[2]; // 如果是分支操作，则第二个参数为分支名称
      params.push(targetBranch);
      CMD = steps[i].match(branchRegx)[1]; // 如果是分支操作，则匹配出分支操作的正确方法名
    }
    await execCMD[CMD](...params).catch(async (errObj) => {
      await abnormal_1(errObj, params, filePath, targetBranch, CMD);
    });
  }
}

// 读取缓存中的自定义步骤
async function getCustomStep() {
  const res = await JSON.parse(readTempData$3(tempStepFile$2));
  if (res && res.push) {
    return res.push.map((item) => ({
      name: item.label,
      value: item.value,
    }));
  }
  return [];
}
function getProjectName(filePath) {
  return filePath.split('\\')[filePath.split('\\').length - 1];
}
async function chooseOptions() {
  const filesData = readFilesPath$1();
  const choices = filesData.map((file) => ({
    name: file.name,
    value: file.path,
  }));
  const customStep = await getCustomStep();
  let { filesList } = await inquirer__default['default'].prompt([{
    type: 'checkbox',
    name: 'filesList',
    message: '选择应用(不选择则全部应用)',
    choices: choices,
  }]);
  if (!filesList) {
    filesList = filesData;
  }
  const { options } = await inquirer__default['default'].prompt([{
    type: 'list',
    name: 'options',
    choices: defaultStep.concat(customStep),
  }]);
  for (let i = 0; i < filesList.length; i += 1) {
    await checkoutDev(filesList[i]);
    yellow$2(`***当前应用[${getProjectName(filesList[i])}]***`);
    yellow$2(`***当前步骤[${options}]***`);
    await chooseSubOptions(filesList[i], options);
  }
}

var push = chooseOptions;

const {
  isFileExist,
  red: red$1,
  green: green$3,
  gray,
  yellowBright: yellowBright$1,
  writeTempData: writeTempData$3,
  readTempData: readTempData$2,
  tempFileName: tempFileName$1,
} = utils;

const filePathRegx = /^[A-Z]:(\\{1,2}[\w-]+)+$/;

function saveFile(filePath) {
  if (!filePathRegx.test(filePath)) {
    red$1('当前路径有误，需为项目根目录的绝对路径，请重新输入!');
    return;
  }
  const fileList = filePath.split(',').map((file) => ({
    name: file.split('\\')[file.split('\\').length - 1],
    path: file,
  }));
  let fileData = JSON.parse(readTempData$2(tempFileName$1));
  if (!fileData) {
    fileData = [];
  }
  let isNew = false;
  for (let i = 0; i < fileList.length; i += 1) {
    if (fileData.length === 0) {
      if (isFileExist(fileList[i].path)) {
        fileData.push(fileList[i]);
        isNew = true;
      } else {
        red$1(`${fileList[i].name}目录不存在!`);
      }
    } else {
      for (let j = 0; j < fileData.length; j += 1) {
        if (fileList[i].path === fileData[j].path) {
          gray(`${fileList[i].path}项目已存在，跳过！`);
          break;
        } else if (j === fileData.length - 1) {
          if (isFileExist(fileList[i].path)) {
            fileData.push(fileList[i]);
            isNew = true;
          } else {
            red$1(`${fileList[i].name}目录不存在!`);
          }
        }
      }
    }
  }
  if (fileData.length > 0) {
    writeTempData$3(tempFileName$1, fileData);
    isNew && green$3('***保存成功***');
    green$3('***配置完成***');
    green$3('--已有项目--');
    for (let i = 0; i < fileData.length; i += 1) {
      yellowBright$1(`${fileData[i].name}`);
    }
  }
}

var saveFilesPath = saveFile;

const {
  readFilesPath,
  yellow: yellow$1,
  yellowBright,
  green: green$2,
  tempFileName,
  writeTempData: writeTempData$2,
} = utils;


function showProject$1() {
  const filesData = readFilesPath();
  yellow$1('***当前项目***');
  for (let i = 0; i < filesData.length; i += 1) {
    yellowBright(`${filesData[i].name}`);
  }
}

async function delProject$1() {
  const filesData = readFilesPath();
  const choices = filesData.map((file) => ({
    name: file.name,
    value: file.path,
  }));
  const { project }  = await inquirer__default['default'].prompt([{
    type: 'list',
    name: 'project',
    choices: choices,
  }]);
  for (let i = 0; i < filesData.length; i += 1) {
    if (filesData[i].path === project) {
      green$2(`${filesData[i].name}删除成功`);
      filesData.splice(i, 1);
      writeTempData$2(tempFileName, filesData);
      return;
    }
  }
}

var project = {
  showProject: showProject$1,
  delProject: delProject$1,
};

const {
  readTempData: readTempData$1,
  writeTempData: writeTempData$1,
  tempStepFile: tempStepFile$1,
  red,
  green: green$1,
} = utils;

async function delPush() {
  const step = await JSON.parse(readTempData$1(tempStepFile$1));
  if (step && Array.isArray(step.push) && step.push.length > 0) {
    const { push } = step;
    const { stepList } = await inquirer__default['default'].prompt([{
      type: 'checkbox',
      name: 'stepList',
      message: '选择要删除步骤',
      choices: push.map((item) => ({
        name: item.label,
        value: item.value,
      })),
    }]);
    for (let i = 0; i < push.length; i += 1) {
      for (let j = 0; j < stepList.length; j += 1) {
        if (push[i].value === stepList[j]) {
          push.splice(i, 1);
          i--;
          break;
        }
      }
    }
    step.push = push;
    await writeTempData$1(tempStepFile$1, step);
    green$1('***删除步骤成功***');
  } else {
    red('暂无自定义的推送步骤');
  }
}

async function delStep() {
  const { type } = await inquirer__default['default'].prompt([{
    type: 'list',
    name: 'type',
    choices: [{
      name: '推送步骤',
      value: 'push'
    }, {
      name: '打标签步骤',
      value: 'tag'
    }],
  }]);
  if (type === 'push') {
    await delPush();
  }
}

var delStep_1 = delStep;

const {
  readTempData,
  writeTempData,
  tempStepFile,
  green,
  yellow,
} = utils;


// 推送步骤
const pushStepList = {
  add: {
    name: '添加到暂存区(add)',
    value: 'add',
  },
  commit: {
    name: '添加到本地仓库(commit)',
    value: 'commit',
  },
  push: {
    name: '推送到远程仓库(push)',
    value: 'push',
  },
  checkout: {
    name: '切换分支(checkout)',
    value: 'checkout(branchName)',
    prompt: [{
      type: 'input',
      name: 'branchName',
      message: '请输入切换的分支名称',
    }],
  },
  merge: {
    name: '合并分支(merge)',
    value: 'merge(branchName)',
    prompt: [{
      type: 'input',
      name: 'branchName',
      message: '请输入目标分支名称',
    }],
  },
  pull: {
    name: '拉取代码(pull)',
    value: 'pull',
  },
  finish: {
    name: '完成',
    value: 'finish',
    prompt: null,
  },
};

// 保存步骤
async function saveStep(data, type) {
  let stepData = JSON.parse(readTempData(tempStepFile));
  if (!stepData) {
    stepData = {
      push: [],
      tag: [],
    };
  }
  if (type === 'push') {
    stepData['push'].push(data);
  }
  writeTempData(tempStepFile, stepData);
  yellow(data.value);
  green('***推送步骤保存成功***');
}

// 命名
async function setName() {
  const { name } = await inquirer__default['default'].prompt([{
    type: 'input',
    name: 'name',
    message: '请为步骤输入一个名字',
    validate: (value) => {
      if (!value) return '名字不能为空';
      return true;
    }
  }]);
  return name;
}

async function pushStep() {
  let isFinsh = false;
  const subStepRegx = /^(.*)\((.*)\)$/;
  const stepList = [];
  let lastStep = null;
  let stepNum = 0;
  while (!isFinsh) {
    stepNum++;
    let { stepTag } = await inquirer__default['default'].prompt([{
      type: 'list',
      name: 'stepTag',
      message: `选择第${stepNum}步骤`,
      choices: Object.keys(pushStepList).filter((step) => pushStepList[step].value !== lastStep).map((step) => ({
        name: pushStepList[step].name,
        value: pushStepList[step].value,
      })),
    }]);
    let stepName = '';
    let stepValue = stepTag;
    // 判断是否有追加选项
    const subStep = stepTag.match(subStepRegx);
    if (subStep) {
      stepValue = stepTag = subStep[1];
      stepName = pushStepList[stepTag].name.replace(/\(.*\)/, '');
      const answer = await inquirer__default['default'].prompt(pushStepList[stepTag].prompt);
      stepValue += `(${answer[subStep[2]]})`;
      stepName += `(${answer[subStep[2]]})`;
    } else {
      stepName = pushStepList[stepTag].name;
    }
    if (stepTag === 'finish') {
      if (stepList.length === 0) {
        yellow('至少包含一个步骤');
      } else {
        isFinsh = true;
      }
    } else if (stepValue !== lastStep){
      stepList.push({
        name: stepName,
        value: stepValue,
      });
      lastStep = stepValue;
    }
  }
  const stepPrompt = {
    name: [],
    value: [],
    label: '',
  };
  stepList.forEach((step) => {
    stepPrompt.name.push(step.name);
    stepPrompt.value.push(step.value);
  });
  stepPrompt.name = stepPrompt.name.join('->');
  stepPrompt.value = stepPrompt.value.join('-');
  stepPrompt.label = await setName();
  await saveStep(stepPrompt, 'push');
}

async function customStep() {
  const { stepType } = await inquirer__default['default'].prompt([{
    type: 'list',
    name: 'stepType',
    choices: [{
      name: '推送步骤',
      value: 'push'
    }, {
      name: '打标签步骤',
      value: 'tag',
    }, {
      name: '删除步骤',
      value: 'del',
    }]
  }]);
  if (stepType === 'push') {
    await pushStep();
  } else if (stepType === 'tag') ; else if (stepType === 'del') {
    await delStep_1();
  }
}

var customStep_1 = customStep;

// #!/usr/bin/env node

const { Command } = commander__default['default'];



const {
  showProject,
  delProject,
} = project;
// yellow(logo);
const program = new Command();

program.version('1.1.1');

program
  .command('config <filePath>')
  .description('配置项目文件路径(多个项目逗号隔开)')
  .action((filePath) => {
    saveFilesPath(filePath);
  });

program
  .command('push')
  .description('代码提交相关')
  .action(() => {
    push();
  });

program
  .command('tag')
  .description('打标签相关')
  .action(() => {
    tag();
  });

program
  .command('show')
  .description('展示已有项目')
  .action(() => {
    showProject();
  });

program
  .command('del')
  .description('删除已有项目')
  .action(async () => {
    await delProject();
  });

program
  .command('step')
  .description('自定义步骤')
  .action(async () => {
    await customStep_1();
  });

program.parse(process.argv);

var commander = {

};

module.exports = commander;
