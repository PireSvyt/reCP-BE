const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.createHash('sha256').update(String(process.env.ENCRYPTION_KEY)).digest('base64').substr(0, 32);;
const iv = crypto.randomBytes(16);

module.exports = function fieldEncrypt(field) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(field, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  console.log("field", field)
  console.log("iv.toString('hex')", iv.toString('hex'))
  console.log("encrypted", encrypted)
  return encrypted
};