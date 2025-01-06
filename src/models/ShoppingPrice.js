const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const shoppingpriceSchema = mongoose.Schema(
  {
    schema: { type: String },
    shoppingpriceid: { type: String, required: true, unique: true },
    shoppingid: { type: String, required: true },
    communityid: { type: String, required: true },
    shopid: { type: String, required: true },
    quantity: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { strict: true }
);

shoppingpriceSchema.plugin(uniqueValidator);

module.exports = mongoose.model("ShoppingPrice", shoppingpriceSchema);
