const redis = require('redis')
const redisConfig = require('../config').redis

module.exports = () => new Promise((resolve, reject) => {
  const redisClient = redis.createClient(redisConfig)
  redisClient.on('connect', function () {
    console.log('redis connect success!');
  });

  redisClient.on('end', function () {
    console.log('end');
  });
  
  redisClient.on('error', function (err) {
    console.log(err);
    reject(err)
  });

  redisClient.on('ready', function () {
    resolve(redisClient)
  });
})