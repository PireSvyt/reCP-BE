const crypto = require('crypto');

module.exports = function decryptUser(user) {

    let fieldsToDecrypt = ["name", "login", "loginchange"]
    let decryptedUser = {...user}

    fieldsToDecrypt.forEach(field => {
        if (decryptedUser[field + "_enc"] !== undefined) {
            if (decryptedUser[field + "_enc"]) {
                if (decryptedUser[field] !== undefined) {
                    decryptedUser[field] = decryptUserField(decryptedUser[field])
                }
            }
            delete decryptedUser[field + "_enc"]     
        }
    })
  
};

function decryptUserField (encryptedField) {

    const algorithm = 'aes-256-cbc';
    const key = crypto.createHash("sha256").update(String(process.env.ENCRYPTION_KEY)).digest("hex").substring(0, 32);
    const inputIV = crypto.randomBytes(12).toString('hex');

    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(inputIV, 'hex'));
    let decryptedField = decipher.update(encryptedField, 'hex', 'utf-8');
    decryptedField += decipher.final('utf-8');

    return decryptedField
}