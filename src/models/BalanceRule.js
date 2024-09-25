const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const ratioSchema = mongoose.Schema(
	{
		userid:  { type: String },
		ratio:  { type: Number },
	},
	{ strict: true }
);

const balanceruleSchema = mongoose.Schema(
	{
		schema: { type: String },
		balanceruleid: { type: String, required: true, unique: true },
		startdate: { type: Date, required: true },
		enddate: { type: Date },
		categories: { type: [{ categoryid: String }] },
		ratios: { type: [ratioSchema] },
	},
	{ strict: true }
);

balanceruleSchema.plugin(uniqueValidator);

module.exports = mongoose.model("BalanceRule", balanceruleSchema);
