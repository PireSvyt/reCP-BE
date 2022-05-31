const Ingredient = require("../models/Ingredient");

exports.getItem = (req, res, next) => {
  // Initialize
  var status = 400;
  var filters = {};
  var fields = "";
  var consumer = "";
  // Leverage on request
  if (req.body.filters) {
    filters = req.body.filters;
  }
  if (req.body.fields) {
    fields = req.body.fields;
  }
  if (req.body.consumer) {
    consumer = req.body.consumer;
  }
  // Find

  //https://mongoosejs.com/docs/api.html#model_Model.find
  // executes, name LIKE john and only selecting the "name" and "friends" fields
  // await MyModel.find({ name: /john/i }, 'name friends').exec();

  Ingredient.find(filters, fields)
    .then((ingredients) => {
      switch (consumer) {
        case "needed":
          status = 200; // OK
          break;
        case "available":
          status = 200; // OK
          break;
        case "toshop":
          status = 200; // OK
          break;
        case "shopped":
          status = 200; // OK
          break;
        default:
          status = 403; // Access denied
          ingredients = [];
      }
      res.status(status).json(ingredients);
    })
    .catch((error) => res.status(status).json({ error }));
};

exports.getList = (req, res, next) => {
  // Initialize
  var status = 500;
  var filters = {};
  var fields = "";
  var where = "";

  // Needs
  switch (req.body.need) {
    case "ingredients":
      fields = "name unit category";
      break;
    case "recipe":
      if (req.body.details["_ids"]) {
        filters = { _id: { $in: req.body.details["_ids"] } };
      }
      fields = "name unit";
      break;
    case "thisweek":
      where = "this.state.needed > 0";
      fields = "name unit needed available";
      break;
    case "fridge":
      where = "this.state.needed > 0";
      fields = "name unit needed available";
      break;
    case "shopping":
      where =
        "this.state.needed > 0 && this.state.needed - this.state.available > 0";
      fields = "name unit needed available shopped";
      break;
    case "shopped":
      where = "this.state.needed > 0 && this.state.shopped ";
      fields = "name unit needed available shopped";
      break;
    default:
      status = 403; // Access denied
  }

  if (status === 403) {
    res.status(status).json([]);
  } else {
    // Find
    //https://mongoosejs.com/docs/api.html#model_Model.find
    // executes, name LIKE john and only selecting the "name" and "friends" fields
    // await MyModel.find({ name: /john/i }, 'name friends').exec();
    Ingredient.find(filters, fields)
      .$where(where)
      .exec()
      .then((ingredients) => {
        status = 200; // OK
        res.status(status).json(ingredients);
      })
      .catch((error) => {
        status = 400; // OK
        res.status(status).json([]);
      });
  }
};
