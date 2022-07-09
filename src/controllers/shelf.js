const Shelf = require("../models/Shelf");

exports.createShelf = (req, res, next) => {
  console.log("shelf.createShelf");
  delete req.body._id;
  const shelf = new Shelf({ ...req.body });
  shelf
    .save()
    .then(() => {
      res.status(201).json({
        message: "ingrédient enregistré",
        id: shelf._id
      });
    })
    .catch((error) => res.status(400).json({ error }));
};
exports.modifyShelf = (req, res, next) => {
  console.log("shelf.modifyShelf");
  Shelf.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "shelf modifié" }))
    .catch((error) => res.status(400).json({ error }));
};
exports.findOneShelf = (req, res, next) => {
  console.log("shelf.findOneShelf");
  Shelf.findOne({ _id: req.params.id })
    .then((shelf) => res.status(200).json(shelf))
    .catch((error) => res.status(404).json({ message: "shelf introuvable" }));
};
exports.findShelfs = (req, res, next) => {
  console.log("shelf.findShelfs");
  Shelf.find()
    .then((shelfs) => res.status(200).json(shelfs))
    .catch((error) => res.status(400).json({ error }));
};

// LEVERAGED
exports.getShelfItem = (req, res, next) => {
  console.log("shelf.getShelfItem");
  // Initialize
  var status = 500;

  Shelf.findOne({ _id: req.params.id })
    .then((shelf) => {
      status = 200; // OK
      res.status(status).json({
        status: status,
        message: "shelf ok",
        shelf: shelf
      });
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on find",
        shelf: {},
        error: error
      });
      console.error(error);
    });
};
exports.getShelfList = (req, res, next) => {
  console.log("shelf.getShelfList");
  // Initialize
  var status = 500;
  var filters = {};
  var fields = "";
  var where = "";

  // useful
  function compare(a, b) {
    if (a.name.localeCompare(b.name, "en", { sensitivity: "base" }) === 1) {
      return 1;
    } else {
      return -1;
    }
  }

  // Needs
  if (!req.body.need) {
    status = 403; // Access denied
  } else {
    switch (req.body.need) {
      case "shelfs":
        fields = "name";
        break;
      default:
        status = 403; // Access denied
    }
  }

  if (status === 403) {
    res.status(status).json({
      status: status,
      message: "wrong need usage",
      shelfs: []
    });
  } else {
    // Find
    //https://mongoosejs.com/docs/api.html#model_Model.find
    // executes, name LIKE john and only selecting the "name" and "friends" fields
    // await MyModel.find({ name: /john/i }, 'name friends').exec();
    /*
    Shelf.find(filters, fields)
      .$where(where)
      .exec()
      .then((shelfs) => {
        status = 200; // OK
        res.status(status).json(shelfs);
      })
      .catch((error) => {
        status = 400; // OK
        res.status(status).json([]);
      });*/

    //https://www.mongodb.com/docs/manual/reference/operator/query/where/
    /*db.players.find( {$expr: { $function: {
        body: function(name) { return hex_md5(name) == "9b53e667f30cd329dca1ec9e6a83e994"; },
        args: [ "$name" ],
        lang: "js"
  } } } )
  */
    /*
    Shelf.find(filters, fields)
      .where(where)
      .exec(function (err, data) {
        if (err) {
          console.log(err);
          console.log("error returned");
          res.send(500, { error: "Failed insert" });
        }

        if (!data) {
          res.send(403, { error: "Authentication Failed" });
        }

        res.send(200, data);
        console.log("success generate List");
        console.log(data);
      });
      */

    Shelf.find(filters, fields)
      .where(where)
      .then((shelfs) => {
        // Sort
        shelfs.sort(compare);

        status = 200; // OK
        res.status(status).json({
          status: status,
          message: "list ok",
          shelfs: shelfs
        });
      })
      .catch((error) => {
        status = 400;
        res.status(status).json({
          status: status,
          message: "error on find",
          shelfs: [],
          error: error
        });
        console.error(error);
      });
  }
};
exports.saveShelf = (req, res, next) => {
  console.log("shelf.saveShelf");
  // Initialize
  var status = 500;
  console.log(req.body);
  // Name violation check
  if (req.body._id === "" || req.body._id === undefined) {
    console.log("shelf to create");
    let filters = { name: req.body.name };
    Shelf.find(filters)
      .then((shelfs) => {
        if (shelfs.length > 0) {
          // Name already exists
          console.log("name unicity violation");
          status = 208; // Already reported https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#4xx_client_errors
          res.status(status).json({
            status: status,
            message: "name unicity violation",
            shelf: req.body
          });
        } else {
          // Create
          delete req.body._id;
          const shelf = new Shelf({ ...req.body });
          shelf
            .save()
            .then(() => {
              console.log("shelf created");
              status = 201;
              res.status(status).json({
                status: status,
                message: "shelf created",
                id: shelf._id
              });
            })
            .catch((error) => {
              console.log("error on create");
              status = 400; // OK
              res.status(status).json({
                status: status,
                message: "error on create",
                error: error,
                shelf: req.body
              });
            });
        }
      })
      .catch((error) => {
        status = 400;
        res.status(status).json({
          status: status,
          message: "error on find for name violation check",
          shelf: req.body,
          error: error
        });
        console.error(error);
      });
  } else {
    // Modify
    console.log("shelf to modify");
    console.log(req.body);

    let shelf = new Shelf({ ...req.body });
    Shelf.updateOne({ _id: shelf._id }, shelf)
      .then(() => {
        console.log("shelf modified");
        status = 200;
        res.status(status).json({
          status: status,
          message: "shelf modified",
          id: req.body.id
        });
      })
      .catch((error) => {
        console.log("error on modified");
        status = 400; // OK
        res.status(status).json({
          status: status,
          message: "error on modify",
          error: error,
          shelf: req.body
        });
        console.error(error);
      });
  }
};
exports.deleteShelf = (req, res, next) => {
  console.log("shelf.deleteShelf");
  // Initialize
  var status = 500;
  Shelf.deleteOne({ _id: req.params.id })
    .then(() => {
      status = 200;
      res.status(status).json({
        status: status,
        message: "shelf deleted"
      });
    })
    .catch((error) => {
      status = 400;
      res.status(status).json({
        status: status,
        message: "error on find",
        error: error,
        shelf: req.body
      });
      console.error(error);
    });
};
