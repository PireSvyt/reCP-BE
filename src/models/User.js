const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
mongoose.set("debug", true);
}

const userSchema = mongoose.Schema(
{
schema: { type: String },
userid: { type: String, required: true, unique: true },
type: { type: String, required: true, enum: ["admin", "user"] },
name: { type: String, required: true },
login: { type: String, required: true, unique: true },
password: { type: String, required: true },
passwordtoken: { type: String },
communityid: { type: String, required: true },
},
{ strict: true }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);