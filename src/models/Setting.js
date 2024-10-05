const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const settingSchema = mongoose.Schema(
	{
		schema: { type: String },
		settingid: { type: String, required: true, unique: true },
		name: { type: String, required: true, unique: true },
		type: { type: mongoose.Mixed, required: true },
		value: { type: mongoose.Mixed, required: true },
	},
	{ strict: true }
);

settingSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Setting", settingSchema);