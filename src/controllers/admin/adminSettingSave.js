require("dotenv").config();
const Setting = require("../../models/Setting.js");

module.exports = adminSettingSave = (req, res, next) => {
  /*
  
  saves a setting
  
  possible response types
  * admin.setting.save.error.tagid
  * admin.setting.save.success.modified
  * admin.setting.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("setting.save");
  }

  // Save
  if (req.body.settingid === "" || req.body.settingid === undefined) {
    console.log("admin.setting.save.error.tagid");
    return res.status(503).json({
      type: "admin.setting.save.error.tagid",
      error: error,
    });
  } else {
    // Modify
    let settingToSave = { ...req.body };

    // Save
    Setting.updateOne(
      {
        settingid: settingToSave.settingid
      },
      settingToSave
    )
      .then(() => {
        console.log("admin.setting.save.success.modified");
        return res.status(200).json({
          type: "admin.setting.save.success.modified",
          tag: settingToSave,
        });
      })
      .catch((error) => {
        console.log("admin.setting.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "admin.setting.save.error.onmodify",
          error: error,
        });
      });
  }
};