const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.createHash("sha256").update(String(process.env.ENCRYPTION_KEY)).digest("hex").substring(0, 32);
const inputIV = crypto.randomBytes(12).toString('hex');

module.exports = function fieldEncrypt(field) {
  try {
    const cipher = crypto.createCipheriv(algorithm, key, inputIV);
    let encrypted = cipher.update(field, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    console.log("field", field)
    console.log("encrypted", encrypted)
    return encrypted
  } catch (err) {
    console.error("fieldEncrypt", err)
    return "oopsy"
  }  
};