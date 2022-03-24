const User = require("../models/User");
const bcrypt = require("bcrypt");
const config = require("../config/config");

const tempLogin = "ABC";
const tempPassword = "0704";

console.log("*** SCRIPT ***");
console.log("Adding user : " + tempLogin);

bcrypt
  .hash(tempPassword, config.pass)
  .then((hash) => {
    console.log("hash : " + hash);
    const newUser = new User({
      login: tempLogin,
      password: hash
    });
    newUser
      .save()
      .then(() => {
        console.log("ustilisateur créé");
      })
      .catch((error) => {
        console.log("erreur /save");
        console.log(error);
      });
  })
  .catch((error) => {
    console.log("erreur /hash");
    console.log(error);
  });

// cd in dir
// $ node userAdd
