# angularjs2编译环境
> 本编译环境可以将TypeScript格式的代码编译成ES5格式的代码，以便整合到php、java等非nodejs环境下运行

使用方法(请先安装nodejs并安装gulp命令)：

1、克隆代码：`git clone https://github.com/ronghuaxueleng/angularjs2-build-env.git`

2、安装依赖：`npm install`

3、执行编译命令：`npm build`
也可以执行编译及预览命令 `npm start`

执行完上述命令之后，会在根目录生成一个dist目录，用浏览器打开里面的index.html文件就可以看到执行效果了，将dist目录中的文件拷贝到php、java等web目录下即可与之集成
