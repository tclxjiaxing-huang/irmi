const inquirer = require("inquirer");
const execCMD = require('../execCMD');
const gitUtil = require('../gitUtil');
const handleError = require('./handleError');
const log = require("../log");

const allSteps = {
	checkout,
	add,
	commit,
	pull,
	push,
	pushTag,
	branch,
	branchTag,
	tag,
	delBranch,
	delOriginBranch,
	delTag,
	delOriginTag,
	merge,
}
async function checkout (filePath, branchName) {
	const allLocalBranchs = await gitUtil.getAllBranch(filePath);
	if (!branchName) {
		// 若不存在，则需要选择切换分支
		const { newBranchName } = await inquirer.prompt([{
			type: 'list',
			name: 'newBranchName',
			message: '请选择需要切换分支',
			choices: allLocalBranchs,
		}]);
		branchName = newBranchName;
	}
	const nowBranch = await gitUtil.getCurrBranch(filePath);
	if (nowBranch === branchName) {
		log.text(`已处于${branchName}分支`);
		return;
	}
	if (!allLocalBranchs.includes(branchName)) {
		// 说明切换的分支不存在
		const {isCreateBranch} = await inquirer.prompt([{
			type: 'confirm',
			name: 'isCreateBranch',
			message: `${branchName}分支不存在，是否要创建`,
		}]);
		if (isCreateBranch) {
			await allSteps.branch(filePath, branchName);
		}
	}
	try {
		await execCMD.checkout(filePath, branchName);
		log.success(`已切换到${branchName}分支`);
	} catch (e) {
		const stepStr = await handleError(e.message);
		if (stepStr) {
			// 说明有其他步骤要走
			await execSteps(filePath, stepStr);
			// 完成后再次执行当前函数
			await checkout(filePath, branchName);
		}
	}
};

async function branch(filePath, branchName, tagName) {
	if (!branchName) {
		// 若不存在，则需要输入分支名称
		const { newBranch } = await inquirer.prompt([{
			type: 'input',
			name: 'newBranch',
			message: '请输入新分支名称',
		}]);
		branchName = newBranch;
	}
	const allLocalBranchs = await gitUtil.getAllBranch(filePath);
	if (allLocalBranchs.includes(branchName)) {
		log.error(`已存在名称为${branchName}的分支`);
		return;
	}
	try {
		await execCMD.branch(filePath, branchName, tagName);
		if (tagName) {
			log.success(`已从tag${tagName}中创建${branchName}新分支!`);
		} else {
			log.success(`创建${branchName}分支成功!`);
		}
	} catch (e) {
		await handleError(e.message);
	}
}

async function branchTag(filePath, branchName, tagName) {
	if (!tagName) {
		// 若不存在，则需要选择目标tag
		const allTag = await gitUtil.getAlreadyTag();
		const { newTagName } = await inquirer.prompt([{
			type: 'list',
			name: 'newTagName',
			message: '请选择需要目标标签',
			choices: allTag,
		}]);
		tagName = newTagName;
	}
	await branch(filePath, branchName, tagName);
}

async function delBranch(filePath, branchName) {
	const allLocalBranchs = await gitUtil.getAllBranch(filePath);
	if (!branchName) {
		// 若不存在，则需要选择删除分支
		const res = await inquirer.prompt([{
			type: 'list',
			name: 'branch',
			message: '请选择需要删除分支',
			choices: allLocalBranchs,
		}]);
		branch = res.branch;
	}
	try {
		if (!allLocalBranchs.includes(branchName)) {
			log.error(`${branchName}分支不存在，跳过当前步骤!`);
			return;
		}
		await execCMD.delBranch(filePath, branchName);
		log.success(`删除${branchName}分支成功!`);
	} catch (e) {
		await handleError(e.message);
	}
}

async function delOriginBranch(filePath, branchName) {
	if (!branchName) {
		// 若不存在，则需要选择删除分支
		const { newBranch } = await inquirer.prompt([{
			type: 'input',
			name: 'newBranch',
			message: '输入远程分支名称',
		}]);
		branchName = newBranch;
	}
	try {
		await execCMD.delOriginBranch(filePath, branchName);
		log.success(`删除远程${branchName}分支成功!`);
	} catch (e) {
		await handleError(e.message);
	}
}

async function add(filePath) {
	const isClear = await gitUtil.isWorkClear();
	if (isClear) {
		// 若工作区干净，则无需add
		log.text("工作区干净，跳过add。");
		return;
	}
	try {
		await execCMD.add(filePath);
		log.success('已添加到暂存区！');
	} catch (e) {
		await handleError(e.message);
	}
}

async function commit(filePath) {
	const isClear = await gitUtil.isTempClear();
	if (isClear) {
		// 若暂存区干净，则无需commit
		log.text("暂存区干净，跳过commit。");
		return;
	}
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
		const stepStr = await handleError(e.message);
		if (stepStr) {
			// 说明有其他步骤要走
			await execSteps(filePath, stepStr);
			// 完成后再次执行当前函数
			await commit(filePath);
		}
	}
}

