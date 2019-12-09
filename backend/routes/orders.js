const express = require("express");
const pool = require("../configFiles/connectionPooling");
var mysql = require("mysql");
const app = express.Router();
var { mongoose } = require("../config/mongodb");
var { restaurantdet } = require("../models/restaurants");
const { userdet } = require("../models/users");
var { menuitems } = require("../models/items");

//OwnerALLORDERS
app.post("/all-orders", (req, res) => {
  console.log("Inside all orders");
  if (req.body.userEmail) {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log("Error while creating connection");
        res.writeHead(500, {
          "Content-type": "text/plain"
        });
        res.end("Error while creating connection");
      } else {
        const sql1 =
          "SELECT r.restId from restaurants r, users u WHERE u.userId = r.userId and u.userEmail = " +
          mysql.escape(req.body.userEmail) +
          "and u.accountType = " +
          2;
        console.log("sql1---" + sql1);
        conn.query(sql1, (err, result1) => {
          if (err) {
            console.log("Error in retrieving Restaurant Id");
            res.writeHead(400, {
              "Content-type": "text/plain"
            });
            res.end("Error in retrieving Restaurant Id");
          } else {
            const sql2 =
              "SELECT o.*, u.userAddress, u.userName from orders o, users u where o.userEmail = u.userEmail and o.restId = " +
              mysql.escape(result1[0].restId);
            conn.query(sql2, (err, result2) => {
              if (err) {
                console.log(err);
                res.writeHead(400, {
                  "Content-type": "text/plain"
                });
                res.end("Error in displaying all orders");
              } else {
                res.writeHead(200, {
                  "Content-type": "application/json"
                });
                console.log("Displayed all orders");
                console.log(result2);

                var lookUp = {};
                var uniqueOrders = [];
                for (var item, j = 0; (item = result2[j++]); ) {
                  var orderIdTemp = item.orderId;

                  if (!(orderIdTemp in lookUp)) {
                    lookUp[orderIdTemp] = 1;
                    uniqueOrders.push(orderIdTemp);
                  }
                }
                console.log(uniqueOrders);

                var finalOrders = [];
                var temp = [];
                for (var k = 0; k < uniqueOrders.length; k++) {
                  for (var l = 0; l < result2.length; l++) {
                    if (uniqueOrders[k] === result2[l].orderId) {
                      temp.push(result2[l]);
                    }
                  }
                  if (!temp.length == 0) {
                    finalOrders.push({
                      orderId: uniqueOrders[k],
                      userOrder: temp
                    });
                    temp = [];
                  }
                }
                console.log(JSON.stringify(finalOrders));
                res.end(JSON.stringify(finalOrders));
              }
            });
          }
        });
      }
    });
  }
});

app.post("/orderItems", (req, res) => {
  console.log("inorders");

  console.log(req.body);
  userdet.find(
    { userEmail: req.body.userEmail },

    function(err, result) {
      console.log("my name is khan", result[0].cart);
      if (err) {
        console.log("easpapaapapa");
      } else {
        var ord = result[0].cart;
        for (var i = 0; i < ord.length; i++) {
          userdet.update(
            { userEmail: req.body.userEmail },
            {
              $push: {
                orders: {
                  itemName: result[0].cart[i].itemName,
                  itemQuantity: result[0].cart[i].itemQuantity,
                  itemPrice: result[0].cart[i].itemPrice,
                  itemTotal: result[0].cart[i].itemTotal,
                  orderStatus: "New",
                  restId: result[0].cart[i].restId
                }
              }
            },
            function(err, result1) {
              console.log("cmg da output come amma", result1);
              if (err) {
                console.log("errfdggggggf");
              } else {
                console.log("items placed successfully");
                userdet.updateOne(
                  { userEmail: req.body.userEmail },
                  {
                    $pull: { cart: {} }
                  },
                  function(err, result2) {
                    console.log("delted cart items", result2);
                    if (err) {
                      console.log("errrr retry again");
                    } else {
                      res.status(200).end("Order placed");
                    }
                  }
                );
              }
            }
          );
        }
      }
    }
  );
});

//postOrder
// app.post('/orderItems', (req, res) => {
//   console.log("In orderItems");
//   console.log(req);
//   var max = 0;
//   if (req.body.userEmail) {
//     pool.getConnection((err, conn) => {
//       if (err) {
//         console.log(err);
//         res.status(500).end("Error while connecting to database");
//       } else {
//         //query
//         const sql = `SELECT max(orderId) as max from orders`;
//         console.log(sql);

//         conn.query(sql, (err, result) => {
//           if (err) {
//             res.status(500).end("Cant get orders details");
//           } else {
//             console.log(result);
//             max = result[0].max;

