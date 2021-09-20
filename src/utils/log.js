const chalk = require('chalk');

const log = (colorLog) => {
  return (...rest) => console.log(colorLog(...rest));
}
const yellow = log(chalk.yellow);
const yellowBright = log(chalk.yellowBright);
const green = log(chalk.green);
const red = log(chalk.red);
const gray = log(chalk.gray);

module.exports = {
  gray,
  red,
  green,
  yellow,
  yellowBright,
}
