# 海豹js扩展模板


### 介绍

一个简单易用的项目模板。

使用esbuild编译代码，并将多个源码文件打包成一个。


### 如何使用

首先打开模板项目地址，点击 `Use this template -> Create a new Repository`

填写项目名点击确定后，你会拥有一个对应的代码仓库。

随后——

#### 1. 如果你想在你的电脑上开发

clone 或者下载项目，然后用vscode(或者你习惯的开发工具)打开项目目录。

在终端中输入:

```
npm install
npm run build
```

好的，现在你的项目被编译成功了，就在dist目录。

默认的名字是`sealdce-js-ext.js`，其逻辑写在src/index.ts


#### 2. 如果你想在浏览器上开发

点 `Code -> Create codespace on master`

稍等一会之后，你应该得到了一个在线的VSCode环境，现在跟1的步骤一样去做就行了。


### 如果你不太了解如何进行开发

看这里，这边有大量的例子，以及海豹用户写的插件：

https://github.com/sealdice/javascript

由于无法动态调试，建议将纯逻辑部分独立编写，随后你就可以在调试编译后，用nodejs去验证你的想法:

```
npm run build-dev
node ./dev/sealdice-js-ext.js
```

当然，不止是node，其他的在线js执行平台也一样。

你甚至可以复制编译后的代码到devtools里去执行。


### 填写个人信息

当插件开发完成后(或者开始开发时)，你需要修改几处地方：

* header.txt 这个文件是你插件的描述信息

* tools/build-config.js 最开头一行"var filename = 'sealdce-js-ext.js';"，改成你中意的名字，注意不要与现有的重名


### 编译和发布

```
npm run build
```

从dist目录找出你的编译结果，将其装入海豹测试并分享即可！

当然，你也可以把你的劳动成果提交到这里：

https://github.com/sealdice/javascript/tree/main/scripts

这样用户就可以直接在海豹的插件面板进行安装了。
