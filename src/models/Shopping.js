const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const shoppingSchema = mongoose.Schema(
  {
    schema: { type: String },
    name: { type: String, required: true, unique: true },
    shoppingid: { type: String, required: true, unique: true },
    shelfid: { type: String },
    unit: { type: String },
    quantity: { type: Number },
    available: { type: Boolean, required: true },
  },
  { strict: true }
);

shoppingSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Shopping", shoppingSchema);
