const {
  readFilesPath,
  yellow,
  yellowBright,
  green,
  tempFileName,
  writeTempData,
} = require('./utils/utils');
const inquirer = require('inquirer');

function showProject() {
  const filesData = readFilesPath();
  yellow('***当前项目***');
  for (let i = 0; i < filesData.length; i += 1) {
    yellowBright(`${filesData[i].name}`)
  }
}

async function delProject() {
  const filesData = readFilesPath();
  const choices = filesData.map((file) => ({
    name: file.name,
    value: file.path,
  }));
  const { project }  = await inquirer.prompt([{
    type: 'list',
    name: 'project',
    choices: choices,
  }]);
  for (let i = 0; i < filesData.length; i += 1) {
    if (filesData[i].path === project) {
      green(`${filesData[i].name}删除成功`);
      filesData.splice(i, 1);
      writeTempData(tempFileName, filesData);
      return;
    }
  }
}

module.exports = {
  showProject,
  delProject,
};
