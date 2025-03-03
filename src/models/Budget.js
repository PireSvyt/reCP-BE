const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const budgetSchema = mongoose.Schema(
  {
    schema: { type: String },
    budgetid: { type: String, required: true, unique: true },
    communityid: { type: String, required: true },
    userid: { type: String, required: true },
    name: { type: String },
    audience: { type: String, required: true, enum: ["personal", "community"] },
    treatment: {
      type: String,
      required: true,
      enum: ["exit", "entry", "saving"],
    },
    hierarchy: { type: String, enum: ["necessary", "optional"] },
    categoryid: { type: String },
    targets: {
      type: [
        {
          targetid: { type: String, required: true },
          startdate: { type: Date, required: true },
          enddate: { type: Date, required: true },
          target: { type: Number, required: true },
          audience: {
            type: String,
            required: true,
            enum: ["personal", "community"],
          },
        },
      ],
      default: undefined,
    },
  },
  { strict: true }
);

budgetSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Budget", budgetSchema);
