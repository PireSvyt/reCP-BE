const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const shoppingSchema = mongoose.Schema(
{
	schema: { type: String },
	shoppingid: { type: String, required: true, unique: true },
	communityid: { type: String, required: true },
	name: { type: String, required: true },
	unit: { type: String },
	need: { type: Number },
	available: { type: Number },
	done: { type: Boolean, required: true },
	shelfid: { type: String },
	prices: {
		type: [{ 
			shopid: String,
			price: Number,
			quantity: String,
			unit: String,
			date: Date
		}],
	},
},
{ strict: true }
);

shoppingSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Shopping", shoppingSchema);