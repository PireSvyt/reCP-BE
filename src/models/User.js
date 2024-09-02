const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const userSchema = mongoose.Schema(
  {
    schema: { type: String },
    userid: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ["admin", "user"]},
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    history:  { type: Object },
    passwordtoken: { type: String },
  },
  { strict: true },
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);