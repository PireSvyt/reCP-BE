const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = process.env.ENCRYPTION_KEY;
const iv = crypto.randomBytes(16);

module.exports = function fieldEncrypt(field) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  console.log("field", field)
  console.log("iv.toString('hex')", iv.toString('hex'))
  console.log("encryptedData", encryptedData)
  return encrypted
};