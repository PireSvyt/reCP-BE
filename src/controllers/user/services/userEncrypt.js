const fieldEncrypt = require('../../../utils/fieldEncrypt.js');

module.exports = function userEncrypt(user) {

    let fieldsToDecrypt = ["name", "login", "loginchange"]
    let encryptedUser = {...user}

    fieldsToDecrypt.forEach(field => {
        if (encryptedUser[field] !== undefined) {
            encryptedUser[field] = fieldEncrypt(encryptedUser[field])
            encryptedUser[field + "_enc"] = true
        }
    })

    return encryptedUser
  
};