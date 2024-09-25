const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const balanceruleSchema = mongoose.Schema(
	{
		schema: { type: String },
		balanceruleid: { type: String, required: true, unique: true },
		startdate: { type: Date, required: true },
		enddate: { type: Date },
		categories: { type: [ new mongoose.Schema(
			{ 
				categoryid:  { type: String }
			}
		) ] },
		ratios:{ type: [ new mongoose.Schema(
			{ 
				userid:  { type: String },
				ratio:  { type: Number }
			}
		) ] },
	},
	{ strict: true }
);

balanceruleSchema.plugin(uniqueValidator);

module.exports = mongoose.model("BalanceRule", balanceruleSchema);
