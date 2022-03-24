const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const recipeSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  picture: { type: String },
  portions: { type: Number },
  scale: { type: Number },
  ingredients: {
    type: [
      {
        id: { type: String },
        quantity: { type: Number }
      }
    ]
  },
  instructions: [{ type: String }],
  state: {
    selected: { type: Boolean },
    cooked: { type: Boolean }
  }
});

recipeSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Recipe", recipeSchema);
