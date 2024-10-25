const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const recipeSchema = mongoose.Schema(
	{
	  communityid: { type: String, required: true },
	  recipeid: { type: String, required: true, unique: true },
	  name: { type: String, required: true },
	  portions: { type: Number },
	  scale: { type: Number },
	  ingredients: {
	    type: [
	      {
	        shoppingid: { type: String },
	        quantity: { type: Number },
	        unit: { type: String },
	      }
	    ]
	  },
	  instructions: [{ type: String }],
	  tocook: { type: Boolean },
	  cooked: { type: Boolean }
	},
	{ strict: true }
);

recipeSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Recipe", recipeSchema);