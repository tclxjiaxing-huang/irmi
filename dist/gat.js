'use strict';

var commander$1 = require('commander');
var inquirer = require('inquirer');
var path = require('path');
var fs = require('fs');
var os = require('os');
var chalk = require('chalk');
var child_process = require('child_process');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

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
const yellow$4 = log(chalk__default['default'].yellow);
const yellowBright$4 = log(chalk__default['default'].yellowBright);
const green$3 = log(chalk__default['default'].green);
const red$3 = log(chalk__default['default'].red);
const gray$1 = log(chalk__default['default'].gray);

var log_1 = {
  gray: gray$1,
  red: red$3,
  green: green$3,
  yellow: yellow$4,
  yellowBright: yellowBright$4,
};
log_1.gray;
log_1.red;
log_1.green;
log_1.yellow;
log_1.yellowBright;

const {
  red: red$2,
  yellow: yellow$3,
} = log_1;

const tempDirName = 'gat';
const tempFileName$2 = 'projectsPath.txt';

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
const writeTempData$2 = (fileName, data) => {
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
const readTempData$1 = (fileName) => {
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
      yellow$3('暂无项目，请先添加');
      process.exit(0);
    }
    return fileData.map((file) => ({
      path: file.path,
      name: file.name.split('\\')[file.name.split('\\').length - 1],
    }));
  } else {
    red$2('暂无配置项目，请先执行config添加项目');
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
  writeTempData: writeTempData$2,
  readTempData: readTempData$1,
};
files.tempDirName;
files.isFileExist;
files.createFile;
files.writeFile;
files.readFile;
files.resolve;
files.readFilesPath;
files.tempFileName;
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
  msg: 'The current branch dev has no upstream branch',
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

const {
  red: red$1,
  green: green$2,
  yellow: yellow$2,
} = log_1;

async function CMD(path, execCode, tips = '') {
  return new Promise((resolve) => {
    exec(execCode, {
      cwd: path,
    }, (err, stdout) => {
      if (err) {
        const errObj = errorMsg_1(JSON.stringify(err.message));
        errObj && yellow$2(`提示: ${errObj.desc}`);
        errObj && errObj.value && resolve(errObj.value);
        !errObj && red$1(`error: ${err}`);
        return;
      }      tips && green$2(tips);
      resolve(stdout);
    });
  })
}

const remoteSet = async (path, url) => await CMD(path, `git remote origin set-url ${url}`, `已修改远程仓库地址`);
const remoteDel = async (path) => await CMD(path, `git remote rm origin`, `已删除远程仓库地址`);
const remoteAdd = async (path, url) => await CMD(path, `git remote add origin ${url}`, `已配置远程仓库地址`);
const branch = async (path, branch = 'dev') => await CMD(path, `git branch ${branch}`, `已创建${branch}分支`);
const init$1 = async (path) => await CMD(path, 'git init', '已初始化');
const add = async (path) => await CMD(path, 'git add .', '已添加到暂存区');
const commit = async (path, msg = '提交') => await CMD(path, `git commit -m ${msg}`, '已添加到本地仓库');
const push$1 = async (path) => await CMD(path, `git push`, '已推送到远程仓库');
const pushOrigin = async (path, branch = 'master') => await CMD(path, `git push -u origin ${branch}`, `已推送${branch}分支到远程仓库`);
const pushUpStream = async (path, branch = 'dev') => await CMD(path, `git push --set-upstream origin ${branch}`, `已与远程${branch}分支建立连接并推送`);
const pull = async (path) => await CMD(path, `git pull`, '已从远程仓库拉取代码');
const checkout = async (path, branch = 'test') => await CMD(path, `git checkout ${branch}`, `已切换${branch}分支`);
const merge = async (path, branch = 'dev') => await CMD(path, `git merge ${branch}`, `已与${branch}分支合并`);

const execCMD$2 = {
  CMD,
  add,
  commit,
  push: push$1,
  pushOrigin,
  pushUpStream,
  checkout,
  merge,
  pull,
  init: init$1,
  branch,
  remoteAdd,
  remoteDel,
  remoteSet,
};

var CMD_1 = {
  execCMD: execCMD$2,
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
  yellow: yellow$1,
  yellowBright: yellowBright$3,
  execCMD: execCMD$1,
  readFilesPath: readFilesPath$2,
} = utils;

// 获取已存在的tag
async function getAlreadyTag(filePath) {
  const result = await execCMD$1.CMD(filePath, 'git tag');
  const vList = result.split(/\n/);
  vList.pop();
  return vList;
}

