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
	}
];
async function handleError(errMsg, ...args) {
	const find = errMsgMap.find((item) => ~errMsg.indexOf(item.msg));
	if (find) {
		log.warning(find.desc);
		return find.handleFunction(...args);
	}
}

module.exports = handleError;
