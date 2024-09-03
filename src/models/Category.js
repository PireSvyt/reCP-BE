const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema(
  {
    schema: { type: String },
    categoryid: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
  },
  { strict: true }
);

module.exports = mongoose.model("Category", CategorySchema);
