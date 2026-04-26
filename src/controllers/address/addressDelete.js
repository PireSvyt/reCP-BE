require("dotenv").config();
const Address = require("../../models/Address.js");

module.exports = addressDelete = (req, res, next) => {
  /*

deletes an address

possible response types
- address.delete.success
- address.delete.error.ondeletegames
- address.delete.error.ondeleteaddress

*/

  if (process.env.DEBUG) {
    console.log("address.delete", req.params);
  }

  Address.deleteOne({
    addressid: req.params.addressid,
    communityid: req.augmented.user.communityid,
  })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("address.delete.success");
        return res.status(200).json({
          type: "address.delete.success",
          data: {
            outcome: deleteOutcome,
            addressid: req.params.addressid,
          },
        });
      } else {
        console.log("address.delete.error.outcome");
        return res.status(400).json({
          type: "address.delete.error.outcome",
          data: { outcome: deleteOutcome },
        });
      }
    })
    .catch((error) => {
      console.log("address.delete.error.ondeleteaddress");
      console.error(error);
      return res.status(400).json({
        type: "address.delete.error.ondeleteaddress",
        error: error,
      });
    });
};
