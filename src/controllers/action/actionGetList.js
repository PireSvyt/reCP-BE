require("dotenv").config();
const Action = require("../../models/Action.js");

module.exports = actionGetList = (req, res, next) => {
  /*
  
  sends back the list of actions
  
  possible response types
  * action.getlist.success
  * action.getlist.error.onfind
  
  inputs
  * need
  * actions
  * - number
  * - lastid (optional)
  * filters (optional)
  * - done
  * - for
  
  */

  if (process.env.DEBUG) {
    console.log("action.getlist");
  }

  // Initialize
  var status = 500;
  var type = "action.getlist.error";
  var fields = "";
  var filters = {};

  // Is need input relevant?
  if (!req.body.need) {
    status = 403;
    type = "action.getlist.error.noneed";
  } else {
    switch (req.body.need) {
      case "list":
        fields = "actionid date name by for amount categoryid tagids";
        break;
      default:
        type = "action.getlist.error.needmissmatch";
    }
  }

  // Setting up filters
  if (req.body.filters !== undefined) {
    if (req.body.filters.for !== undefined) {
      filters.for = req.body.filters.for;
    }
    if (req.body.filters.done !== undefined) {
      filters.done = req.body.filters.done;
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
        $lookup: {
          from: "recurrences",
          foreignField: "recurrenceid",
          localField: "recurrenceid",
          as: "origin",
          pipeline: [
            {
              // recurrenceid name active recurrence reminder for suspendeddate enddate
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
              },
            },
          ],
        },
      },
      {
        // actionid name duedate reminder done for recurrenceid
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
          origin: 1,
        },
      },
    ])
      .then((actions) => {
        // Repackaging
        let actionsToSend = [];
        actions.forEach((action) => {
          let actionToSend = {};
          actionToSend.actionid = action.actionid;
          actionToSend.duedate = action.duedate;
          actionToSend.done = action.done;

          console.log("action.origin", action.origin)
          if (Object.keys(action.origin).length > 0) {
            actionToSend.recurrenceid = action.recurrenceid;
            actionToSend.recurrencedate = action.recurrencedate;
            actionToSend.name = action.origin.name;
            actionToSend.for = action.origin.for;
            actionToSend.reminder = action.origin.reminder;
          } else {
            actionToSend.name = action.name;
            actionToSend.for = action.for;
            actionToSend.reminder = action.reminder;
          }
          actionsToSend.push(actionToSend);
        });
        // Filtering
        actionsToSend = actionsToSend.filter((action) => {
          let pass = true;
          if (filters.for !== undefined) {
            let passFor = false;
            filters.for.forEach((f) => {
              if (action.for.includes(f)) {
                passFor = true;
              }
            });
            if (!passFor) {
              pass = false;
            }
          }
          if (filters.done !== undefined) {
            if (action.done !== filters.done) {
              pass = false;
            }
          }
          return pass;
        });
        // Response
        return res.status(200).json({
          type: "action.getlist.success",
          data: {
            actions: actionsToSend,
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
          },
        });
      });
  }
};
