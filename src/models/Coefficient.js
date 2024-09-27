const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const coefficientSchema = mongoose.Schema(
{
	schema: { type: String },
	coefficientid: { type: String, required: true, unique: true },
	communityid: { type: String, required: true },
	startdate: { type: Date, required: true },
	enddate: { type: Date },
	categoryids: { type: [{ type: String }], default: [] },
	userratios: [
		{ 
			userid:  { type: String },
			ratio:  { type: Number }
		}
	],
},
{ strict: true }
);

coefficientSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Coefficient", coefficientSchema);
