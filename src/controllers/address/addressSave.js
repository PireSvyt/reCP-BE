require("dotenv").config();
const Address = require("../../models/Address.js");

module.exports = addressSave = (req, res, next) => {
  /*

saves a address

possible response types
- address.save.error.addressid
- address.save.success.modified
- address.save.error.onmodify

*/

  if (process.env.DEBUG) {
    console.log("address.save");
  }

  // Save
  if (req.body.addressid === "" || req.body.addressid === undefined) {
    console.log("address.save.error.addressid");
    return res.status(503).json({
      type: "address.save.error.addressid",
      error: error,
    });
  } else {
    // Modify
    let addressToSave = { ...req.body };
    delete addressToSave.communityid;
    console.log("addressToSave", addressToSave);

    // Save
    Address.updateOne(
      {
        addressid: addressToSave.addressid,
        communityid: req.augmented.user.communityid,
      },
      addressToSave
    )
      .then(() => {
        console.log("address.save.success.modified");
        return res.status(200).json({
          type: "address.save.success.modified",
          address: addressToSave,
        });
      })
      .catch((error) => {
        console.log("address.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "address.save.error.onmodify",
          error: error,
        });
      });
  }
};
