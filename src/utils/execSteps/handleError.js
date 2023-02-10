const inquirer = require("inquirer");
const log = require("../log");

async function changeBeforeSwitch() {
	const { isCommit } = await inquirer.prompt([{
		type: 'confirm',
		name: 'isCommit',
		message: '是否需要执行提交操作',
	}]);
	if (isCommit) {
		// 执行提交操作
		return "add-commit";
	}
	process.exit(0);
}

async function fixConflict() {
	const { isfix } = await inquirer.prompt([{
		type: 'confirm',
		name: 'isfix',
		message: '是否已经解决冲突',
	}]);
	if (isfix) {
		return;
	}
	process.exit(0);
}

async function pushFail() {
	const { isPull } = await inquirer.prompt([{
		type: 'confirm',
		name: 'isPull',
		message: '推送失败，远程和本地不一致，是否执行pull操作',
	}]);
	if (isPull) {
		return "pull";
	}
	process.exit(0);
}

async function timeOut() {
	const { isReDo } = await inquirer.prompt([{
		type: 'confirm',
		name: 'isReDo',
		message: '操作超时，是否重拾',
	}]);
	if (isReDo) {
		return "reExec";
	}
	process.exit(0);
}

async function pullFail() {
	return 'pull<rebase>';
}

async function notExistUpstreamBranch() {
	const { isCreateUpstreamBranch } = await inquirer.prompt([{
		type: 'confirm',
		name: 'isCreateUpstreamBranch',
		message: '是否创建对应的远程分支',
	}]);
	if (isCreateUpstreamBranch) {
		return "pushUpStream";
	}
	process.exit(0);
}

async function gitInit() {
	const { isInit } = await inquirer.prompt([{
		type: 'confirm',
		name: 'isInit',
		message: '是否进行git初始化',
	}]);
	if (isInit) {
		return "init";
	}
	process.exit(0);
}

const errMsgMap = [
	{
		msg: "fatal: not a git repository",
		desc: "当前项目还未git初始化",
		handleFunction: gitInit,
	},
	{
		msg: "Please commit your changes or stash them before you switch branches.",
		desc: "当前分支有修改文件，切换分支前，先提交本地改变。",
		handleFunction: changeBeforeSwitch,
	},
	{
		msg: "Command failed: git commit -m",
		desc: "暂存区没有修改，不需要描述信息",
	},
	{
		msg: "error: you need to resolve your current index first",
		desc: "存在合并冲突，请新开终端窗口进行解决",
		handleFunction: fixConflict,
	},
	{
		msg: "fatal: Exiting because of an unresolved conflict",
		desc: "存在未解决的冲突，请新开终端窗口进行解决",
		handleFunction: fixConflict,
	},
	{
		msg: "error: failed to push some refs to",
		desc: "推送失败",
		handleFunction: pushFail,
	},
	{
		msg: "Operation timed out",
		desc: "网络错误，操作超时",
		handleFunction: timeOut,
	},
	{
		msg: "fatal: Not possible to fast-forward, aborting.",
		desc: "拉取错误，将执行git pull --rebase操作",
		handleFunction: pullFail,
	},
	{
		msg: "error: please commit or stash them.",
		desc: "存在未提交到代码",
		handleFunction: changeBeforeSwitch,
	},
	{
		msg: "Command failed: git merge",
		desc: "合并分支失败",
		handleError: fixConflict,
	},
	{
		msg: "fatal: The current branch test has no upstream branch",
		desc: "当前分支不存在远程分支",
		handleError: notExistUpstreamBranch
	}
];
async function handleError(errMsg, ...args) {
	const find = errMsgMap.find((item) => ~errMsg.indexOf(item.msg));
	if (find) {
		find.desc && log.warning(find.desc);
		if (find.handleFunction instanceof Function) {
			return find.handleFunction(...args);
		}
	} else {
		log.red(errMsg);
	}
}

module.exports = handleError;
