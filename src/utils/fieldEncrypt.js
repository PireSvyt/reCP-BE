const CryptoJS = require("crypto-js");
const crypto = require('crypto');
const fieldEncryption = require('mongoose-field-encryption');

module.exports = function fieldEncrypt(decryptedField, source) {
  let encryptedField
  
  switch (source) {
    case "FE": 
      encryptedField = CryptoJS.AES.encrypt(
        decryptedField,
        process.env.ENCRYPTION_KEY
      ).toString();
      break
    case "BE":
      const _hash = (secret) => crypto.createHash("sha256").update(secret).digest("hex").substring(0, 32);
      encryptedField = fieldEncryption.encrypt(decryptedField, _hash(process.env.ENCRYPTION_KEY))
      break
  }

  /*let mykey = crypto.createCipher('aes-128-cbc', process.env.ENCRYPTION_KEY);
  let encryptedField = mykey.update(decryptedField, 'utf8', 'hex')
  encryptedField += mykey.final('hex');*/

  return encryptedField
};