require("dotenv").config();
const Skill = require("../../models/Skill.js");

module.exports = skillSave = (req, res, next) => {
  /*
  
  saves a skill
  
  possible response types
  * skill.save.error.skillid
  * skill.save.success.modified
  * skill.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("skill.save");
  }

  // Save
  if (req.body.skillid === "" || req.body.skillid === undefined) {
    console.log("skill.save.error.skillid");
    return res.status(503).json({
      type: "skill.save.error.skillid",
      error: error,
    });
  } else {
    // Modify
    let skillToSave = { ...req.body };

    // Save
    Skill.updateOne(
      {
        skillid: skillToSave.skillid,
      },
      skillToSave
    )
      .then(() => {
        console.log("skill.save.success.modified");
        return res.status(200).json({
          type: "skill.save.success.modified",
          skill: skillToSave,
        });
      })
      .catch((error) => {
        console.log("skill.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "skill.save.error.onmodify",
          error: error,
        });
      });
  }
};
