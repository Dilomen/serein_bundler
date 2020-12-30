// // 引入email 模块
// var nodemailer = require('nodemailer');
// var smtpTransport = require('nodemailer-smtp-transport');

// // 开启一个 SMTP 连接池
// var transport = nodemailer.createTransport(smtpTransport({
//   host: "smtp.qq.com", // qq邮箱主机
//   secure: true, // 使用 SSL
//   secureConnection: true, // 使用 SSL
//   port: 465, // SMTP 端口
//   auth: {
//     user: "noreply@binlive.cn", // 账号   你自定义的域名邮箱账号
//     pass: "olncjtfcim1232312ahj"    // 密码   你自己开启SMPT获取的密码
//   }
// }));

// var mailOptions = {
//   from: "noreply@binlive.cn", // 发件地址
//   to: req.body.email, // 收件列表
//   subject: "BinLive账号注册", // 标题
//   text: "",
//   html: htmlcon // html 内容
// }
// // 发送邮件
// var userobj = {
//   email: req.body.email,
//   passworld: req.body.passworld,
//   hash: hash,
//   isregister: false
// }
// transport.sendMail(mailOptions, function (error, response) {
//   if (error) {
//     console.log("fail: " + error);
//     console.log("发送失败");
//   } else {
//     console.log("发送成功");
//   }
//   transport.close(); // 如果没用，关闭连接池
// });