const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//const encrypt = require('mongoose-encryption');
//https://github.com/joegoldbeck/mongoose-encryption?tab=readme-ov-file#the-secure-way

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
	},
	{ strict: true }
);

userSchema.plugin(uniqueValidator);
/*userSchema.plugin(encrypt, 
	{ 
		secret: process.env.ENCRYPTION_KEY, 
		encryptedFields: ['name', 'login', 'loginchange']
	}
);*/
userSchema.plugin(mongooseFieldEncryption, { 
	fields: ['name', 'login', 'loginchange'], 
	secret: process.env.ENCRYPTION_KEY,
});

module.exports = mongoose.model("User", userSchema);