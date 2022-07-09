const Shop = require("../models/Shop");

exports.createShop = (req, res, next) => {
  console.log("shop.createShop");
  delete req.body._id;
  const shop = new Shop({ ...req.body });
  shop
    .save()
    .then(() => {
      res.status(201).json({
        message: "ingrédient enregistré",
        id: shop._id
      });
    })
    .catch((error) => res.status(400).json({ error }));
};
exports.modifyShop = (req, res, next) => {
  console.log("shop.modifyShop");
  Shop.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "shop modifié" }))
    .catch((error) => res.status(400).json({ error }));
};
exports.findOneShop = (req, res, next) => {
  console.log("shop.findOneShop");
  Shop.findOne({ _id: req.params.id })
    .then((shop) => res.status(200).json(shop))
    .catch((error) => res.status(404).json({ message: "shop introuvable" }));
};
exports.findShops = (req, res, next) => {
  console.log("shop.findShops");
  Shop.find()
    .then((shops) => res.status(200).json(shops))
    .catch((error) => res.status(400).json({ error }));
};

// LEVERAGED
exports.getShopItem = (req, res, next) => {
  console.log("shop.getShopItem");
  // Initialize
  var status = 500;

  Shop.findOne({ _id: req.params.id })
    .then((shop) => {
      status = 200; // OK
      res.status(status).json({
        status: status,
        message: "shop ok",
        shop: shop
      });
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on find",
        shop: {},
        error: error
      });
      console.error(error);
    });
};
exports.getShopList = (req, res, next) => {
  console.log("shop.getShopList");
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
      case "shops":
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
      shops: []
    });
  } else {
    // Find
    //https://mongoosejs.com/docs/api.html#model_Model.find
    // executes, name LIKE john and only selecting the "name" and "friends" fields
    // await MyModel.find({ name: /john/i }, 'name friends').exec();
    /*
    Shop.find(filters, fields)
      .$where(where)
      .exec()
      .then((shops) => {
        status = 200; // OK
        res.status(status).json(shops);
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
    Shop.find(filters, fields)
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

    Shop.find(filters, fields)
      .where(where)
      .then((shops) => {
        // Sort
        shops.sort(compare);

        status = 200; // OK
        res.status(status).json({
          status: status,
          message: "list ok",
          shops: shops
        });
      })
      .catch((error) => {
        status = 400;
        res.status(status).json({
          status: status,
          message: "error on find",
          shops: [],
          error: error
        });
        console.error(error);
      });
  }
};
exports.saveShop = (req, res, next) => {
  console.log("shop.saveShop");
  // Initialize
  var status = 500;
  console.log(req.body);
  // Name violation check
  if (req.body._id === "" || req.body._id === undefined) {
    console.log("shop to create");
    let filters = { name: req.body.name };
    Shop.find(filters)
      .then((shops) => {
        if (shops.length > 0) {
          // Name already exists
          console.log("name unicity violation");
          status = 208; // Already reported https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#4xx_client_errors
          res.status(status).json({
            status: status,
            message: "name unicity violation",
            shop: req.body
          });
        } else {
          // Create
          delete req.body._id;
          const shop = new Shop({ ...req.body });
          shop
            .save()
            .then(() => {
              console.log("shop created");
              status = 201;
              res.status(status).json({
                status: status,
                message: "shop created",
                id: shop._id
              });
            })
            .catch((error) => {
              console.log("error on create");
              status = 400; // OK
              res.status(status).json({
                status: status,
                message: "error on create",
                error: error,
                shop: req.body
              });
            });
        }
      })
      .catch((error) => {
        status = 400;
        res.status(status).json({
          status: status,
          message: "error on find for name violation check",
          shop: req.body,
          error: error
        });
        console.error(error);
      });
  } else {
    // Modify
    console.log("shop to modify");
    console.log(req.body);

    let shop = new Shop({ ...req.body });
    Shop.updateOne({ _id: shop._id }, shop)
      .then(() => {
        console.log("shop modified");
        status = 200;
        res.status(status).json({
          status: status,
          message: "shop modified",
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
          shop: req.body
        });
        console.error(error);
      });
  }
};
exports.deleteShop = (req, res, next) => {
  console.log("shop.deleteShop");
  // Initialize
  var status = 500;
  Shop.deleteOne({ _id: req.params.id })
    .then(() => {
      status = 200;
      res.status(status).json({
        status: status,
        message: "shop deleted"
      });
    })
    .catch((error) => {
      status = 400;
      res.status(status).json({
        status: status,
        message: "error on find",
        error: error,
        shop: req.body
      });
      console.error(error);
    });
};