//             const sql1 = `SELECT * FROM cart WHERE userEmail= ${mysql.escape(req.body.userEmail)}`;

//             console.log(sql1);
//             conn.query(sql1, (err, result) => {
//               if (err) {
//                 res.status(500).end("Cant get cart details");
//               } else {
//                 for (var i = 0; i < result.length; i++) {
//                   const sql1 = `INSERT INTO orders (orderId,restId,userEmail, itemId, itemName,
//                                         itemQuantity, itemPrice, itemTotal, orderStatus, Date) VALUES
//                                         (${max + 1}, ${result[i].restId}, ${mysql.escape(result[i].userEmail)},
//                                         ${result[i].itemId}, ${mysql.escape(result[i].itemName)}, ${result[i].itemQuantity},
//                                         ${result[i].itemPrice}, ${result[i].itemTotal}, "New", ${mysql.escape(new Date())})`;

//                   console.log(sql1);
//                   conn.query(sql1, (err, result) => {
//                     if (err) {
//                       console.log(err);
//                       res.status(400).end("Please try again to order items");
//                     } else {
//                       console.log(result);
//                       const sql2 = `DELETE FROM cart WHERE userEmail=${mysql.escape(req.body.userEmail)}`;
//                       console.log(sql2);
//                       conn.query(sql2, (err, result) => {
//                         if (err) {
//                           console.log(err);
//                           res.status(400).end("Please try again to order items");
//                         } else {
//                           res.status(200).end("Order placed");
//                         }
//                       });
//                     }
//                   });
//                 }
//               }
//             });
//           }
//         });
//       }
//     });
//   }
// });

// getpreviousorders
app.post("/previousOrders", (req, res) => {
  console.log("Inside upcoming orders");
  userdet.find(
    {
      userEmail: req.body.userEmail
    },
    function(err, result) {
      if (err) {
        console.log("errrr");
      } else {
        // console.log("sfdgfdfsgdgrgffdg", result[0].orders);
        let uniqueOrders = [];
        let prev = result[0].orders[0].restId;
        console.log(result[0].orders[0].restId);
        let item = [];
        let temp = 0;
        for (let i = 0; i < result[0].orders.length; i++) {
          if (result[0].orders[i].orderStatus != "New") {
            // res.end(JSON.stringify(result[0].orders));
            if (result[0].orders[i].restId == prev) {
              temp = 1;
              item.push({
                _id: result[0].orders[i]._id,
                itemName: result[0].orders[i].itemName,
                itemQuantity: result[0].orders[i].itemQuantity,
                itemTotal: result[0].orders[i].itemTotal
              });
              // console.log("items", item);
            } else {
              temp = 0;
              uniqueOrders.push({
                items: item,
                restId: result[0].orders[i].restId,
                orderStatus: "Old"
              });

              item = [
                {
                  _id: result[0].orders[i]._id,
                  itemName: result[0].orders[i].itemName,
                  itemQuantity: result[0].orders[i].itemQuantity,
                  itemTotal: result[0].orders[i].itemTotal
                }
              ];
            }

            console.log("status", result[0].orders[i].orderStatus);

            // console.log("retrived upcoming orders", result[0].orders);
          }

          if (i == result[0].orders.length - 1) {
            if (temp == 1) {
              uniqueOrders.push({
                items: item,
                restId: result[0].orders[i].restId,
                orderStatus: "Old"
              });
            }
            // console.log("upcoming orders", uniqueOrders);
            res.writeHead(200, {
              "Content-type": "application/json"
            });
            res.end(JSON.stringify(uniqueOrders));
          }
          prev = result[0].orders[i].restId;
        }
      }
    }
  );
});

//ManageOrders
app.put("/manage-orders", (req, res) => {
  console.log("Inside Manage orders");
  if (req.body.userEmail) {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log("Error while creating connection");
        res.writeHead(500, {
          "Content-type": "text/plain"
        });
        res.end("Error while creating connection");
      } else {
        const sql1 =
          "UPDATE orders set orderStatus = " +
          mysql.escape(req.body.orderStatus) +
          "WHERE orderId = " +
          mysql.escape(req.body.orderId);

        conn.query(sql1, (err, result1) => {
          if (err) {
            console.log("Error in manage orders");
            res.writeHead(400, {
              "Content-type": "text/plain"
            });
            res.end("Error in manage orders");
          } else {
            res.writeHead(200, {
              "Content-type": "application/json"
            });
            console.log("Orders Managed");
            res.end("Orders Managed");
          }
        });
      }
    });
  }
});

