const path = require('path');
const fs = require('fs');
const os = require('os');
const { yellow } = require('./log');

const irmiDirName = 'irmi';
const projectFileName = 'projectsPath.txt';
const stepFileName = 'customStep.txt';

// 查询文件是否存在
const isFileExist = (file) => {
  return fs.existsSync(file);
}

// 创建文件夹
const createFile = (path) => {
  return fs.mkdirSync(path);
}

// 写入文件
const writeFile = (path, data) => {
  return fs.writeFileSync(path, data);
}

// 读取文件
const readFile = (path) => {
  return fs.readFileSync(path, {
    encoding: 'utf8',
  });
}

// 向用户目录中保存数据
const writeDataToHomeDir = (fileName, data) => {
  const tempDir = resolve(os.homedir(), irmiDirName);
  // 判断暂存目录中是否有缓存目录
  const isExistTempDir = isFileExist(tempDir);
  if (!isExistTempDir) {
    // 创建缓存目录
    createFile(tempDir);
  }
  const tempFile = resolve(os.homedir(), irmiDirName, fileName);
  writeFile(tempFile, JSON.stringify(data));
};

// 读取保存的项目文件数据
const getProjectData = () => {
  const projectDirPath = resolve(os.homedir(), irmiDirName);
  const projectFile = resolve(projectDirPath, projectFileName);
  if (isFileExist(projectFile)) {
    const fileData = JSON.parse(readFile(projectFile)) || [];
    return fileData.map((file) => {
      let name = file.name;
      if (name.indexOf(':') !== -1) {
        name = name.split('\\')[name.split('\\').length - 1];
      }
      name = name.split('\/')[name.split('\/').length - 1];
      return {
        path: file.path,
        name: name,
      };
    });
  }
  return [];
};

// 读取保存的步骤数据
const getStepData = (type) => {
  const stepDirPath = resolve(os.homedir(), irmiDirName);
  const stepFile = resolve(stepDirPath, stepFileName);
  if (isFileExist(stepFile)) {
    const stepData = JSON.parse(readFile(stepFile)) || [];
    if (type && stepData[type]) {
      return stepData[type];
    }
    return stepData;
  }
  return [];
}

const resolve = (...args) => {
  return path.resolve(...args);
}

module.exports = {
  irmiDirName,
  stepFileName,
  projectFileName,
  resolve,
  readFile,
  writeFile,
  createFile,
  isFileExist,
  getStepData,
  getProjectData,
  writeDataToHomeDir,
}
