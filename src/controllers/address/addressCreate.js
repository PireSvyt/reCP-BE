require("dotenv").config();
const Address = require("../../models/Address.js");

module.exports = addressCreate = (req, res, next) => {
  /*

create an address

possible response types
- address.create.success
- address.create.error

*/

  if (process.env.DEBUG) {
    console.log("address.create");
  }

  let addressToSave = { ...req.body };
  addressToSave.communityid = req.augmented.user.communityid;
  addressToSave = new Address(addressToSave);
  if (addressToSave.coordinates == undefined) {
    addressToSave.coordinates = [];
  }
  if (addressToSave.tagids == undefined) {
    addressToSave.tagids = [];
  }

  // Save
  addressToSave
    .save()
    .then(() => {
      console.log("address.create.success");
      return res.status(201).json({
        type: "address.create.success",
        data: {
          address: addressToSave,
        },
      });
    })
    .catch((error) => {
      console.log("address.create.error");
      console.error(error);
      return res.status(400).json({
        type: "address.create.error",
        error: error,
        data: {
          address: undefined,
        },
      });
    });
};
