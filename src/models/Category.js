const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const categorySchema = mongoose.Schema(
  {
    schema: { type: String },
    categoryid: { type: String, required: true, unique: true },
    communityid: { type: String, required: true },
    name: { type: String, required: true },
    color: { type: String },
  },
  { strict: true }
);

categorySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Category", categorySchema);
