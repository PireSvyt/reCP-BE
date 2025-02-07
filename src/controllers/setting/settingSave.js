require("dotenv").config();
const Setting = require("../../models/Setting.js");

module.exports = settingSave = (req, res, next) => {
  /*

saves a setting

possible response types
- setting.save.error.settingid
- setting.save.success.modified
- setting.save.error.onmodify

*/

  if (process.env.DEBUG) {
    console.log("setting.save");
  }

  // Save
  if (req.body.settingid === "" || req.body.settingid === undefined) {
    console.log("setting.save.error.settingid");
    return res.status(503).json({
      type: "setting.save.error.settingid",
      error: error,
    });
  } else {
    // Modify
    let settingToSave = { ...req.body };

    // Save
    Setting.updateOne(
      {
        settingid: settingToSave.settingid,
        userid: req.augmented.user.userid,
      },
      settingToSave
    )
      .then(() => {
        console.log("setting.save.success.modified");
        return res.status(200).json({
          type: "setting.save.success.modified",
          setting: settingToSave,
        });
      })
      .catch((error) => {
        console.log("setting.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "setting.save.error.onmodify",
          error: error,
        });
      });
  }
};
