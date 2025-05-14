const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const rewardSchema = mongoose.Schema({
  rewardid: { type: String, required: true, unique: true },
  craftid: { type: String, required: true },
  need: { type: Number, required: true },
  skillid: { type: String },
  experience: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  tokens: { type: Number, default: 0 },
});

rewardSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Reward", rewardSchema);
