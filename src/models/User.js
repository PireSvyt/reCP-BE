const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;
//https://www.npmjs.com/package/mongoose-field-encryption

const userSchema = mongoose.Schema(
	{
		schema: { type: String },
		userid: { type: String, required: true, unique: true },
		type: { type: String, required: true, enum: ["admin", "user"] },
		state: { type: String, required: true, enum: ["inactive", "active", "anonymous"] },
		name: { type: String, required: true },
		login: { type: String, required: true, unique: true },
		loginchange: { type: String },
		password: { type: String, required: true },
		communityid: { type: String, required: true },
		passwordtoken: { type: String },
		lastconnection: { type: Date },
		anonymisationnotice: { type: Date },
		failedconnections:[{ type: Date }],
	}
);

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongooseFieldEncryption, { 
	fields: ['name'],//, 'login', 'loginchange'], 
	secret: process.env.ENCRYPTION_KEY,
});

module.exports = mongoose.model("User", userSchema);