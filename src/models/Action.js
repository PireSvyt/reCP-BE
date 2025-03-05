const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const actionSchema = mongoose.Schema(
  {
    schema: { type: String },
    actionid: { type: String, required: true, unique: true },
    communityid: { type: String, required: true },
    audience: { type: String, required: true, enum: ["personal", "community"] },
    duedate: { type: Date, required: true },
    name: { type: String },
    reminder: { type: String },
    done: { type: Boolean },
    for: { type: [{ userid: String }], default: undefined },
    recurrenceid: { type: String },
    recurrencedate: { type: Date },
    notes: { type: String },
    duration: { type: Number },
    doneby: { type: String },
    donedate: { type: Date },
  },
  { strict: true }
);

actionSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Action", actionSchema);
