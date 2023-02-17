const {
  log,
  projectFileName,
  writeDataToHomeDir,
  getProjectData,
} = require('../../utils');
const inquirer = require('inquirer');

function showProject() {
  const filesData = getProjectData();
  if (!filesData.length) {
    log.yellow('***暂未配置任何项目***');
  } else {
    log.yellow('***已配置项目***');
    for (let i = 0; i < filesData.length; i += 1) {
      log.yellowBright(`${filesData[i].name}`)
    }
  }
}

async function delProject() {
  const filesData = getProjectData();
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
      log.green(`${filesData[i].name}删除成功`);
      filesData.splice(i, 1);
      writeDataToHomeDir(projectFileName, filesData);
      return;
    }
  }
}

module.exports = {
  showProject,
  delProject,
};
