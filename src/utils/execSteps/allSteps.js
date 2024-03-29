const inquirer = require("inquirer");
const execCMD = require('../execCMD');
const gitUtil = require('../gitUtil');
const handleError = require('./handleError');
const log = require("../log");

const allSteps = {
	tag,
	add,
	pull,
	push,
	init,
	merge,
	delTag,
	branch,
	commit,
	pushTag,
	checkout,
	branchTag,
	delBranch,
	delOriginTag,
	pushUpStream,
	delOriginBranch,
}

async function init(filePath) {
	await execCMD.init(filePath);
	log.success('git初始化成功');
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
	await execCMD.checkout(filePath, branchName);
	log.success(`已切换到${branchName}分支`);
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
	await execCMD.branch(filePath, branchName, tagName);
	if (tagName) {
		log.success(`已从tag${tagName}中创建${branchName}新分支!`);
	} else {
		log.success(`创建${branchName}分支成功!`);
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
	if (!allLocalBranchs.includes(branchName)) {
		log.error(`${branchName}分支不存在，跳过当前步骤!`);
		return;
	}
	await execCMD.delBranch(filePath, branchName);
	log.success(`删除${branchName}分支成功!`);
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
	await execCMD.delOriginBranch(filePath, branchName);
	log.success(`删除远程${branchName}分支成功!`);
}

async function add(filePath) {
	const isClear = await gitUtil.isWorkClear(filePath);
	if (isClear) {
		// 若工作区干净，则无需add
		log.text("工作区干净，跳过add。");
		return;
	}
	await execCMD.add(filePath);
	log.success('已添加到暂存区！');
}

async function commit(filePath) {
	const isClear = await gitUtil.isTempClear(filePath);
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
	await execCMD.commit(filePath, commitMsg);
	log.success('已提交！');
}

async function pull(filePath, rebase) {
	await execCMD.pull(filePath, rebase ? '--rebase' : '');
	log.success("已从远程仓库更新!");
}

async function push(filePath) {
	let tempClear = await gitUtil.isTempClear(filePath);
	const workClear = await gitUtil.isWorkClear(filePath);
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
	const nowBranch = await gitUtil.getCurrBranch(filePath);
	const existBranch = await gitUtil.checkOriginBranch(filePath, nowBranch);
	if (existBranch) {
		const needPush = await gitUtil.isNeedPush(filePath);
		if (!needPush) {
			log.text("暂存区和工作区干净，跳过push。");
			return;
		}
	} else {
		const { isCreateUpstreamBranch } = await inquirer.prompt([{
			type: 'confirm',
			name: 'isCreateUpstreamBranch',
			message: '远程分支不存在，是否创建对应的远程分支',
		}]);
		if (isCreateUpstreamBranch) {
			const nowBranch = await gitUtil.getCurrBranch(filePath);
			await pushUpStream(filePath, nowBranch);
		}
	}
	await execCMD.push(filePath);
	log.success("已推送到远程仓库!");
}

async function pushUpStream(filePath, branch) {
	await execCMD.pushUpStream(filePath, branch);
	log.success("已创建远程分支!");
}

async function pushTag(filePath) {
	await execCMD.pushTag(filePath);
	log.success("已推送标签到远程仓库!");
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
	await execCMD.merge(filePath, branch);
	log.success(`已将${branch}分支合并到当前分支(${nowBranch})`);
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
	await execCMD.tag(filePath, tagName, tagDesc);
	log.success(`添加${tagName}标签成功!`);
}

async function delTag(filePath, tagName) {
	if (!tagName) {
		// 若不存在，则需要输入标签名称
		const allTag = await gitUtil.getAlreadyTag();
		const { newTag } = await inquirer.prompt([{
			type: 'list',
			name: 'newTag',
			message: '请选择要删除的标签。',
			validate: (value) => {
				if (value.length === 0) return '需至少选择一个标签';
				return true;
			},
			choices: allTag,
		}]);
		tagName = newTag;
	}
	await execCMD.delTag(filePath, tagName);
	log.success(`删除${tagName}标签成功!`);
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
	await execCMD.delOriginTag(filePath, tagName);
	log.success(`删除远程${tagName}标签成功!`);
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
				try {
					await allSteps[stepName](filePath, ...args);
				} catch(e) {
					const stepStr = await handleError(e.message);
					if (stepStr) {
						// 说明有其他步骤要走
						await execSteps(filePath, stepStr);
						await allSteps[stepName](filePath, ...args);
					}
				}
			}
		}
	}
}

module.exports = {
	allSteps,
	execSteps,
};
