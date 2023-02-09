const inquirer = require("inquirer");
const execCMD = require('../execCMD');
const gitUtil = require('../gitUtil');
const handleError = require('./handleError');
const log = require("../log");

const allSteps = {
	checkout,
	add,
	commit,
}
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
			await execSteps(filePath, stepStr);
			// 完成后再次执行当前函数
			await checkout(filePath, branch);
		}
	}
};

async function add(filePath) {
	try {
		await execCMD.add(filePath);
		log.success('已添加到暂存区！');
	} catch (e) {
		console.log(e);
	}
}

async function commit(filePath) {
	// 输入描述
	const { commitMsg } = await inquirer.prompt([{
		type: 'input',
		name: 'commitMsg',
		message: '请输入提交描述',
		validate: (value) => {
			if (value.length === 0) return '描述内容不能为空'
			return true;
		},
	}]);
	try {
		await execCMD.commit(filePath, commitMsg);
		log.success('已提交！');
	} catch (e) {
		console.log(e);
	}
}

async function execSteps(filePath, stepStr) {
	const steps = stepStr.split('-'); // 所有步骤
	const matchName = /^([a-zA-Z]+)(?:<([\w,]+)>)?/;
	for (let i = 0; i < steps.length; i += 1) {
		const step = steps[i];
		if (matchName.test(step)) {
			let [, stepName, args] = step.match(matchName);
			args = args ? args.split(',') : [];
			if (allSteps[stepName] instanceof Function) {
				await allSteps[stepName](filePath, ...args);
			}
		}
	}
}

module.exports = {
	allSteps,
	execSteps,
};
