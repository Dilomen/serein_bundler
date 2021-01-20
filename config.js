const path = require('path')
const os = require('os')
// module.exports = {
//     cwd: path.resolve(process.cwd(), './build'),
//     maxBuffer: 1024*1024*1024,
//     targeDir: 'D:\\code\\targe',
//     env:{
//         BASE_URL:'/',
//         NODE_ENV: 'production'
//     },
//     processSize: os.cpus().length - 6 > 0 ? os.cpus().length - 6 : 1,
//     remoteRepoName: 'remote_repo',
//     remoteRepoUrl: path.resolve(process.cwd(), 'remote_repo'),
//     remoteGitUrl: 'http://用户名:密码@192.168.34.2/yu.liu/remote_repo.git',// gitlab
//     remoteGitRepository: 'http://用户名:密码@192.168.34.2/yu.liu/remote_repo/tree/master', // gitlab仓库地址
//     gitUserAndPass: '用户名:密码@',// gogs
//     mysql:{
//         host: "172.17.0.2",
//         post: "33060",
//         user: 'root',
//         password: '123456',
//         database: 'db_bundler',
//         timezone: "08:00"
//     },
//     redis:{
//         host: "172.17.0.3",
//         port: "6379",
//         db:2
//     },
//     rabbitmq:{
//         URL: 'amqp://guest:guest@172.17.0.4:5672',
//         PORT: 8081
//     }
// }

// 本地开发时的配置
module.exports = {
    cwd: path.resolve(process.cwd(), './build'),
    maxBuffer: 1024*1024*1024,
    targeDir: 'D:\\code\\targe',
    cacheQuantity: 100, // 缓存的文件数量
    env:{
        BASE_URL:'/',
        NODE_ENV: 'production'
    },
    processSize: os.cpus().length - 6 > 0 ? os.cpus().length - 6 : 1,
    // processSize: 1,
    remoteRepoName: 'remote_repo',
    remoteRepoUrl: path.resolve(process.cwd(), 'remote_repo'),
    remoteGitUrl: 'http://192.168.34.2/yu.liu/remote_repo.git',// gitlab
    remoteGitRepository: 'http://gitlab.info.dbappsecurity.com.cn/yu.liu/remote_repo/tree/master', // gitlab仓库地址
    gitUserAndPass: '',// gogs  .replace(/(http:\/\/)/,'$1'+gitUserAndPass)
    mysql:{
        host: "localhost",
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'db_bundler',
        timezone: "08:00"
    },
    redis:{
        host: "localhost",
        port: "6379",
        db:2
    },
    rabbitmq:{
        URL: 'amqp://guest:guest@localhost:5672',
        PORT: 8082
    }
}
