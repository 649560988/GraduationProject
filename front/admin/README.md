# SaaS版

## 开发资源

* swagger [http://hs.console.retailsolution.cn/swagger-ui.html](http://hs.console.retailsolution.cn/swagger-ui.html)

## 开发注意事项

### 1. 关于文件结构

```
| src 源码
-- assets 图片
-- commmon 菜单和路由
-- components 公用组件
-- layouts 布局组件（默认不修改）
-- models redux数据模型（由于我们的业务逻辑主要在routes里，models只放公用数据模型即可）
-- routes 路由组件 （主要在这里面编写业务代码）
-- services API服务 （可以把公用接口定义在这里面，一般业务接口可以直接定义在routes里）
-- utils 辅助工具
-- index.js 入口文件
-- index.less 用于修改全局样式
-- 其他 略
```

### 2. 关于开发服务器（webpack develop server）

这个项目使用`roadhog`作为开发服务器，可以编辑`.webpackrc.js`扩展配置。默认不修改。
启动命令是`npm start`, 端口是`9090`

### 3. 关于代码风格

代码风格使用`standardjs`风格，使用`babel-eslint`作为`parser`，目前配置的全局对象有`fetch`和`localStorage`，可以增加。

代码提交(`git commit`)的时候会执行lint检查（脚本是./tools/lint.sh，只会检查`src`目录），如果未通过会阻止提交。注意查看错误信息。

如果开发工具是`vscode`，可以安装`standardjs`插件，可以实时看到错误信息并辅助自动修复。

### 4. 关于全局配置

仓库根目录有`config.js`用于配置一些发布时候会作修改的参数，比如接口调用地址。在代码里使用的时候用
`${process.env.参数名}`即可。

其实`process.env.server`已经配置在axios和request的默认配置里了，调用接口的时候不需要带上这个参数。
