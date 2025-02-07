require("dotenv").config();
const Setting = require("../../models/Setting.js");

module.exports = settingGetList = (req, res, next) => {
  /*

sends back the setting list

possible response types
- setting.getlist.success
- setting.getlist.error.onfind

inputs
- need

*/

  if (process.env.DEBUG) {
    console.log("setting.getlist");
  }

  var filters = {
    userid: req.augmented.user.userid,
  };

  Setting.find(filters)
    .then((settings) => {
      // Response
      console.log("setting.getlist.success");
      return res.status(200).json({
        type: "setting.getlist.success",
        data: {
          settings: settings,
        },
      });
    })
    .catch((error) => {
      console.log("setting.getlist.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "setting.getlist.error.onfind",
        error: error,
      });
    });
};
