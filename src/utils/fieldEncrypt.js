const CryptoJS = require("crypto-js");
//const crypto = require('crypto');

module.exports = function fieldEncrypt(decryptedField) {
  let encryptedField = CryptoJS.AES.encrypt(
    decryptedField,
    process.env.ENCRYPTION_KEY
  ).toString();

  /*let mykey = crypto.createCipher('aes-128-cbc', process.env.ENCRYPTION_KEY);
  let encryptedField = mykey.update(decryptedField, 'utf8', 'hex')
  encryptedField += mykey.final('hex');*/

  return encryptedField
};