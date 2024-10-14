const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = process.env.ENCRYPTION_KEY;
const inputIV = process.env.ENCRYPTION_IV;

module.exports = function fieldDecrypt(encryptedData) {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(inputIV, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  console.log("encryptedData", encryptedData)
  console.log("decrypted", decrypted)
  return decrypted;
};