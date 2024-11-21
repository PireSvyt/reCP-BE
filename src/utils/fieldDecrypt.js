const CryptoJS = require("crypto-js");
const crypto = require('crypto');
const fieldEncryption = require('mongoose-field-encryption');

module.exports = function fieldDecrypt(encryptedField) {
	let decryptedField
	
	switch (source) {
	  case "FE": 
		decryptedField = CryptoJS.AES.decrypt(
			encryptedField,
			process.env.ENCRYPTION_KEY
		).toString(CryptoJS.enc.Utf8)
		break
	  case "BE":
		const _hash = (secret) => crypto.createHash("sha256").update(secret).digest("hex").substring(0, 32);
		decryptedField = fieldEncryption.decrypt(encryptedField, _hash(process.env.ENCRYPTION_KEY))
		break
	}

	/*let mykey = crypto.createDecipher('aes-128-cbc', process.env.ENCRYPTION_KEY);
	let decryptedField = mykey.update(encryptedField, 'hex', 'utf8')
	decryptedField += mykey.final('utf8');*/

	return decryptedField
};