async function pull(filePath, rebase) {
	try {
		await execCMD.pull(filePath, rebase ? '--rebase' : '');
		log.success("已从远程仓库更新!");
	} catch (e) {
		const stepStr = await handleError(e.message);
		if (stepStr) {
			// 说明有其他步骤要走
			await execSteps(filePath, stepStr);
			await pull(filePath);
		}
	}
}

async function push(filePath) {
	let tempClear = await gitUtil.isTempClear();
	const workClear = await gitUtil.isWorkClear();
	if (!workClear) {
		const { isAdd } = await inquirer.prompt([{
			type: 'confirm',
			name: 'isAdd',
			message: '工作区存在未add代码，是否add',
		}]);
		if (isAdd) {
			await add(filePath);
			tempClear = false;
		}
	}
	if (!tempClear) {
		const { isCommit } = await inquirer.prompt([{
			type: 'confirm',
			name: 'isCommit',
			message: '暂存区存在未commit代码，是否commit',
		}]);
		if (isCommit) {
			await commit(filePath);
		}
	}
	const needPush = await gitUtil.isNeedPush(filePath);
	if (!needPush) {
		log.text("暂存区和工作区干净，跳过push。");
		return;
	}
	try {
		await execCMD.push(filePath);
		log.success("已推送到远程仓库!");
	} catch (e) {
		const stepStr = await handleError(e.message);
		if (stepStr) {
			// 说明有其他步骤要走
			await execSteps(filePath, stepStr);
			await push(filePath);
		}
	}
}

async function pushTag(filePath) {
	try {
		await execCMD.pushTag(filePath);
		log.success("已推送标签到远程仓库!");
	} catch (e) {
		const stepStr = await handleError(e.message);
		if (stepStr) {
			// 说明有其他步骤要走
			await execSteps(filePath, stepStr);
			await pushTag(filePath);
		}
	}
}

async function merge(filePath, branch) {
	const allLocalBranchs = await gitUtil.getAllBranch(filePath);
	const nowBranch = await gitUtil.getCurrBranch(filePath);
	if (!branch) {
		// 若不存在，则需要选择合并分支
		const res = await inquirer.prompt([{
			type: 'list',
			name: 'branch',
			message: '请选择需要合并的分支',
			choices: allLocalBranchs.filter((item) => item !== nowBranch),
		}]);
		branch = res.branch;
	}
	if (!branch || !allLocalBranchs.includes(branch)) {
		// 说明合并的分支不存在，跳过
		log.error('没有目标分支，跳过当前步骤。');
		return;
	}
	try {
		await execCMD.merge(filePath, branch);
		log.success(`已将${branch}分支合并到当前分支(${nowBranch})`);
	} catch (e) {
		const stepStr = await handleError(e.message);
		if (stepStr) {
			// 说明有其他步骤要走
			await execSteps(filePath, stepStr);
			// 完成后再次执行当前函数
			await merge(filePath, branch);
		}
	}
}

async function tag(filePath, tagName, tagDesc) {
	if (!tagName) {
		// 若不存在，则需要输入分支名称
		const { newTag } = await inquirer.prompt([{
			type: 'input',
			name: 'newTag',
			message: '请输入新标签名称',
			validate: (value) => {
				if (value.length === 0) return '标签名称不能为空'
				return true;
			},
		}]);
		tagName = newTag;
	}
	if (!tagDesc) {
		// 若不存在，则需要输入标签描述
		const { newTagDesc } = await inquirer.prompt([{
			type: 'input',
			name: 'newTagDesc',
			message: '请输入新标签描述(回车可跳过)',
		}]);
		tagDesc = newTagDesc;
	}
	try {
		await execCMD.tag(filePath, tagName, tagDesc);
		log.success(`添加${tagName}标签成功!`);
	} catch (e) {
		const stepStr = await handleError(e.message);
		if (stepStr) {
			// 说明有其他步骤要走
			await execSteps(filePath, stepStr);
			await tag(filePath);
		}
	}
}

async function delTag(filePath, tagName) {
	if (!tagName) {
		// 若不存在，则需要输入标签名称
		const allTag = await gitUtil.getAlreadyTag();
		const { newTag } = await inquirer.prompt([{
			type: 'list',
			name: 'newTag',
			message: '请选择要删除的标签',
			validate: (value) => {
				if (value.length === 0) return '需至少选择一个标签';
				return true;
			},
			choices: allTag,
		}]);
		tagName = newTag;
	}
	try {
		await execCMD.delTag(filePath, tagName);
		log.success(`删除${tagName}标签成功!`);
	} catch (e) {
		const stepStr = await handleError(e.message);
		if (stepStr) {
			// 说明有其他步骤要走
			await execSteps(filePath, stepStr);
			await delTag(filePath);
		}
	}
}

async function delOriginTag(filePath, tagName) {
	if (!tagName) {
		// 若不存在，则需要输入标签名称
		const { newTag } = await inquirer.prompt([{
			type: 'input',
			name: 'newTag',
			message: '请输入远程标签名称',
		}]);
		tagName = newTag;
	}
	try {
		await execCMD.delOriginTag(filePath, tagName);
		log.success(`删除远程${tagName}标签成功!`);
	} catch (e) {
		const stepStr = await handleError(e.message);
		if (stepStr) {
			// 说明有其他步骤要走
			await execSteps(filePath, stepStr);
			await delOriginTag(filePath);
		}
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
