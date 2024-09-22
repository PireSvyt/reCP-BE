const mongoose = require("mongoose");

const TagSchema = mongoose.Schema(
{
schema: { type: String },
tagid: { type: String, required: true, unique: true },
communityid: { type: String, required: true },
name: { type: String, required: true },
color: { type: String },
},
{ strict: true }
);

module.exports = mongoose.model("Tag", TagSchema);