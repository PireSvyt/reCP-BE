require("dotenv").config();
const Shelf = require("../../models/Shelf.js");

module.exports = shelfDelete = (req, res, next) => {
  /*
  
  deletes a shelf
  
  possible response types
  * shelf.delete.success
  * shelf.delete.error.ondeletegames
  * shelf.delete.error.ondeleteshelf
  
  */

  if (process.env.DEBUG) {
    console.log("shelf.delete", req.params);
  }

  Shelf.deleteOne({ shelfid: req.params.shelfid, communityid: req.augmented.user.communityid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("shelf.delete.success");
        return res.status(200).json({
          type: "shelf.delete.success",
          data: { outcome: deleteOutcome, shelfid: req.params.shelfid },
        });
      } else {
        console.log("shelf.delete.error.outcome");
        return res.status(400).json({
          type: "shelf.delete.error.outcome",
          data: { outcome: deleteOutcome },
        });
      }
    })
    .catch((error) => {
      console.log("shelf.delete.error.ondeleteshelf");
      console.error(error);
      return res.status(400).json({
        type: "shelf.delete.error.ondeleteshelf",
        error: error,
      });
    });
};
