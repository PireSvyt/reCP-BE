require("dotenv").config();
const Shopping = require("../../models/Shopping.js");

module.exports = shoppingDone = (req, res, next) => {
  /*
  
  update shoppings toggling the done and managing available vs needs
  
  possible response types
  * shopping.done.success
  * shopping.done.error
  
  */

  if (process.env.DEBUG) {
    console.log("shopping.done");
  }

  // Update
  Shopping.find(
	  { 
	    shoppingid: { $in: req.body.shoppingids },
	    communityid: req.augmented.user.communityid
	  },
	  "shoppingid name shelfid unit need available done prices"
  )
  .then((shoppings) => {

    console.log("shoppings",shoppings)
  
	  // Changes
    let bulkShoppings = []	  
    shoppings.forEach(shopping => {
	    let newShopping = {...shopping}
	    newShopping.done = !newShopping.done
	    if (newShopping.done) {
		    if (newShopping.need !== undefined) {
			    newShopping.available = newShopping.need
		    }
	    } else {
			    newShopping.available = 0		    
	    }
	    bulkShoppings.push({
		    updateOne: {
		      filter: { shoppingid: shopping.shoppingid },
		      update: newShopping
		    }
		  })
      console.log("bulkShoppings.update",newShopping)
    })

    
    // Update
    Shopping.bulkWrite(bulkShoppings)
    .then(outcome => {
      console.log("outcome", outcome)
	    if (outcome.modifiedCount === bulkShoppings.length) {
        return res.status(201).json({
          type: "shopping.done.success",
          data: {
            outcome: outcome,
            shoppings: shoppings,
          },
        });
	    } else {
        return res.status(202).json({
          type: "shopping.done.partial",
          data: {
            outcome: outcome,
            shoppings: shoppings,
          },
        });		    
	    }
    })
    .catch((error) => {
      console.log("shopping.done.bulkwrite");
      console.error(error);
      return res.status(400).json({
        type: "shopping.done.bulkwrite",
        error: error,
        data: {
          outcome: null,
        },
      });
    });
  })
  .catch((error) => {
    console.log("shopping.done.error");
    console.error(error);
    return res.status(400).json({
      type: "shopping.done.error",
      error: error,
      data: {
        outcome: null,
      },
    });
  });
};