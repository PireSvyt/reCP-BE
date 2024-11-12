const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const budgetSchema = mongoose.Schema(
{
	schema: { type: String },
	budgetid: { type: String, required: true, unique: true },
	communityid: { type: String, required: true },
	name: { type: String, required: true },
	type: { type: String, required: true },
	slidingDuraiton: { type: Number },
	categoryids: [{ type: String }],
	targets: {
		type: [{ 
			slots: [{ type: Number }],
			target: { type: Number },
		}],
	},
},
{ strict: true }
);

budgetSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Budget", budgetSchema);