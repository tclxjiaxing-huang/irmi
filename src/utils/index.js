const log = require('./log');
const date = require('./date');
const files = require('./files');
const execCMD = require('./execCMD');
const allSteps = require('./execSteps');
const gitUtil = require('./gitUtil');
module.exports = {
	log,
	execCMD,
	gitUtil,
	...allSteps,
	...files,
}
