const CryptoJS = require("crypto-js");

module.exports = function fieldEncrypt(decryptedField) {
  return CryptoJS.AES.encrypt(
    decryptedField,
    process.env.ENCRYPTION_KEY
  ).toString(CryptoJS.enc.Utf8);
};