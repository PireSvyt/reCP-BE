const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    transactionid: { type: String, required: true, unique: true },
    author: { type: String },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    by: { type: String, required: true },
    for: [{ type: String }],
    categoryid: { type: String },
  },
  { strict: true }
);

// Text indexing
// https://stackoverflow.com/questions/28775051/best-way-to-perform-a-full-text-search-in-mongodb-and-mongoose
transactionSchema.index({ name: "text", name: "text" });

module.exports = mongoose.model("Transaction", transactionSchema);
