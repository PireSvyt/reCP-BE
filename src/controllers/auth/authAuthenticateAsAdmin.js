require("dotenv").config();

module.exports = authAuthenticateAsAdmin = (req, res, next) => {
/*

authenticate the user is admin

possible response types
- auth.authenticateasadmin.notadmin

*/

if (process.env.DEBUG) {
console.log("auth.authenticateasadmin");
}

if (req.augmented.user.type !== "admin" ) {
console.log("auth.authenticateasadmin.error.notadmin");
return res.status(403).json({
type: "auth.authenticateasadmin.error.notadmin",
});

} else {
next();
}
};