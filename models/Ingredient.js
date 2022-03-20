const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const ingredientSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  unit: { type: String }
});

ingredientSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Ingredient", ingredientSchema);
