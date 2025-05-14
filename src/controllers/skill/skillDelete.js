require("dotenv").config();
const Skill = require("../../models/Skill.js");

module.exports = skillDelete = (req, res, next) => {
  /*
  
  deletes a skill
  
  possible response types
  * skill.delete.success
  * skill.delete.error.ondeletegames
  * skill.delete.error.ondeleteskill
  
  */

  if (process.env.DEBUG) {
    console.log("skill.delete", req.params);
  }

  Skill.deleteOne({ skillid: req.params.skillid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("skill.delete.success");
        return res.status(200).json({
          type: "skill.delete.success",
          data: { outcome: deleteOutcome, skillid: req.params.skillid },
        });
      } else {
        console.log("skill.delete.error.outcome");
        return res.status(400).json({
          type: "skill.delete.error.outcome",
          data: { outcome: deleteOutcome },
        });
      }
    })
    .catch((error) => {
      console.log("skill.delete.error.ondeleteskill");
      console.error(error);
      return res.status(400).json({
        type: "skill.delete.error.ondeleteskill",
        error: error,
      });
    });
};
