var mongoose = require("mongoose");
var menuitems = mongoose.Schema;
var item = new menuitems({
  itemName: {
    type: String
  },
  itemType: {
    type: String
  },
  itemDesc: {
    type: String
  },

  itemImage: {
    type: String
  },
  itemPrice: {
    type: Number
  },
  cuisineName: {
    type: String
  },
  restId: {
    type: String
  },
  cuisineId: {
    type: String
  },
  section: {
    type: String
  }
});
var menuitems = mongoose.model("itemdet", item);
module.exports = { menuitems };
