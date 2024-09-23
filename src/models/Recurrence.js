const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UseridSchema = new mongoose.Schema({ userid: { type: String } });

const recurrenceSchema = mongoose.Schema(
{
schema: { type: String },
recurrenceid: { type: String, required: true, unique: true },
communityid: { type: String, required: true },
name: { type: String, required: true },
sincedate: { type: Date, required: true },
active: { type: Boolean, required: true },
recurrence: { type: String, required: true },
reminder: { type: String, required: true },
for: [UseridSchema],  // this means that it's an array of {userid: "..."}
suspendeddate: { type: Date },
enddate: { type: Date },
},
{ strict: true }
);

recurrenceSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Recurrence", recurrenceSchema);
