const { log, execSteps} = require('../../utils');
async function git(options) {
	const steps = Object.keys(options);
	for (let i = 0; i < steps.length; i += 1) {
		await execSteps(process.cwd(), steps[i]);
	}
	log.success("执行成功!");
}

module.exports = git;
