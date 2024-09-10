const mongoose = require("mongoose");

const TagSchema = mongoose.Schema(
  {
    schema: { type: String },
    tagid: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    color: { type: String },
  },
  { strict: true }
);

module.exports = mongoose.model("Tag", TagSchema);
