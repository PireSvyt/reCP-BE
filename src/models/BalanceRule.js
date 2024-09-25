const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const balanceruleSchema = mongoose.Schema(
	{
		schema: { type: String },
		balanceruleid: { type: String, required: true, unique: true },
		startdate: { type: Date, required: true },
		enddate: { type: Date },
		//categoryids:  [ String ],
		//userratios: {type: Map, of : Number},
	},
	{ strict: true }
);

balanceruleSchema.plugin(uniqueValidator);

module.exports = mongoose.model("BalanceRule", balanceruleSchema);
