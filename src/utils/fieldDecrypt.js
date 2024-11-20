const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.createHash("sha256").update(String(process.env.ENCRYPTION_KEY)).digest("hex").substring(0, 32);
const inputIV = crypto.randomBytes(12).toString('base64');

module.exports = function fieldDecrypt(encryptedData) {
  try {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(inputIV, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    //console.log("encryptedData", encryptedData)
    //console.log("decrypted", decrypted)
    return decrypted;
  } catch (err) {
    console.error("fieldDecrypt", err)
    return "oopsy"
  }
};