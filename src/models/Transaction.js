const mongoose = require("mongoose");

const TagidSchema = new mongoose.Schema({ name: String });
const transactionSchema = mongoose.Schema(
  {
    schema: { type: String },
    transactionid: { type: String, required: true, unique: true },
    author: { type: String },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    by: { type: String, required: true },
    for: [{ type: String }],
    categoryid: { type: String },
    tagids: {
      type: [TagidSchema],
      required: false,
      default: undefined,
    },
  },
  { strict: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