app.post("/upcomingOrders", (req, res) => {
  console.log("Inside upcoming orders");
  userdet.find(
    {
      userEmail: req.body.userEmail
    },
    function(err, result) {
      if (err) {
        console.log("errrr");
      } else {
        // console.log("sfdgfdfsgdgrgffdg", result[0].orders);
        let uniqueOrders = [];
        let prev = result[0].orders[0].restId;
        console.log(result[0].orders[0].restId);
        let item = [];
        let temp = 0;
        for (let i = 0; i < result[0].orders.length; i++) {
          if (result[0].orders[i].orderStatus == "New") {
            // res.end(JSON.stringify(result[0].orders));
            if (result[0].orders[i].restId == prev) {
              temp = 1;
              item.push({
                _id: result[0].orders[i]._id,
                itemName: result[0].orders[i].itemName,
                itemQuantity: result[0].orders[i].itemQuantity,
                itemTotal: result[0].orders[i].itemTotal
              });
              // console.log("items", item);
            } else {
              temp = 0;
              uniqueOrders.push({
                items: item,
                restId: result[0].orders[i].restId,
                orderStatus: result[0].orders[i].orderStatus
              });

              item = [
                {
                  _id: result[0].orders[i]._id,
                  itemName: result[0].orders[i].itemName,
                  itemQuantity: result[0].orders[i].itemQuantity,
                  itemTotal: result[0].orders[i].itemTotal
                }
              ];
            }

            // console.log("status", result[0].orders[i].orderStatus);

            // console.log("retrived upcoming orders", result[0].orders);
          }

          if (i == result[0].orders.length - 1) {
            if (temp == 1) {
              uniqueOrders.push({
                items: item,
                restId: result[0].orders[i].restId,
                orderStatus: result[0].orders[i].orderStatus
              });
            }
            // console.log("upcoming orders", uniqueOrders);
            res.writeHead(200, {
              "Content-type": "application/json"
            });
            res.end(JSON.stringify(uniqueOrders));
          }
          prev = result[0].orders[i].restId;
        }
      }
    }
  );
});

//upcomingOrders
// app.post("/upcomingOrders", (req, res) => {
//   console.log("Inside upcoming orders");
//   if (req.body.userEmail) {
//     pool.getConnection((err, conn) => {
//       if (err) {
//         console.log("Error while creating connection");
//         res.writeHead(500, {
//           "Content-type": "text/plain"
//         });
//         res.end("Error while creating connection");
//       } else {
//         const sql1 = `SELECT o.restId from orders o, users u WHERE u.userEmail = o.userEmail and u.userEmail = ${mysql.escape(
//           req.body.userEmail
//         )}
//             AND u.accountType = 1`;
//         console.log(sql1);

//         conn.query(sql1, (err, result1) => {
//           if (err) {
//             console.log("Error in getting restaurant id");
//             res.writeHead(400, {
//               "Content-type": "text/plain"
//             });
//             res.end("Error in getting restaurant id");
//           } else {
//             console.log(result1);
//             const sql2 = `SELECT * FROM orders where orderStatus NOT IN ('cancelled','delivered') and restId IN (SELECT o.restId from orders o, users u WHERE u.userEmail = o.userEmail and u.userEmail = ${mysql.escape(
//               req.body.userEmail
//             )}
//                         AND u.accountType = 1) and userEmail = ${mysql.escape(
//                           req.body.userEmail
//                         )} order by orderId DESC`;
//             conn.query(sql2, (err, result2) => {
//               if (err) {
//                 console.log("Error in getting upcoming orders");
//                 res.writeHead(400, {
//                   "Content-type": "text/plain"
//                 });
//                 res.end("Error in getting upcoming orders");
//               } else {
//                 console.log("sql2", sql2);
//                 res.writeHead(200, {
//                   "Content-type": "application/json"
//                 });
//                 console.log("retrived upcoming orders", result2);

//                 let lookUp = {};
//                 let uniqueOrders = [];
//                 for (let item, j = 0; (item = result2[j++]); ) {
//                   let orderIdTemp = item.orderId;

//                   if (!(orderIdTemp in lookUp)) {
//                     lookUp[orderIdTemp] = 1;
//                     uniqueOrders.push(orderIdTemp);
//                   }
//                 }
//                 console.log(uniqueOrders);

//                 let finalOrders = [];
//                 let temp = [];
//                 for (let k = 0; k < uniqueOrders.length; k++) {
//                   for (let l = 0; l < result2.length; l++) {
//                     if (uniqueOrders[k] === result2[l].orderId) {
//                       temp.push(result2[l]);
//                     }
//                   }
//                   if (!temp.length == 0) {
//                     finalOrders.push({
//                       orderId: uniqueOrders[k],
//                       userOrder: temp
//                     });
//                     temp = [];
//                   }
//                 }
//                 console.log(JSON.stringify(finalOrders));
//                 res.end(JSON.stringify(finalOrders));
//               }
//             });
//           }
//         });
//       }
//     });
//   }
// });

module.exports = app;
