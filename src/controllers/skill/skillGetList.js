require("dotenv").config();
const Skill = require("../../models/Skill.js");

module.exports = skillGetList = (req, res, next) => {
  /*
  
  sends back the list of skills
  
  possible response types
  * skill.getlist.success
  * skill.getlist.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("skill.getlist");
  }

  Skill.find()
    .then((skills) => {
      return res.status(200).json({
        type: "skill.getlist.success",
        data: {
          skills: skills,
        },
      });
    })
    .catch((error) => {
      console.log("skill.getlist.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "skill.getlist.error.onfind",
        error: error,
        data: {
          skills: undefined,
        },
      });
    });
};
