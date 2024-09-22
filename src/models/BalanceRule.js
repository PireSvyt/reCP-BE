const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const categoryidSchema = new mongoose.Schema({ categoryid: { type: String } });

const ratioSchema = new mongoose.Schema({
userid: { type: String },
ratio: { type: Number },
});

const balanceruleSchema = mongoose.Schema(
{
schema: { type: String },
balanceruleid: { type: String, required: true, unique: true },
startdate: { type: Date, required: true },
enddate: { type: Date },
categories: {
type: [categoryidSchema], // this means that it's an array of {categoryid: "..."}
},
ratios: {
type: [ratioSchema], // this means that it's an array of {userid: "...", ratio: 0.5}
},
},
{ strict: true }
);

balanceruleSchema.plugin(uniqueValidator);

module.exports = mongoose.model("BalanceRule", balanceruleSchema);