require("dotenv").config();
const Shelf = require("../../models/Shelf.js");

module.exports = shelfGetList = (req, res, next) => {
  /*
  
  sends back the list of shelfs
  
  possible response types
  * shelf.getlist.success
  * shelf.getlist.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("shelf.getlist");
  }

  Shelf.find({ communityid: req.augmented.user.communityid },
     "shelfid name")
    .then((shelfs) => {
      return res.status(200).json({
        type: "shelf.getlist.success",
        data: {
          shelfs: shelfs,
        },
      });
    })
    .catch((error) => {
      console.log("shelf.getlist.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "shelf.getlist.error.onfind",
        error: error,
        data: {
          shelfs: undefined,
        },
      });
    });
};
