const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const skillSchema = mongoose.Schema({
  skillid: { type: String, required: true, unique: true },
  name: {
    type: String,
    required: true,
    enum: [
      "Woodwork",
      "Metalworking",
      "Stoneshaping",
      "Business",
      "Cooking",
      "Farming",
      "Petcare",
      "Mining",
      "Forestry",
    ],
  },
  level: { type: Number, required: true },
  experience: { type: Number, required: true },
});

skillSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Skill", skillSchema);
