const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const communitySchema = mongoose.Schema(
	{
		schema: { type: String },
		communityid: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		deleterequests: { type: [
			{ 
				userid:  { type: String },
				date:  { type: Date }
			}	],
		},
	},
	{ strict: true }
);

communitySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Community", communitySchema);