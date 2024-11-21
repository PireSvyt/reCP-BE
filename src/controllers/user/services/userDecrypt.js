const fieldDecrypt = require('../../../utils/fieldDecrypt.js');

module.exports = function userDecrypt(user) {

    let fieldsToDecrypt = ["name", "login", "loginchange"]
    let decryptedUser = {...user}

    fieldsToDecrypt.forEach(field => {
        if (decryptedUser["__enc_" + field] !== undefined) {
            if (decryptedUser["__enc_" + field]) {
                if (decryptedUser[field] !== undefined) {
                    decryptedUser[field] = fieldDecrypt(decryptedUser[field], "BE")
                }
            }
            delete decryptedUser["__enc_" + field]     
        }
    })

    return decryptedUser
  
};