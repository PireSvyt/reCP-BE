require("dotenv").config();
const Address = require("../../models/Address.js");

module.exports = addressGetList = (req, res, next) => {
  /*

	sends back the list of addresses

	possible response types

	- address.getlist.success
	- address.getlist.error.onfind

	inputs

	- need : list
	- addresses
	- - number (for list need only)
	- - lastid (optional)
	- filters (optional)
	- - text
	- - tags

	*/

  if (process.env.DEBUG) {
    console.log("address.getlist");
  }

  // Initialize
  var status = 500;
  var type = "address.getlist.error";
  var fields = "";
  var matches = { communityid: req.augmented.user.communityid };

  // Is need input relevant?
  if (!req.body.need) {
    status = 403;
    type = "address.getlist.error.noneed";
  } else {
    switch (req.body.need) {
      case "list":
        fields = "addressid name description address location website tagids";
        break;
      default:
        type = "address.getlist.error.needmissmatch";
    }
  }

  // Setting up filters
  if (req.body.filters !== undefined) {
    if (req.body.filters.text !== undefined) {
      matches.name = new RegExp(req.body.filters.text, "i");
    }
    if (req.body.filters.tags !== undefined) {
      matches["tagids.tagid"] = { $in: [...req.body.filters.tags] };
    }
  }

  // Is need well captured?
  if (status === 403) {
    res.status(status).json({
      type: type,
    });
  } else {
    Address.find(matches, fields)
      .then((addresss) => {
        // Repackaging
        let addresssToSend = [...addresss];
        let action;
        let more;

        // Map address from _doc and sort
        addresssToSend = addresssToSend
          .map((address) => {
            return address._doc;
          })
          .sort((a, b) => {
            return a.name.localeCompare(b.name);
          });

        // Are addresss already loaded
        let lastidpos = 0;
        if (req.body.addresss.lastid !== undefined) {
          // Find last address loaded
          lastidpos = addresssToSend.findIndex((address) => {
            return address.addressid === req.body.addresss.lastid;
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
        addresssToSend = addresssToSend.slice(
          lastidpos, // from N, ex. 0
          lastidpos + req.body.addresss.number + 1 // to N+M, ex. 0+10
        );

        // transaddresss [ N ... N+M ] length = M+1, ex. 0-10 -> 11 transaddresss
        more = addresssToSend.length > req.body.addresss.number;
        // Shorten to desired length
        if (more === true) {
          addresssToSend.pop();
        }

        // Response
        return res.status(200).json({
          type: "address.getlist.success",
          data: {
            addresss: addresssToSend,
            more: more,
            action: action,
          },
        });
      })
      .catch((error) => {
        console.log("address.getlist.error.onfind");
        console.error(error);
        return res.status(400).json({
          type: "address.getlist.error.onfind",
          error: error,
        });
      });
  }
};
