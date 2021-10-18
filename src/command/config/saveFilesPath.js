const {
  isFileExist,
  red,
  green,
  gray,
  yellowBright,
  writeTempData,
  readTempData,
  tempFileName,
} = require('../../utils/utils');

const filePathRegx = /^[A-Z]:(\\{1,2}[\d\w-]+)+$/
const filePathRegx2 = /^(\/[\d\w-]+)+$/;

function saveFile(filePath) {
  const fileList = filePath.split(',').filter((file) => {
    if (!filePathRegx.test(file) && !filePathRegx2.test(file)) {
      red(`${file}路径有误，需为项目根目录的绝对路径，请重新输入!`);
      return false;
    }
    return true;
  }).map((file) => ({
    name: file.split('\\')[file.split('\\').length - 1],
    path: file,
  }));
  let fileData = JSON.parse(readTempData(tempFileName));
  if (!fileData) {
    fileData = [];
  }
  let isNew = false;
  for (let i = 0; i < fileList.length; i += 1) {
    if (fileData.length === 0) {
      if (isFileExist(fileList[i].path)) {
        fileData.push(fileList[i]);
        isNew = true;
      } else {
        red(`${fileList[i].name}目录不存在!`);
      }
    } else {
      for (let j = 0; j < fileData.length; j += 1) {
        if (fileList[i].path === fileData[j].path) {
          gray(`${fileList[i].path}项目已存在，跳过！`);
          break;
        } else if (j === fileData.length - 1) {
          if (isFileExist(fileList[i].path)) {
            fileData.push(fileList[i]);
            isNew = true;
          } else {
            red(`${fileList[i].name}目录不存在!`);
          }
        }
      }
    }
  }
  if (fileData.length > 0) {
    writeTempData(tempFileName, fileData);
    isNew && green('***保存成功***');
    isNew && green('***配置完成***');
    green('--已有项目--');
    for (let i = 0; i < fileData.length; i += 1) {
      yellowBright(`${fileData[i].name}`);
    }
  }
}

module.exports = saveFile;
