const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const categorytransactionSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

categorytransactionSchema.plugin(uniqueValidator);

module.exports = mongoose.model(
  "CategoryTransaction",
  categorytransactionSchema
);
