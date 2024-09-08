require("dotenv").config();
//const jwt_decode = require("jwt-decode");
const Tag = require("../../models/Tag.js");

module.exports = tagCreate = (req, res, next) => {
  /*
  
  create a tag
  
  possible response types
  * tag.create.success
  * tag.create.error
  
  TODO
  * only users from the table can do this
  
  */

  if (process.env.DEBUG) {
    console.log("tag.create");
  }

  // Initialise
  //const authHeader = req.headers["authorization"];
  //const token = authHeader && authHeader.split(" ")[1];
  //const decodedToken = jwt_decode(token);

  const tagToSave = new Tag({ ...req.body });

  // Save
  tagToSave
    .save()
    .then(() => {
      console.log("tag.create.success");
      return res.status(201).json({
        type: "tag.create.success",
        data: {
          tag: tagToSave,
        },
      });
    })
    .catch((error) => {
      console.log("tag.create.error");
      console.error(error);
      return res.status(400).json({
        type: "tag.create.error",
        error: error,
        data: {
          tagid: "",
        },
      });
    });
};
