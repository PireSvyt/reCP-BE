const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

const userSchema = mongoose.Schema(
	{
		schema: { type: String },
		userid: { type: String, required: true, unique: true },
		type: { type: String, required: true, enum: ["admin", "user"] },
		state: { type: String, required: true, enum: ["inactive", "active", "anonymous"] },
		name: { type: String, required: true },
		__enc_name: { type: Boolean },
		login: { type: String, required: true, unique: true },
		__enc_login: { type: Boolean },
		loginchange: { type: String },
		__enc_loginchange: { type: Boolean },
		password: { type: String, required: true },
		communityid: { type: String, required: true },
		passwordtoken: { type: String },
		lastconnection: { type: Date },
		anonymisationnotice: { type: Date },
		failedconnections: { type: [Date], required: false, default: [] },
	}
);

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongooseFieldEncryption, {
	fields: ["name", "login", "loginchange"],
	secret: process.env.ENCRYPTION_KEY,
  });

module.exports = mongoose.model("User", userSchema);