const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const craftSchema = mongoose.Schema({
  craftid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  skillid: { type: String, required: true },
  skilllelevel: { type: Number, required: true },
  duration: { type: Number, required: true }, // seconds
  energy: { type: Number, required: true },
  dependencies: {
    type: [
      {
        craftid: String,
        need: Number,
      },
    ],
  },
  drop: { type: Number, required: true, default: 1 },
  count: { type: Number, required: true, default: 1 },
  tier: { type: String },
});

craftSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Craft", craftSchema);
