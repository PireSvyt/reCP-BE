const mongoose = require("mongoose");

const recSchema = new mongoose.Schema({ 
  by: { type: String },
  day: { type: Number },
  month: { type: Number },
  weekday: { type: Number },
});
const RecurrenceSchema = mongoose.Schema(
  {
    schema: { type: String },
    recurrenceid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    sincedate: { type: Date, required: true },
    active: { type: Boolean, required: true },
    recurrence: { type: recSchema, required: true },
    reminder: { type: String, required: true },
    for: [{ type: String }],
    suspendeddate: { type: Date },
    enddate: { type: Date },
  },
  { strict: true }
);

module.exports = mongoose.model("Recurrence", RecurrenceSchema);
