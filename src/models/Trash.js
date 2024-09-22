const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const trashSchema = mongoose.Schema(
{
schema: { type: String },
communityid: { type: String, required: true, unique: true },
colorname: { type: String, required: true },
day: { type: Number, required: true },
slot: { type: String, required: true },
},
{ strict: true }
);

shelfSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Trash", trashSchema);