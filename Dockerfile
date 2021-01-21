FROM node:12.20

#工作目录
WORKDIR /usr/src/app

#切换registry源为内网
RUN npm config set registry http://192.168.34.140:7000
# RUN yarn config set registry https://registry.npm.taobao.org

#安装依赖
COPY package.json ./
RUN yarn install
#复制代码
COPY . /usr/src/app/
VOLUME [ "/usr/local/var/app" ]
# 暴露端口
EXPOSE 8081

#运行服务
CMD ["node", "build_serve/index.js"]