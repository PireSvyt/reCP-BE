require("dotenv").config();
const Action = require("../../models/Action.js");

module.exports = actionGetList = (req, res, next) => {
  /*

sends back the list of actions

possible response types

- action.getlist.success
- action.getlist.error.onfind

inputs

- need : list / todo
- actions
- - number (for list need only)
- - lastid (optional)
- filters (optional)
- - done
- - for
- - date
- - name
- - audience

*/

  if (process.env.DEBUG) {
    console.log("action.getlist");
  }

  // Initialize
  var status = 500;
  var type = "action.getlist.error";
  var fields = "";
  var filters = {};
  var matches = { communityid: req.augmented.user.communityid };

  // Is need input relevant?
  if (!req.body.need) {
    status = 403;
    type = "action.getlist.error.noneed";
  } else {
    switch (req.body.need) {
      case "list":
        fields =
          "actionid audience date name by for amount categoryid tagids notes duration";
        break;
      case "todo":
        fields =
          "actionid audience date name by for amount categoryid tagids notes duration";
        matches.done = false;
        filters.done = false;
        filters.for = [req.augmented.user.userid];
        break;
      default:
        type = "action.getlist.error.needmissmatch";
    }
  }

  // Setting up filters
  if (req.body.filters !== undefined) {
    if (req.body.filters.audience !== undefined) {
      filters.audience = req.body.filters.audience;
    }
    if (req.body.filters.for !== undefined) {
      filters.for = req.body.filters.for;
    }
    if (req.body.filters.done !== undefined) {
      filters.done = req.body.filters.done;
    }
    if (req.body.filters.datemax !== undefined) {
      filters.date = req.body.filters.datemax;
    }
    if (req.body.filters.text !== undefined) {
      filters.name = new RegExp(req.body.filters.text, "i");
    }
  }

  // Is need well captured?
  if (status === 403) {
    res.status(status).json({
      type: type,
      data: {
        actions: [],
        more: null,
        action: null,
      },
    });
  } else {
    Action.aggregate([
      {
        $match: matches,
      },
      {
        $lookup: {
          from: "recurrences",
          foreignField: "recurrenceid",
          localField: "recurrenceid",
          as: "origin",
          pipeline: [
            {
              $project: {
                _id: 0,
                recurrenceid: 1,
                audience: 1,
                name: 1,
                active: 1,
                recurrence: 1,
                reminder: 1,
                for: 1,
                suspendeddate: 1,
                enddate: 1,
                notes: 1,
                duration: 1,
              },
            },
          ],
        },
      },
      {
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
          origin: 1,
          notes: 1,
          duration: 1,
        },
      },
    ])
      .then((actions) => {
        // Repackaging
        let actionsToSend = [];
        actions.forEach((action) => {
          let actionToSend = {};
          actionToSend.actionid = action.actionid;
          actionToSend.audience = action.audience;
          actionToSend.duedate = action.duedate;
          actionToSend.done = action.done;
          actionToSend.notes = action.notes;
          console.log("action.origin", action.origin);
          if (action.origin.length === 1) {
            actionToSend.recurrenceid = action.recurrenceid;
            actionToSend.recurrencedate = action.recurrencedate;
            if (action.name !== undefined) {
              actionToSend.name = action.name;
            } else {
              actionToSend.name = action.origin[0].name;
            }
            if (action.for !== undefined) {
              actionToSend.for = action.for;
            } else {
              actionToSend.for = action.origin[0].for;
            }
            if (action.reminder !== undefined) {
              actionToSend.reminder = action.reminder;
            } else {
              actionToSend.reminder = action.origin[0].reminder;
            }
            if (action.duration !== undefined) {
              actionToSend.duration = action.duration;
            } else {
              actionToSend.duration = action.origin[0].duration;
            }
          } else {
            actionToSend.name = action.name;
            actionToSend.for = action.for;
            actionToSend.reminder = action.reminder;
            actionToSend.duration = action.duration;
          }
          if (
            (action.origin.length === 1 && action.recurrenceid !== undefined) ||
            action.recurrenceid === undefined
          ) {
            actionsToSend.push(actionToSend);
          }
        });

        // Filtering
        let action;
        let more;
        if (req.body.need === "list") {
          // Sort
          actionsToSend = actionsToSend.sort((a, b) => {
            if (a.duedate === b.duedate) {
              return 0;
            } else if (a.duedate > b.duedate) {
              return -1;
            } else {
              return 1;
            }
          });

          // Filter
          actionsToSend = actionsToSend.filter((action) => {
            let pass = true;
            // Privacy
            if (
              action.audience === "personal" &&
              !action.for
                .map((f) => {
                  return f.userid;
                })
                .includes(req.augmented.user.userid)
            ) {
              pass = false;
            }
            //
            if (filters.audience !== undefined) {
              if (action.audience !== filters.audience) {
                pass = false;
              }
              if (
                action.audience === "personal" &&
                !action.for
                  .map((f) => {
                    return f.userid;
                  })
                  .includes(req.augmented.user.userid)
              ) {
                pass = false;
              }
            }
            if (filters.for !== undefined) {
              let passFor = false;
              filters.for.forEach((f) => {
                if (
                  action.for
                    .map((fm) => {
                      return fm.userid;
                    })
                    .includes(f)
                ) {
                  passFor = true;
                }
              });
              if (action.for.length === 0) {
                passFor = true;
              }
              if (!passFor) {
                pass = false;
              }
            }
            if (filters.done !== undefined) {
              if (action.done !== filters.done) {
                pass = false;
              }
            }
            if (filters.date !== undefined) {
              if (Date.parse(action.duedate) > Date.parse(filters.date)) {
                pass = false;
              }
            }
            if (filters.name !== undefined) {
              if (!filters.name.test(action.name)) {
                pass = false;
              }
            }
            return pass;
          });

          // Are actions already loaded
          let lastidpos = 0;
          if (req.body.actions.lastid !== undefined) {
            // Find last action loaded
            lastidpos = actionsToSend.findIndex((action) => {
              return action.actionid === req.body.actions.lastid;
            });
            if (lastidpos === -1) {
              // Last id not found :/
              action = "error";
              lastidpos = 0;
            } else {
              action = "append";
              lastidpos = lastidpos + 1;
            }
          } else {
            action = "new";
          }

          // Shorten payload
          actionsToSend = actionsToSend.slice(
            lastidpos, // from N, ex. 0
            lastidpos + req.body.actions.number + 1 // to N+M, ex. 0+10
          );

          // Check if more
          // transactions [ N ... N+M ] length = M+1, ex. 0-10 -> 11 transactions
          more = actionsToSend.length > req.body.actions.number;
          // Shorten to desired length
          if (more === true) {
            actions.pop();
          }
        }

        if (req.body.need === "todo") {
          // Filter
          const reminders = [
            {
              key: "onDueDate",
              delay: 0,
            },
            {
              key: "1dayBefore",
              delay: 1,
            },
            {
              key: "2daysBefore",
              delay: 2,
            },
            {
              key: "3daysBefore",
              delay: 3,
            },
            {
              key: "1weekBefore",
              delay: 7,
            },
            {
              key: "1monthBefore",
              delay: 30,
            },
          ];
          let nowDate = new Date();
          actionsToSend = actionsToSend.filter((action) => {
            let pass = true;
            if (filters.for !== undefined) {
              let passFor = false;
              filters.for.forEach((f) => {
                if (
                  action.for
                    .map((fm) => {
                      return fm.userid;
                    })
                    .includes(f)
                ) {
                  passFor = true;
                }
              });
              if (action.for.length === 0) {
                passFor = true;
              }
              if (!passFor) {
                pass = false;
              }
            }
            if (filters.done !== undefined) {
              if (action.done !== filters.done) {
                pass = false;
              }
            }
            // Meet reminders
            let dueDate = new Date(action.duedate);
            let reminder = reminders.filter((r) => {
              return r.key === action.reminder;
            })[0];
            let reminderDate = dueDate - reminder.delay * (1000 * 3600 * 24);
            if (nowDate < reminderDate) {
              pass = false;
            }

            return pass;
          });

          // Sort
          actionsToSend = actionsToSend.sort((a, b) => {
            if (a.duedate === b.duedate) {
              return 0;
            } else if (a.duedate < b.duedate) {
              return -1;
            } else {
              return 1;
            }
          });

          action = "todo";
          more = false;
        }

        // Response
        return res.status(200).json({
          type: "action.getlist.success",
          data: {
            actions: actionsToSend,
            more: more,
            action: action,
          },
        });
      })
      .catch((error) => {
        console.log("action.getlist.error.onfind");
        console.error(error);
        return res.status(400).json({
          type: "action.getlist.error.onfind",
          error: error,
          data: {
            actions: undefined,
            more: null,
            action: null,
          },
        });
      });
  }
};
