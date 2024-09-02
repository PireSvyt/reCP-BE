const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  transactionid: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  by: { type: String, required: true },
  for: [{ type: String }],
  categoryid: { type: String }
});

module.exports = mongoose.model("Transaction", transactionSchema);
