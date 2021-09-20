const path = require('path');
const fs = require('fs');
const os = require('os');
const {
  red,
  yellow,
} = require('./log');

const tempDirName = 'gat';
const tempFileName = 'projectsPath.txt';

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

// 向暂存目录中保存数据
const writeTempData = (fileName, data) => {
  const tempDir = resolve(os.tmpdir(), tempDirName);
  // 判断暂存目录中是否有缓存目录
  const isExistTempDir = isFileExist(tempDir);
  if (!isExistTempDir) {
    // 创建缓存目录
    createFile(tempDir);
  }
  const tempFile = resolve(os.tmpdir(), tempDirName, fileName);
  writeFile(tempFile, JSON.stringify(data));
};
// 读取暂存目录中的文件数据
const readTempData = (fileName) => {
  const tempDir = resolve(os.tmpdir(), tempDirName);
  const tempFile = resolve(tempDir, fileName);
  if (isFileExist(tempFile)) {
    return readFile(tempFile);
  } else {
    return null;
  }
};

const resolve = (...args) => {
  return path.resolve(...args);
}

// 读取项目
const readFilesPath = () => {
  const tempFile = resolve(os.tmpdir(), tempDirName, tempFileName);
  if (isFileExist(tempFile)) {
    const fileData = JSON.parse(readFile(tempFile));
    if (fileData.length === 0) {
      yellow('暂无项目，请先添加');
      process.exit(0);
    }
    return fileData.map((file) => ({
      path: file.path,
      name: file.name.split('\\')[file.name.split('\\').length - 1],
    }));
  } else {
    red('暂无配置项目，请先执行config添加项目');
    process.exit(0);
  }
}

module.exports = {
  tempDirName,
  isFileExist,
  createFile,
  writeFile,
  readFile,
  resolve,
  readFilesPath,
  tempFileName,
  writeTempData,
  readTempData,
}
