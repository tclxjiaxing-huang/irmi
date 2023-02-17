const log = require('./log');
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
