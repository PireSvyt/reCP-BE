const Encryption = require("../models/Encryption.js");

module.exports = function fieldEncrypt(field) {
  try {
    const encryptionObject = new Encryption({ name: field });
    encryptionObject.encryptFieldsSync();
    return encryptionObject.name
  } catch (err) {
    console.error("fieldEncrypt", err)
    return "oopsy"
  }  
};