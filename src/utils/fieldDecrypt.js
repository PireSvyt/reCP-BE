const CryptoJS = require("crypto-js");
//const crypto = require('crypto');

module.exports = function fieldDecrypt(encryptedField) {
	let decryptedField = CryptoJS.AES.decrypt(
		encryptedField,
		process.env.ENCRYPTION_KEY
	).toString(CryptoJS.enc.Utf8)

	/*let mykey = crypto.createDecipher('aes-128-cbc', process.env.ENCRYPTION_KEY);
	let decryptedField = mykey.update(encryptedField, 'hex', 'utf8')
	decryptedField += mykey.final('utf8');*/

	return decryptedField
};