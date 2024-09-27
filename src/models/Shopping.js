const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const shoppingSchema = mongoose.Schema(
{
schema: { type: String },
shoppingid: { type: String, required: true, unique: true },
communityid: { type: String, required: true },
name: { type: String, required: true },
unit: { type: String },
quantity: { type: Number },
available: { type: Boolean, required: true },
shelfid: { type: String },
},
{ strict: true }
);

shoppingSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Shopping", shoppingSchema);