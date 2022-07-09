const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const shopSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

shopSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Shop", shopSchema);
