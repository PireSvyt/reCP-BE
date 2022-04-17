const mongoose = require("mongoose");

const categorytransactionSchema = mongoose.Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model(
  "CategoryTransaction",
  categorytransactionSchema
);
