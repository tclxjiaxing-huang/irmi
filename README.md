## irmi
#### 一个简易的git项目管理库

### 安装
```shell script
npm install irmi -g
```

### 使用
#### 步骤一：配置项目目录绝对路径
````shell script
irmi config <projectPath>
````
#### 步骤二：执行对应的指令
````shell script
irmi [push|show|del|step|git(v1.3.0)]
````

## config
配置项目，配置完成后可以在任意路径下操作项目
````
irmi config /Users/huangjiaxing/works/projects/irmi
````

## push
执行指令步骤，通过`step`可自定义配置执行步骤。
默认内置步骤为  
```
切换到dev->提交代码->推送->合并到test->合并dev->推送->切换到dev()
checkout<dev>-add-commit-push-checkout<test>-merge<dev>-push-checkout<dev>
```

## step
新增或删除自定义步骤。

## show
查看已经配置的项目

## del
删除已经配置的项目

## git(v1.3.0)
内置常用git操作 
````
irmi git -d
````
`-b`: 创建分支  
`-bt`: 从指定tag创建分支  
`-t`: 打标签  
`-d`: 删除本地分支  
`-do`: 删除远程分支  
`-dt`: 打标签  
`-dto`: 打标签  
`-c`: 切换分支  
`-m`: 合并分支  

