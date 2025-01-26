require("dotenv").config();
const Setting = require("../../models/Setting.js");

module.exports = settingDelete = (req, res, next) => {
  /*

deletes a setting

possible response types
- setting.delete.success
- setting.delete.error.ondeletegames
- setting.delete.error.ondeletesetting

*/

  if (process.env.DEBUG) {
    console.log("setting.delete", req.body);
  }

  Setting.deleteOne({
    settingid: req.params.settingid,
    userid: req.augmented.user.userid,
  })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("setting.delete.success");
        return res.status(200).json({
          type: "setting.delete.success",
          data: {
            outcome: deleteOutcome,
            settingid: req.params.settingid,
          },
        });
      } else {
        console.log("setting.delete.error.outcome");
        return res.status(400).json({
          type: "setting.delete.error.outcome",
          data: { outcome: deleteOutcome },
        });
      }
    })
    .catch((error) => {
      console.log("setting.delete.error.ondeletesetting");
      console.error(error);
      return res.status(400).json({
        type: "setting.delete.error.ondeletesetting",
        error: error,
      });
    });
};
