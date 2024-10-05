require("dotenv").config();
const Setting = require("../../models/Setting.js");

module.exports = adminSettingGetList = (req, res, next) => {
  /*
  
  sends back the list of settings
  
  possible response types
  * admin.setting.getlist.success
  * admin.setting.getlist.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("setting.getlist");
  }

  Setting.find({})
    .then((settings) => {
      return res.status(200).json({
        type: "admin.setting.getlist.success",
        data: {
          settings: settings,
        },
      });
    })
    .catch((error) => {
      console.log("admin.setting.getlist.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "admin.setting.getlist.error.onfind",
        error: error,
      });
    });
};