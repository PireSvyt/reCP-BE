const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const shelfSchema = mongoose.Schema(
{
schema: { type: String },
shelfid: { type: String, required: true, unique: true },
communityid: { type: String, required: true },
name: { type: String, required: true },
},
{ strict: true }
);

shelfSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Shelf", shelfSchema);