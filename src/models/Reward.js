const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const rewardSchema = mongoose.Schema({
  rewardid: { type: String, required: true, unique: true },
  cost: {
    type: {
      craftid: { type: String, required: true },
      need: { type: Number, required: true },
    },
  },
  reward: {
    type: {
      skillid: { type: String, required: true },
      experience: { type: Number, required: true },
      coins: { type: Number, required: true },
      tokens: { type: Number, required: true },
    },
  },
});

rewardSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Reward", rewardSchema);
