const log = require('./log');
const date = require('./date');
const files = require('./files');
const execCMD = require('./execCMD');
const allSteps = require('./execSteps');
const gitUtil = require('./gitUtil');
const errorMsg = require('./errorMsg');
module.exports = {
	log,
	execCMD,
	...allSteps,
	...files,
}
