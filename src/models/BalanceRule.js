const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const ratioSchema = mongoose.Schema(
	{
		userid:  { type: String },
		ratio:  { type: Number }
	},
);

const balanceruleSchema = mongoose.Schema(
	{
		schema: { type: String },
		balanceruleid: { type: String, required: true, unique: true },
		startdate: { type: Date, required: true },
		enddate: { type: Date },
		categoryids:  [{ type: String }],
		ratios:[ratioSchema],
	},
	{ strict: true }
);

balanceruleSchema.plugin(uniqueValidator);

module.exports = mongoose.model("BalanceRule", balanceruleSchema);