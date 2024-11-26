require("dotenv").config();
const User = require("../../models/User.js");
const random_string = require("../../utils/random_string.js");
//const fieldEncrypt = require("../../utils/fieldEncrypt.js");

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

userToSave = new User({
    userid: req.body.userid === undefined ? random_string(24) : req.body.userid,
    type: req.body.type === undefined ? "user" : req.body.type,
    state: req.body.state === undefined ? "inactive" : req.body.state,
    name: req.body.name,
    login: req.body.login,
    password: req.body.password === undefined ? "TO RESET" : req.body.password,
    communityid: req.body.communityid,
    lastconnection: Date.now()
})
console.log("userToSave", userToSave)

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