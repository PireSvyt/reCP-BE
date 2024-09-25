const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const balanceruleSchema = mongoose.Schema(
	{
		schema: { type: String },
		//balanceruleid: { type: String, required: true, unique: true },
		startdate: { type: Date, required: true },
		enddate: { type: Date },
		categories: { type: [ 
			{ 
				categoryid:  String
			}
		] },
		ratios:{ type: [ 
			{ 
				userid:  String,
				ratio:  Number
			}
		] },
	},
	{ strict: true },
	{ discriminatorKey: "balanceruleid" }
);

balanceruleSchema.plugin(uniqueValidator);

module.exports = mongoose.model("BalanceRule", balanceruleSchema);
