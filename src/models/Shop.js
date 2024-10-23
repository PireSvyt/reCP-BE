const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const shopSchema = mongoose.Schema({
	schema: { type: String },
	shopid: { type: String, required: true, unique: true },
	communityid: { type: String, required: true },
  name: { type: String, required: true }
},
{ strict: true });

shopSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Shop", shopSchema);