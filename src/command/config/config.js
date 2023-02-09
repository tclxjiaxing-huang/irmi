const {
  log,
  isFileExist,
  getProjectData,
  writeDataToHomeDir,
  projectFileName,
} = require('../../utils');

const filePathRegx = /^[A-Z]:(\\{1,2}[\u4e00-\u9fa5\w-]+)+$/; // window
const filePathRegx2 = /^(\/[\u4e00-\u9fa5\w-]+)+$/; // mac

function config(filePath, options) {
  if (options.del) {
    // 删除操作
    let fileData = getProjectData();
    const findIndex = fileData.find((file) => file.path === filePath);
    if (~findIndex) {
      fileData.splice(findIndex, 1);
      writeDataToHomeDir(projectFileName, fileData);
      log.green('***删除成功***');
    } else {
      log.yellow('***项目不存在***');
    }
  } else if (filePath) {
    // 新增操作
    const fileList = filePath.split(',').filter((file) => {
      if (!filePathRegx.test(file) && !filePathRegx2.test(file)) {
        log.red(`${file}路径有误，需为项目根目录的绝对路径，请重新输入!`);
        return false;
      }
      return true;
    }).map((file) => ({
      name: file.split('\\')[file.split('\\').length - 1],
      path: file,
    }));
    let fileData = getProjectData();
    let isNew = false;
    for (let i = 0; i < fileList.length; i += 1) {
      // 判断路径是否已经配置
      if (!fileData.find((file) => file.path === fileList[i].path)) {
        if (isFileExist(fileList[i].path)) {
          fileData.push(fileList[i]);
          isNew = true;
        } else {
          log.red(`${fileList[i].name}目录不存在!`);
        }
      } else {
        log.yellow(`${fileList[i].path}项目已存在，跳过！`)
      }
    }
    if (fileData.length > 0) {
      writeDataToHomeDir(projectFileName, fileData);
      isNew && log.green('***保存成功***');
      isNew && log.green('***配置完成***');
      log.green('--已有项目--');
      for (let i = 0; i < fileData.length; i += 1) {
        log.yellowBright(`${fileData[i].name}`);
      }
    }
  }
}

module.exports = config;
