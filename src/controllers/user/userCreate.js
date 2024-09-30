require("dotenv").config();
const CryptoJS = require("crypto-js");
const User = require("../../models/User.js");
const random_string = require("../../utils/random_string.js");

module.exports = userCreate = (req, res, next) => {
/*

create a user

possible response types
- user.create.success
- user.create.error

*/

if (process.env.DEBUG) {
console.log("user.create");
}

let userToSave = {
    userid: req.body.userid === undefined ? random_string(24) : req.body.userid,
    communityid: req.body.communityid,
    name: req.body.encryption === false ? CryptoJS.AES.decrypt(
        req.body.name,
        process.env.ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8) : req.body.name,
    login: req.body.encryption === false ? CryptoJS.AES.decrypt(
        req.body.login,
        process.env.ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8) : req.body.login,
    type: req.body.type === undefined ? "user" : req.body.type,
    state: req.body.state === undefined ? "inactive" : req.body.state,
    password: req.body.password === undefined ? "TO RESET" : req.body.password,
}
console.log("userToSave", userToSave)
userToSave = new User(userToSave)

// Save
userToSave
    .save()
    .then(() => {
        console.log("user.create.success");
        return res.status(201).json({
            type: "user.create.success",
            data: {
                user: userToSave,
            },
        });
    })
    .catch((error) => {
        console.log("user.create.error");
        console.error(error);
        return res.status(400).json({
            type: "user.create.error",
            error: error,
            data: {
                user: undefined,
            },
        });
    });
};