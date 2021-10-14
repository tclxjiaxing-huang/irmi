const files = require('./files');
const date = require('./date');
const log = require('./log');
const CMD = require('./CMD');
const gitUtil = require('./gitUtil');
[
  files,
  date,
  log,
  CMD,
  gitUtil,
].forEach((util) => Object.assign(exports, util));
