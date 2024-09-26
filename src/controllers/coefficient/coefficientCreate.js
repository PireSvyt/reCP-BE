require("dotenv").config();
const Coefficient = require("../../models/Coefficient.js");

module.exports = coefficientCreate = (req, res, next) => {
  /*

create a coefficient

possible response types
- coefficient.create.success
- coefficient.create.error

*/

  if (process.env.DEBUG) {
    console.log("coefficient.create");
  }

  let coefficientToSave = { ...req.body }
  coefficientToSave.communityid = req.augmented.user.communityid  
  coefficientToSave = new Coefficient(coefficientToSave);
  
  // Save
  coefficientToSave.save()
    .then(() => {
      console.log("coefficient.create.success");
      return res.status(201).json({
        type: "coefficient.create.success",
        data: {
          coefficient: coefficientToSave,
        },
      });
    })
    .catch((error) => {
      console.log("coefficient.create.error");
      console.error(error);
      return res.status(400).json({
        type: "coefficient.create.error",
        error: error,
        data: {
          coefficientid: "",
        },
      });
    });
};
