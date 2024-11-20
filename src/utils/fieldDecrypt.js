const CryptoJS = require("crypto-js");

module.exports = function fieldDecrypt(encryptedField) {
  return CryptoJS.AES.decrypt(
		encryptedField,
		process.env.ENCRYPTION_KEY
	).toString(CryptoJS.enc.Utf8)
};