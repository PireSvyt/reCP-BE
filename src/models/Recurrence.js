const mongoose = require("mongoose");

const RecurrenceSchema = mongoose.Schema(
  {
    schema: { type: String },
    recurrenceid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    sincedate: { type: Date, required: true },
    active: { type: Boolean, required: true },
    recurrence: { type: String, required: true },
    reminder: { type: String, required: true },
    for: { type: [String] },
    suspendeddate: { type: Date },
    enddate: { type: Date },
  },
  { strict: true }
);

module.exports = mongoose.model("Recurrence", RecurrenceSchema);
