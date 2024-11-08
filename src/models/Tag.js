const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const tagSchema = mongoose.Schema(
	{
		schema: { type: String },
		tagid: { type: String, required: true, unique: true },
		communityid: { type: String, required: true },
		name: { type: String, required: true },
		type: { type: String, required: true },
		color: { type: String },
	},
	{ strict: true }
);

tagSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Tag", tagSchema);