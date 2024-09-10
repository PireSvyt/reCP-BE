const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const shelfSchema = mongoose.Schema(
  {
    schema: { type: String },
    name: { type: String, required: true, unique: true },
    shelfid: { type: String, required: true, unique: true },
  },
  { strict: true }
);

shelfSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Shelf", shelfSchema);
