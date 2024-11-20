const fieldDecrypt = require('./fieldDecrypt.js');

module.exports = function userDecrypt(user) {

    let fieldsToDecrypt = ["name", "login", "loginchange"]
    let decryptedUser = {...user}

    fieldsToDecrypt.forEach(field => {
        if (decryptedUser[field + "_enc"] !== undefined) {
            if (decryptedUser[field + "_enc"]) {
                if (decryptedUser[field] !== undefined) {
                    decryptedUser[field] = fieldDecrypt(decryptedUser[field])
                }
            }
            delete decryptedUser[field + "_enc"]     
        }
    })

    return decryptedUser
  
};