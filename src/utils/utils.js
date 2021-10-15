const files = require('./files');
const date = require('./date');
const log = require('./log');
const CMD = require('./CMD');
[
  files,
  date,
  log,
  CMD,
].forEach((util) => Object.assign(exports, util));
