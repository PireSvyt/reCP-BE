const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const ingredientSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  unit: { type: String, required: true },
  shelf: { type: String },
  quantity: { type: Number },
  available: { type: Number },
  shopped: { type: Number },
  season: {
    starts: { type: Date },
    ends: { type: Date }
  },
  category: { type: String }
});

ingredientSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Ingredient", ingredientSchema);
