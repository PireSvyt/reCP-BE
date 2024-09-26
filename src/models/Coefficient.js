const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const coefficientSchema = mongoose.Schema(
	{
		schema: { type: String },
		balanceruleid: { type: String, required: true, unique: true },
		startdate: { type: Date, required: true },
		enddate: { type: Date },
		categoryids:  [{ type: String }],
		userratios: {type: Map, of : Number},
	},
	{ strict: true }
);

coefficientSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Coefficient", coefficientSchema);
