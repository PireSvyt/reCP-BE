const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

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
    for: { type: [{ userid: String }] },
    suspendeddate: { type: Date },
    enddate: { type: Date },
    notes: { type: String },
    duration: { type: Number },
  },
  { strict: true }
);

recurrenceSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Recurrence", recurrenceSchema);
