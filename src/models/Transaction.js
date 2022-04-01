const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  by: { type: String, required: true },
  for: [{ type: String }]
});

module.exports = mongoose.model("Transaction", transactionSchema);
