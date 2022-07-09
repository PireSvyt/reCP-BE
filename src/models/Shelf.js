const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const shelfSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

shelfSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Shelf", shelfSchema);
