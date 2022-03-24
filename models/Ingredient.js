const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const ingredientSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  unit: { type: String, required: true },
  season: {
    starts: { type: Date },
    ends: { type: Date }
  },
  shops: [{ type: String }],
  category: { type: String },
  state: {
    needed: { type: Number },
    available: { type: Number },
    shopped: { type: Boolean }
  }
});

ingredientSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Ingredient", ingredientSchema);
