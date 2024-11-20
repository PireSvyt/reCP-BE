const Encryption = require("../models/Encryption.js");

module.exports = function fieldEncrypt(field) {
  try {
    const encryptionObject = new Encryption({ name: field });
    console.error("encryptionObject.name", encryptionObject.name)
    return encryptionObject.name
  } catch (err) {
    console.error("fieldEncrypt", err)
    return "oopsy"
  }  
};