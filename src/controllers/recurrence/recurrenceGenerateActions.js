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
    res.status(status).json({
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
                name: 1,
                duedate: 1,
                reminder: 1,
                done: 1,
                for: 1,
                recurrenceid: 1,
                recurrencedate: 1,              
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
          name: 1,
          active: 1,
          recurrence: 1,
          reminder: 1,
          for: 1,
          suspendeddate: 1,
          enddate: 1,
          actions: 1,     
        },
      },
    ])
      .then((recurrences) => {
        let actionsToCreate = []
        recurrences.forEach(recurrence => {
          // Is the recurrence to be checked
          let recurrenceToCheck = true
          if (!recurrence.active) {recurrenceToCheck = false}
          if (recurrence.suspendeddate !== undefined) {
            let suspendeddate = Date.parse(recurrence.suspendeddate)
            let nowdate = Date.now()
            if (suspendeddate - 1000 * 3600 * 24 * req.body.for > nowdate) {
              recurrenceToCheck = false
            }
          }
          if (recurrence.enddate !== undefined) {
            if (recurrence.enddate < new Date() {recurrenceToCheck = false}
          }
          if (recurrenceToCheck) {
            // Get recurrencedates
            recurrencedates = serviceGetRecurrenceDates(recurrence, req.body.for)
            // Checking the recurrence
            recurrencedates.forEach(recurrencedate => {
              let recurrenceDateAlreadyAccounted = false
              recurrence.actions.forEach(action => {
                if (action.recurrencedate === recurrencedate) {
                  recurrenceDateAlreadyAccounted = true
                }
              })
              if (!recurrenceDateAlreadyAccounted) {
                // Add an action to create
                actionsToCreate.push({
                  actionid: random_string(24),
                  recurrenceid: recurrence.recurrenceid,
                  duedate: recurrencedate,
                  recurrencedate: recurrencedate,
                  done: false,
                  for: ["NA"],
                })
              }              
            })            
          } 
        })
        // Action creations
        if (actionsToCreate.length === 0) {
          return res.status(200).json({
            type: "recurrence.generateactions.success"
          });
        } else {
          Action.create(actionsToCreate)
            .then((outcome) => {
              // Response
              return res.status(200).json({
                type: "recurrence.generateactions.success"
              });
            })
            .catch((error) => {
              console.log("recurrence.generateactions.error.oncreation");
              console.error(error);
              return res.status(400).json({
                type: "recurrence.generateactions.error.oncreation",
                error: error,
              });
            });
        }
      })
      .catch((error) => {
        console.log("recurrence.generateactions.error.onaggregate");
        console.error(error);
        return res.status(400).json({
          type: "recurrence.generateactions.error.onaggregate",
          error: error,
        });
      });
  }
};
