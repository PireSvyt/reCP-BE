const mongoose = require("mongoose");
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

const encryptionSchema = mongoose.Schema(
	{
		field: { type: String },
	}
);

encryptionSchema.plugin(mongooseFieldEncryption, {
	fields: ["field"],
	secret: process.env.ENCRYPTION_KEY,
  });

module.exports = mongoose.model("Encryption", encryptionSchema);