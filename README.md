# ci 打包

## 流程图

!['流程图'](./bundler/public/static/project_flow.png '流程图')

## 架构图

!['架构图'](./bundler/public/static/project_struct.png '架构图')

## 打包任务分配流程图

!['打包任务分配流程'](./bundler/public/static/project_distribute.png '打包任务分配流程')

## 进程【8082 端口】：处理对应的业务

## 开发

### 1、拉取项目代码

### 2、根据 model 下的 sql 文件，创建对应的数据库和表

### 3、yarn install 安装依赖

### 4、yarn start 启动项目

### 5、用户验证：前后端分离开发注意点：由于前后端不同源，所以 cookie 不会存在，即必须先登录，之后打包成静态不会出现该问题

### 6、使用 postman 等工具，由于添加了用户权限，所以在使用工具时需要添加 Authorization 表头，需要值，在请求页面的接口详情中父子粘贴，再编写 post 请求模拟 webhook 请求

- github 添加 X-Hub-Signature header
- gitlab 添加 x-gitlab-token header
- gogs 添加 x-gogs-signature header

```json
{
  "ref": "refs/heads/master"
  // ...
}
```

### 7、请求之后程序就会根据该信息，进行打包处理，放到 build 文件夹
