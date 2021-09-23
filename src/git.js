const inquirer = require('inquirer');
const tag = require('./command/tag/tag.js');
const push = require('./command/push/push.js');

// 选择操作
async function chooseOptions() {
  const answers = await inquirer.prompt([{
    type: 'list',
    name: 'options',
    message: '选择操作',
    choices: [{
      name: 'push代码',
      value: 'push',
    }, {
      name: 'tag标签',
      value: 'Tag',
    }],
  }])
  if (answers.options === 'Tag') {
    await tag();
  } else if (answers.options === 'push') {
    await push();
  }
}

chooseOptions();
