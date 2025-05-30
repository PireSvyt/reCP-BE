require("dotenv").config();
const Recurrence = require("../../models/Recurrence.js");
const Action = require("../../models/Action.js");
const serviceGetRecurrenceDates = require("./services/serviceGetRecurrenceDates.js");
const random_string = require("../../utils/random_string.js");

module.exports = recurrenceGenerateActions = (req, res, next) => {
  /*
  
  generates the recurring actions based on recurrence
  checking that it's not creating duplicates
  
  possible response types
  * recurrence.generateactions.success
  * recurrence.generateactions.error.nofor  
  * recurrence.generateactions.error.onaggregate
  * recurrence.generateactions.error.oncreation

  inputs
  * for : in days to mention how many days in advances have to be generated  
  
  */

  if (process.env.DEBUG) {
    console.log("recurrence.generateactions");
  }

  // Initialize
  var status = 500;
  var type = "recurrence.generateactions.error";

  // Is need input relevant?
  if (!req.body.for) {
    status = 403;
    type = "recurrence.generateactions.error.nofor";
  }

  // Is for well captured?
  if (status === 403) {
    res.status(status);
    res.json({
      type: type,
    });
  } else {
    Recurrence.aggregate([
      {
        $lookup: {
          from: "actions",
          foreignField: "recurrenceid",
          localField: "recurrenceid",
          as: "actions",
          pipeline: [
            {
              // recurrenceid name active recurrence reminder for suspendeddate enddate
              $project: {
                _id: 0,
                actionid: 1,
                audience: 1,
                name: 1,
                duedate: 1,
                reminder: 1,
                done: 1,
                for: 1,
                recurrenceid: 1,
                recurrencedate: 1,
                notes: 1,
                duration: 1,
              },
            },
          ],
        },
      },
      {
        // actionid name duedate reminder done for recurrenceid
        $project: {
          _id: 0,
          recurrenceid: 1,
          audience: 1,
          sincedate: 1,
          name: 1,
          active: 1,
          recurrence: 1,
          reminder: 1,
          for: 1,
          suspendeddate: 1,
          enddate: 1,
          actions: 1,
          communityid: 1,
          notes: 1,
          duration: 1,
        },
      },
    ])
      .then((recurrences) => {
        let actionsToCreate = [];
        recurrences.forEach((recurrence) => {
          // Is the recurrence to be checked
          let recurrenceToCheck = true;
          let nowdate = Date.now();
          if (!recurrence.active) {
            recurrenceToCheck = false;
          }
          if (recurrence.suspendeddate !== undefined) {
            let suspendeddate = Date.parse(recurrence.suspendeddate);
            if (suspendeddate - 1000 * 3600 * 24 * req.body.for > nowdate) {
              recurrenceToCheck = false;
            }
          }
          if (recurrence.enddate !== undefined) {
            let enddate = Date.parse(recurrence.enddate);
            if (enddate < nowdate) {
              recurrenceToCheck = false;
            }
          }
          if (recurrenceToCheck) {
            // Get recurrencedates
            let recurrencedates = serviceGetRecurrenceDates(
              recurrence,
              req.body.for
            );
            //console.log("recurrencedates", recurrencedates);
            // Checking the recurrence
            recurrencedates.forEach((recurrencedate) => {
              let recurrenceDateAlreadyAccounted = false;
              recurrence.actions.forEach((action) => {
                let actionRecurrenceDate = new Date(action.recurrencedate);
                let identifiedRecurrenceDate = new Date(recurrencedate);
                if (
                  actionRecurrenceDate.getTime() ===
                  identifiedRecurrenceDate.getTime()
                ) {
                  recurrenceDateAlreadyAccounted = true;
                }
              });
              if (!recurrenceDateAlreadyAccounted) {
                // Add an action to create
                /*console.log(
                  "Action to create for recurrencedate",
                  recurrencedate
                );*/
                actionsToCreate.push({
                  actionid: random_string(24),
                  audience: recurrence.audience,
                  recurrenceid: recurrence.recurrenceid,
                  communityid: recurrence.communityid,
                  duedate: recurrencedate,
                  recurrencedate: recurrencedate,
                  for: recurrence.for,
                  reminder: recurrence.reminder,
                  done: false,
                  notes: recurrence.notes,
                  duration: recurrence.duration,
                });
              }
            });
          }
        });
        // Action creations
        if (actionsToCreate.length === 0) {
          console.log("No actions to create");
          res.status(200);
          res.json({
            type: "recurrence.generateactions.success",
          });
        } else {
          console.log("Actions to create", actionsToCreate);
          Action.create(actionsToCreate)
            .then((outcome) => {
              console.log("Actions creation outcome", outcome);
              // Response
              res.status(200);
              res.json({
                type: "recurrence.generateactions.success",
              });
            })
            .catch((error) => {
              console.log("recurrence.generateactions.error.oncreation");
              console.error(error);
              res.status(400);
              res.json({
                type: "recurrence.generateactions.error.oncreation",
                error: error,
              });
            });
        }
      })
      .catch((error) => {
        console.log("recurrence.generateactions.error.onaggregate");
        console.error(error);
        res.status(400);
        res.json({
          type: "recurrence.generateactions.error.onaggregate",
          error: error,
        });
      });
  }
  return res;
};
