const mongoose = require("mongoose");

const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;
//https://www.npmjs.com/package/mongoose-field-encryption

const encryptionSchema = mongoose.Schema(
	{
		name: { type: String },
	},
);
encryptionSchema.plugin(mongooseFieldEncryption, { 
	fields: ['name'], 
	secret: process.env.ENCRYPTION_KEY,
});

module.exports = mongoose.model("Encryption", encryptionSchema);