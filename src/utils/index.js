const log = require('./log');
const files = require('./files');
const date = require('./date');
const execCMD = require('./execCMD');
const gitUtil = require('./gitUtil');
const errorMsg = require('./errorMsg');
// [
// 	files,
// 	date,
// 	log,
// 	CMD,
// 	gitUtil,
// 	errorMsg,
// ].forEach((util) => Object.assign(exports, util));
module.exports = {
	log,
	execCMD,
	...files,
}
