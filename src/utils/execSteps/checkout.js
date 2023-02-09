const inquirer = require("inquirer");
const execCMD = require('../execCMD');
const execSteps = require('./index');
const gitUtil = require('../gitUtil');
const handleError = require('./handleError');
const log = require("../log");

async function checkout (filePath, branch) {
	if (!branch) {
		const allLocalBranchs = await gitUtil.getAllBranch(filePath);
		// 若不存在，则需要选择切换分支
		const res = await inquirer.prompt([{
			type: 'list',
			name: 'branch',
			message: '请选择分支',
			choices: allLocalBranchs,
		}]);
		branch = res.branch;
	}
	const nowBranch = await gitUtil.getCurrBranch(filePath);
	if (nowBranch === branch) {
		log.text(`已处于${branch}分支`);
		return;
	}
	try {
		await execCMD.checkout(filePath, branch);
		log.success(`已切换到${branch}分支`);
	} catch (e) {
		const stepStr = await handleError(e.message);
		if (stepStr) {
			// 说明有其他步骤要走
			console.log(execSteps);
		}
	}
};

module.exports = checkout;
