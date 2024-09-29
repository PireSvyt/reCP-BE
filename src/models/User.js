const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema(
	{
		schema: { type: String },
		userid: { type: String, required: true, unique: true },
		type: { type: String, required: true, enum: ["admin", "user"] },
		state: { type: String, required: true, enum: ["inactive", "active", "anonymous"] },
		login: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		passwordtoken: { type: String },
		communityid: { type: String, required: true },
		lastconnexion: { type: Date },
	},
	{ strict: true }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);