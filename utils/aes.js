'use strict';
const crypto = require('crypto');
const { logger } = require('../log.config')
var AES_conf = {
    key: getSecretKey(), //密钥
    iv: '1012132405963708', //偏移向量
    padding: 'PKCS7Padding' //补全值
}

function getSecretKey () {
    return "anheng-ksdjfba23";
}

// 加密
function encryption (data) {
    let key = AES_conf.key;
    let iv = AES_conf.iv;
    // let padding = AES_conf.padding;

    var cipherChunks = [];
    var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update(data, 'utf8', 'base64'));
    cipherChunks.push(cipher.final('base64'));
    return cipherChunks.join('');
}


// 解密
function decryption (data) {
    // eslint-disable-next-line no-useless-catch
    try {
        let key = AES_conf.key;
        let iv = AES_conf.iv;
        // let padding = AES_conf.padding;

        var cipherChunks = [];
        var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        decipher.setAutoPadding(true);
        cipherChunks.push(decipher.update(data, 'base64', 'utf8'));
        cipherChunks.push(decipher.final('utf8'));
        return cipherChunks.join('');
    } catch (err) {
        logger.error(err)
    }
}

module.exports = {
    encryption,
    decryption
}

