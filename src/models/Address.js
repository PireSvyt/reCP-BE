const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const addressSchema = mongoose.Schema(
  {
    schema: { type: String },
    addressid: { type: String, required: true, unique: true },
    communityid: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number], // [Longitude, Latitude]
    },
    website: String,
    tagids: {
      type: [{ tagid: String }],
    },
  },
  { strict: true }
);

addressSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Address", addressSchema);
