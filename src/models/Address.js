const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const addressSchema = mongoose.Schema(
  {
    schema: { type: String },
    addressid: { type: String, required: true, unique: true },
    communityid: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String },
    coordinates: [Number],
    visited: { type: Boolean, default: false },
    icon: { type: String },
    comments: { type: String },
    tagids: {
      type: [{ tagid: String }],
    },
  },
  { strict: true }
);

addressSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Address", addressSchema);
