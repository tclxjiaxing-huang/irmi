[
  'files',
  'date',
  'log',
  'CMD',
].forEach((util) => Object.assign(exports, require(`./${util}`)));
