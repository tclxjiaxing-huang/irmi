#!/usr/bin/env node

const { Command } = require('commander');
const push = require('../src/command/push/push.js');
const config = require('../src/command/config/config');
const {
  showProject,
  delProject,
} = require('../src/command/projects/project');
const customStep = require('../src/command/customStep/customStep');
const git = require('../src/command/git');

const logo = `
*****************************
 ____  ____  __  __  ____ 
(_  _)(  _ \\(  \\/  )(_  _)
 _)(_  )   / )    (  _)(_ 
(____)(_)\\_)(_/\\/\\_)(____)   
 
*****************************
`;
const program = new Command();
program.version('1.3.0');

program
  .command('config <filePath>')
  .option('-d, --del', '删除项目')
  .description('配置项目文件路径(多个项目逗号隔开)')
  .action((filePath, options) => {
    config(filePath, options);
  })

program
  .command('push')
  .option('-c, --choose [projectName]', 'choose project by yourself')
  .description('代码提交相关')
  .action((options) => {
    push(options);
  });

program
  .command('show')
  .description('展示已有项目')
  .action(() => {
    showProject();
  });

program
  .command('git')
  .description('内置常用git操作')
  .option('-a --add','添加到暂存区')
  .option('-c --commit','提交代码')
  .option('-p --push','推送到远程仓库')
  .option('-b --branch','创建分支')
  .option('-bt --branchTag','从指定tag创建分支')
  .option('-t --tag','打标签')
  .option('-d --delBranch','删除本地分支')
  .option('-do --delOriginBranch','删除远程分支')
  .option('-dt --delTag','打标签')
  .option('-dto --delOriginTag','打标签')
  .option('-pl --pull','拉取')
  .option('-ck --checkout','切换分支')
  .option('-m --merge','合并分支')
  .action(async (options) => {
    await git(options);
  });

program
  .command('del')
  .description('删除已有项目')
  .action(async () => {
    await delProject();
  });

program
  .command('step')
  .description('自定义步骤')
  .action(async () => {
    await customStep();
  });

program.parse();
