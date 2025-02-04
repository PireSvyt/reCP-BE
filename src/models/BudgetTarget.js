const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const budgettargetSchema = mongoose.Schema(
  {
    schema: { type: String },
    budgettargetid: { type: String, required: true, unique: true },
    communityid: { type: String, required: true },
    userid: { type: String, required: true },
    startdate: { type: Date, required: true },
    enddate: { type: Date, required: true },
    target: { type: Number, required: true },
    audience: { type: String, required: true, enum: ["personal", "community"] },
    budgetid: { type: String, required: true },
  },
  { strict: true }
);

budgettargetSchema.plugin(uniqueValidator);

module.exports = mongoose.model("BudgetTarget", budgettargetSchema);
