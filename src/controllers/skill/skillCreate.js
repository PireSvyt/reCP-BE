require("dotenv").config();
const Skill = require("../../models/Skill.js");

module.exports = skillCreate = (req, res, next) => {
  /*
  
  create a skill
  
  possible response types
  * skill.create.success
  * skill.create.error
  
  */

  if (process.env.DEBUG) {
    console.log("skill.create");
  }

  let skillToSave = { ...req.body };
  skillToSave = new Skill(skillToSave);

  // Save
  skillToSave
    .save()
    .then(() => {
      console.log("skill.create.success");
      return res.status(201).json({
        type: "skill.create.success",
        data: {
          skill: skillToSave,
        },
      });
    })
    .catch((error) => {
      console.log("skill.create.error");
      console.error(error);
      return res.status(400).json({
        type: "skill.create.error",
        error: error,
        data: {
          skillid: "",
        },
      });
    });
};
