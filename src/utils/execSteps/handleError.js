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

const errMsgMap = [
	{
		msg: "Please commit your changes or stash them before you switch branches.",
		desc: "当前分支有修改文件，切换分支前，先提交本地改变。",
		handleFunction: changeBeforeSwitch,
	},
	{
		msg: "Command failed: git commit -m",
		desc: "暂存区没有修改，不需要描述信息",
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
