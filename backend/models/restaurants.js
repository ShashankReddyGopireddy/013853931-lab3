var mongoose = require("mongoose");
var restaurantdet = mongoose.Schema;
var restaurant = new restaurantdet({
  restid: {
    type: String
  },
  userId: {
    type: String
  },
  userEmail: {
    type: String
  },
  restName: {
    type: String
  },
  restAddress: {
    type: String
  },
  restZip: {
    type: String
  },
  restPhone: {
    type: String
  },
  restDesc: {
    type: String
  },
  restImage: {
    type: String
  },
  orders: [
    {
      orderId: {
        type: Number
      },
      itemId: {
        type: Number
      },
      itemName: {
        type: String
      },
      itemQuantity: {
        type: String
      },
      itemPrice: {
        type: Number
      },
      itemTotal: {
        type: Number
      },
      orderStatus: {
        type: String
      },
      Date: {
        type: String
      }
    }
  ]
});
var restaurantdet = mongoose.model("restaurantdetails", restaurant);
module.exports = { restaurantdet };
