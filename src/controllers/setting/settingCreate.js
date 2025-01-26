require("dotenv").config();
const Setting = require("../../models/Setting.js");

module.exports = settingCreate = (req, res, next) => {
  /*

create a setting

possible response types
- setting.create.success
- setting.create.error

*/

  if (process.env.DEBUG) {
    console.log("setting.create");
  }

  let settingToSave = { ...req.body };
  settingToSave.userid = req.augmented.user.userid;
  settingToSave = new Setting(settingToSave);

  // Save
  settingToSave
    .save()
    .then(() => {
      console.log("setting.create.success");
      return res.status(201).json({
        type: "setting.create.success",
        data: {
          setting: settingToSave,
        },
      });
    })
    .catch((error) => {
      console.log("setting.create.error");
      console.error(error);
      return res.status(400).json({
        type: "setting.create.error",
        error: error,
      });
    });
};