// 标签命令
const tag = (filePath, tagName, tagDesc) => execCMD$1.CMD(filePath, `git tag -a ${tagName} -m '${tagDesc}'`, `已打标签!(${tagName})`);
const pushTag = (filePath) => execCMD$1.CMD(filePath, `git push origin --tags`, '已推送标签到仓库!');
const delTag = (filePath, tagName) => execCMD$1.CMD(filePath, `git tag -d ${tagName}`, `已删除本地标签!(${tagName})`);
const delOriginTag = (filePath, tagName) => execCMD$1.CMD(filePath, `git push origin :refs/tags/${tagName}`, `已删除远程标签!(${tagName})`);
const tagCMD = {
  tag,
  pushTag,
  delTag,
  delOriginTag,
};

// 展示所有项目的tag
async function showAllTag(filesData) {
  for (let i = 0; i < filesData.length; i += 1) {
    const vList = await getAlreadyTag(filesData[i].path);
    yellow$1(filesData[i].name);
    yellowBright$3(vList.join('\n'));
  }
}

// tag操作参数
async function getTagParams(vList) {
  const answers = await inquirer__default['default'].prompt([{
    type: 'input',
    name: 'tagName',
    default: () => {
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
  const { options } = await inquirer__default['default'].prompt([{
    type: 'list',
    name: 'options',
    message: '选择操作',
    choices: [{
      name: '打标签',
      value: 'tag',
    }, {
      name: '打标签->推送到远程仓库',
      value: 'tag-pushTag',
    }, {
      name: '删除本地标签',
      value: 'delTag',
    }, {
      name: '删除本地标签->删除远程标签',
      value: 'delTag-delOriginTag',
    }, {
      name: '展示所有项目的标签',
      value: 'showAllTag',
    }],
  }]);
  if (options === 'showAllTag') {
    await showAllTag(filesData);
  } else {
    let params = [];
    const vList = await getAlreadyTag(filesData[0].path);
    if (options.indexOf('tag') !== -1) {
      params = await getTagParams(vList);
    }
    if (options.indexOf('del') !== -1) {
      params = await getDelParams(vList);
    }
    for (let i = 0; i < filesData.length; i += 1) {
      yellowBright$3(`***当前应用[${filesData[i].name}]***`);
      await chooseSubOptions$1(filesData[i].path, options, params);
    }
  }
}

// 子操作
async function chooseSubOptions$1(filePath, options, specParams) {
  const steps = options.split('-');
  const params = [filePath, ...specParams];
  for (let i = 0; i < steps.length; i += 1) {
    await tagCMD[steps[i]](...params);
  }
}

var tag_1 = chooseOptions$1;

const {
  execCMD,
  yellowBright: yellowBright$2,
  readFilesPath: readFilesPath$1,
  writeFile,
  resolve,
} = utils;

// 初始化项目
async function init(filePath) {
  await execCMD.init(filePath);
  writeFile(resolve(filePath, '.gitignore'), 'node_modules\n');
  await execCMD.add(filePath);
  await execCMD.commit(filePath);
  await execCMD.branch(filePath, 'dev');
  await execCMD.branch(filePath, 'test');
  await execCMD.checkout(filePath, 'dev');
}
// 配置远程仓库地址
async function setOrigin(filePath) {
  const { orginUrl } = await inquirer__default['default'].prompt([{
    type: 'input',
    name: 'orginUrl',
    message: '请输入远程仓库地址!',
    validate: (res) => {
      if (!res) return '远程仓库地址不能为空';
      return true;
    },
  }]);
  await execCMD.remoteAdd(filePath, orginUrl);
  const res = await execCMD.pushOrigin(filePath, 'master');
  if (res === 'errorOriginUrl') {
    await execCMD.remoteDel(filePath);
    await setOrigin(filePath);
  }
}

async function chooseSubOptions(filePath, options) {
  const steps = options.split('-'); // 所有步骤
  const branchRegx = /^(.*)\((.*)\)$/; //带有分支的命令正则
  console.log(steps);
  for (let i = 0; i < steps.length; i += 1) {
    const isBranch = branchRegx.test(steps[i]); // 当前步骤是否有分支操作
    let CMD = steps[i]; // 统一命令方法
    const param = [filePath]; // 统一命令方法的参数 [文件路径, commit说明/分支]
    const isCommit = steps[i].indexOf('commit') !== -1; // 当前步骤是否有commit操作，有的话会提示输入备注
    if (isCommit) {
      const { commitMsg } = await inquirer__default['default'].prompt([{
        type: 'input',
        name: 'commitMsg',
        message: '请输入commit说明',
        default: '提交',
      }]);
      param.push(commitMsg);
    }
    isBranch && param.push(steps[i].match(branchRegx)[2]); // 如果是分支操作，则第二个参数为分支名称
    isBranch && (CMD = steps[i].match(branchRegx)[1]); // 如果是分支操作，则匹配出分支操作的正确方法名
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
      await execCMD.pushUpStream(filePath, 'dev');
    } else if (result === 'timeOut') {
      await (async function reTry() {
        const res = await execCMD[CMD](...param);
        if (res === 'timeOut') {
          await reTry();
        }      })();
    }
  }
}

async function chooseOptions() {
  const filesData = readFilesPath$1();
  const choices = filesData.map((file) => ({
    name: file.name,
    value: file.path,
  }));
  const { fileList } = await inquirer__default['default'].prompt([{
    type: 'checkbox',
    name: 'fileList',
    message: '选择应用',
    choices: choices,
    validate: (res) => {
      if (res.length > 0) return true;
      return '必须选择至少一个项目!';
    },
  }]);
  const { options } = await inquirer__default['default'].prompt([{
    type: 'list',
    name: 'options',
    choices: [{
      name: '提交代码',
      value: 'add-commit',
    }, {
      name: '提交代码->推送',
      value: 'add-commit-push',
    }, {
      name: '合并到test',
      value: 'checkout(test)-merge(dev)-checkout(dev)',
    }, {
      name: '提交代码->合并到test',
      value: 'add-commit-checkout(test)-merge(dev)-checkout(dev)',
    }, {
      name: '提交代码->推送->合并到test->推送',
      value: 'add-commit-push-checkout(test)-merge(dev)-push-checkout(dev)',
    }, {
      name: '合并到master',
      value: 'checkout(master)-merge(dev)-checkout(dev)',
    }, {
      name: '合并到master->推送',
      value: 'checkout(master)-merge(dev)-push-checkout(dev)',
    }],
  }]);
  for (let i = 0; i < fileList.length; i += 1) {
    yellowBright$2(`***当前应用[${fileList[i]}]***`);
    await chooseSubOptions(fileList[i], options);
  }
}

var push = chooseOptions;

const {
  isFileExist,
  red,
  green: green$1,
  gray,
  yellowBright: yellowBright$1,
  writeTempData: writeTempData$1,
  readTempData,
  tempFileName: tempFileName$1,
} = utils;

const filePathRegx = /^[A-Z]:(\\{1,2}[\w-]+)+$/;

function saveFile(filePath) {
  if (!filePathRegx.test(filePath)) {
    red('当前路径有误，需为项目根目录的绝对路径，请重新输入!');
    return;
  }
  const fileList = filePath.split(',').map((file) => ({
    name: file.split('\\')[file.split('\\').length - 1],
    path: file,
  }));
  let fileData = JSON.parse(readTempData(tempFileName$1));
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
        red(`${fileList[i].name}目录不存在!`);
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
            red(`${fileList[i].name}目录不存在!`);
          }
        }
      }
    }
  }
  if (fileData.length > 0) {
    writeTempData$1(tempFileName$1, fileData);
    isNew && green$1('***保存成功***');
    green$1('***配置完成***');
    green$1('--已有项目--');
    for (let i = 0; i < fileData.length; i += 1) {
      yellowBright$1(`${fileData[i].name}`);
    }
  }
}

var saveFilesPath = saveFile;

const {
  readFilesPath,
  yellow,
  yellowBright,
  green,
  tempFileName,
  writeTempData,
} = utils;


function showProject$1() {
  const filesData = readFilesPath();
  yellow('***当前项目***');
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
      green(`${filesData[i].name}删除成功`);
      filesData.splice(i, 1);
      writeTempData(tempFileName, filesData);
      return;
    }
  }
}

var project = {
  showProject: showProject$1,
  delProject: delProject$1,
};

const { Command } = commander__default['default'];



const {
  showProject,
  delProject,
} = project;


const program = new Command();

program.version('1.0.0');

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
    tag_1();
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

// program
//   .command('customStep')
//   .description('自定义步骤')
//   .action(async () => {
//     await customStep();
//   });

program.parse(process.argv);

var commander = {

};

module.exports = commander;
