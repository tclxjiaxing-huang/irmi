const chalk = require('chalk');

const consoleLog = (colorLog) => {
  return (...rest) => console.log(colorLog(...rest));
}
const yellow = consoleLog(chalk.yellow);
const yellowBright = consoleLog(chalk.yellowBright);
const green = consoleLog(chalk.green);
const red = consoleLog(chalk.red);
const gray = consoleLog(chalk.gray);
const log = {
  success: green,
  tip: (msg) => yellow(`***${msg}***`),
  text: gray,
  warning: yellowBright,
  error: red,
  gray,
  red,
  green,
  yellow,
  yellowBright,
  chalk,
}

module.exports = log;
