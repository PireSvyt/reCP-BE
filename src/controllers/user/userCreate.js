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

const userToSave = {}
if (eq.body.userid === undefined) {
    userToSave.userid = random_string(24)
} else {
    userToSave.userid = req.body.userid
}
if (req.body.encryption === false) {
    userToSave.name = CryptoJS.AES.decrypt(
        req.body.name,
        process.env.ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
    userToSave.login = CryptoJS.AES.decrypt(
        req.body.login,
        process.env.ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
}
if (req.body.type === undefined) {
    userToSave.type = "user"
} else {
    userToSave.type = req.body.type
}
if (req.body.state === undefined) {
    userToSave.state = "inactive"
} else {
    userToSave.state = req.body.state
}
if (req.body.password === undefined) {
    userToSave.password = "TO RESET"
} else {
    userToSave.password = req.body.password
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