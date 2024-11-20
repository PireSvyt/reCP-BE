const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema(
	{
		schema: { type: String },
		userid: { type: String, required: true, unique: true },
		type: { type: String, required: true, enum: ["admin", "user"] },
		state: { type: String, required: true, enum: ["inactive", "active", "anonymous"] },
		name: { type: String, required: true },
		name_enc: { type: Boolean },
		login: { type: String, required: true, unique: true },
		login_enc: { type: Boolean },
		loginchange: { type: String },
		loginchange_enc: { type: Boolean },
		password: { type: String, required: true },
		communityid: { type: String, required: true },
		passwordtoken: { type: String },
		lastconnection: { type: Date },
		anonymisationnotice: { type: Date },
		failedconnections:[{ type: Date }],
	}
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);