var mongoose = require("mongoose");
const user = mongoose.Schema(
  {
    userName: {
      type: String
    },
    userEmail: {
      type: String
    },
    restid: {
      type: String
    },
    userPassword: {
      type: String
    },
    userPhone: {
      type: Number
    },
    userAddress: {
      type: String
    },
    userZip: {
      type: String
    },
    accountType: {
      type: String
    },
    userImage: {
      type: String
    },
    cart: [
      {
        itemName: {
          type: String
        },
        itemPrice: {
          type: String
        },
        itemImage: {
          type: String
        },
        itemQuantity: {
          type: Number
        },
        itemTotal: {
          type: Number
        },
        restId: {
          type: Number
        },
        itemId: {
          type: Number
        }
      }
    ],
    orders: [
      {
        orderId: {
          type: Number
        },
        restId: {
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
  },
  {
    collection: "userdets"
  }
);
var userdet = mongoose.model("userdets", user);
module.exports = { userdet };
