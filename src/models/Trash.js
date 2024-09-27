const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const trashSchema = mongoose.Schema(
{
schema: { type: String },
trashid: { type: String, required: true, unique: true },
communityid: { type: String, required: true},
colorname: { type: String, required: true },
day: { type: Number, required: true },
slot: { type: String, required: true },
},
{ strict: true }
);

trashSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Trash", trashSchema);