const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UseridSchema = new mongoose.Schema({ userid: { type: String } });
const actionSchema = mongoose.Schema(
{
schema: { type: String },
actionid: { type: String, required: true, unique: true },
communityid: { type: String, required: true },
duedate: { type: Date, required: true },
name: { type: String },
reminder: { type: String },
done: { type: Boolean },
doneby: { type: String },
for: [UseridSchema],  // this means that it's an array of {userid: "..."}
recurrenceid: { type: String },
recurrencedate: { type: Date },
},
{ strict: true }
);

actionSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Action", actionSchema);
