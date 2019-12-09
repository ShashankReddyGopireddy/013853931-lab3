const express = require("express");
const pool = require("../configFiles/connectionPooling");
var mysql = require("mysql");
const app = express.Router();
var { mongoose } = require("../config/mongodb");
var { restaurantdet } = require("../models/restaurants");
const { userdet } = require("../models/users");
var { menuitems } = require("../models/items");

//AllRestaurants;
app.get("/allrestaurants", (req, res) => {
  console.log("In allrestaurants GET");
  // const OLogin = require("../models/users");

  //query
  restaurantdet.find({}, function(err, result) {
    if (err) {
      res.writeHead(400, {
        "Content-type": "text/plain"
      });
      res.end("Couldnt get cuisine names");
    } else {
      if (result.length == 0) {
        res.writeHead(401, {
          "Content-type": "text/plain"
        });
        res.end("Sorry, No restaurants found");
      } else {
        res.writeHead(200, {
          "Content-type": "application/json"
        });
        res.end(JSON.stringify(result));
      }
    }
  });
});
// });
// }
// });

// pool.getConnection((err, conn) => {
//   if (err) {
//     console.log("Error while connecting to database");
//     res.writeHead(500, {
//       'Content-type': 'text/plain'
//     });
//     res.end("Error while connecting to database");
//   } else {
//     //query
//     const sql = `SELECT * FROM restaurants`;

//     conn.query(sql, (err, result) => {
//       if (err) {
//         res.writeHead(400, {
//           'Content-type': 'text/plain'
//         });
//         res.end("Couldnt get cuisine names");
//       } else {
//         if (result.length == 0) {
//           res.writeHead(401, {
//             'Content-type': 'text/plain'
//           });
//           res.end("Sorry, No restaurants found");
//         } else {
//           res.writeHead(200, {
//             'Content-type': 'application/json'
//           });
//           res.end(JSON.stringify(result));
//         }
//       }
//     });
//   }
// });
// restaurantsbyItemName
//restaurentsbyItemName
app.post("/restaurantsbyItemName", async (req, res) => {
  console.log("in restaurantbyitemname", req.body);
  var nam = req.body.itemName;
  var res2 = [];
  return await menuitems
    .find({
      itemName: req.body.itemName
    })
    // .select(["rest", "restId"])
    .then(async result => {
      await result.map(async (restids, index) => {
        console.log("ids", restids);
        await restaurantdet.find({ restid: restids.restId }, function(
          err,
          res1
        ) {
          // console.log(err);
          if (res1) {
            console.log("result resname", res1);

            res2.push({
              cuisineName: restids.cuisineName,
              restId: restids.restId,
              restName: res1[0].restName
            });
          }
        });
        if (index == result.length - 1) {
          console.log("ressssssssssss2", res2);
          return res.end(JSON.stringify(res2));
        }
      });
    })
    .catch(err => {
      console.log("err in retrieving", err);

      return res.status(410).end("err in retrieving name", err);
    });
});
// userEmail: req.body.userEmail,
// itemName: req.body.itemName
//     },
//     function(err, result) {
//       if (err) {
//         console.log("");
//       } else {
//         console.log(result);
//         restaurantdet.find(
//           {
//             // restId: req.body.restId
//             // restName: "restId"
//           },
//           function(err, result) {
//             if (err) {
//               console.log("error");
//             } else {
//               console.log(result);
//             }
//           }
//         );
//       }
//     }
//   );
// });
// app.post("/restaurantsbyItemName", (req, res) => {
//   console.log("In restaurantsbyItemName");
//   console.log(req.body);
//   itemName = req.body.itemName.toLowerCase();
//   // console.log("search Value", itemName);
//   userdet.find(
//     {
//       userEmail: req.body.userEmail,
//       itemName: req.body.itemName
//     },
//     function(err, result) {
//       //if (req.body.userEmail) {
//       if (err) {
//         console.log("Error while connecting to database");
//         res.writeHead(500, {
//           "Content-type": "text/plain"
//         });
//         res.end("Error while connecting to database");
//       } else {
//         //query
//         menuitems.find({}, function(err, result) {
//           if (err) {
//             console.log(err);
//             res.writeHead(400, {
//               "Content-type": "application/json"
//             });
//             res.end("Error in Search content Module");
//           } else {
//             console.log(result);
//             result.filter(new_item => {
//               var this_item = new_item.item.toLowerCase();
//               if (this_item.indexOf(itemName) > -1) {
//                 ownerLogin_result.push(new_itemName);
//                 console.log(ownerLogin_result);
//               }
//             });
//           }
//         });
//       }
//     }
//   );
// });
//restaurentsbyItemName & cuisineName
app.post("/restaurantsbyItemCuisine", (req, res) => {
  console.log("restaurantsbyItemCuisine");
  console.log(req.body);
  console.log(req.body);

  if (req.body.userEmail) {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log("Error while connecting to database");
        res.writeHead(500, {
          "Content-type": "text/plain"
        });
        res.end("Error while connecting to database");
      } else {
        //query
        const sql = `SELECT DISTINCT r.restName, r.restId, r.restImage, r.restDesc, r.restAddress,
                        i.cuisineId,  i.cuisineName FROM restaurants r, items i
                    WHERE r.restId= i.restId AND i.cuisineName = ${mysql.escape(
                      req.body.cuisineName
                    )} AND 
                     i.itemName LIKE '%${req.body.itemName + "%'"}`;
        // const sql = `SELECT DISTINCT r.restName FROM restaurants r, items i WHERE r.restId=i.restId
        //     AND i.cuisineName = ${mysql.escape(req.body.cuisineName)} AND
        //     AND i.cuisineName = ${mysql.escape(req.body.cuisineName)} AND
        //     AND i.cuisineName = ${mysql.escape(req.body.cuisineName)} AND
        //     i.itemName LIKE '%${req.body.itemName + "%'"}`;
        console.log(sql);
        conn.query(sql, (err, result) => {
          if (err) {
            res.writeHead(400, {
              "Content-type": "text/plain"
            });
            res.end("Invalid ItemName or cuisine name");
          } else {
            if (result.length == 0) {
              res.writeHead(401, {
                "Content-type": "text/plain"
              });
              res.end(
                "Sorry, No restaurants found with given item and cuisine"
              );
            } else {
              res.writeHead(200, {
                "Content-type": "application/json"
              });
              console.log("restaurants found");

              res.end(JSON.stringify(result));
            }
          }
        });
      }
    });
  }
});
// Get Items by restaurant
app.post("/itemsByRestaurant", async (req, res) => {
  console.log("in items by restaurant");
  console.log("req.body.restId", req.body.restId);
  console.log("req.body.userEmail", req.body.userEmail);
  return await menuitems
    .find({
      restId: req.body.restId
    })
    // .select(["itemName", "_id"])
    .then(result => {
      console.log("result", result);
      return res.end(JSON.stringify(result));
    })
    .catch(err => {
      console.log("error in getting restaurant");
      return res.status(410).end("error in getting rest");
    });
});

//Get items by restaurant
// app.post("/itemsByRestaurant", (req, res) => {
//   console.log("In itemsByRestaurant");
//   console.log(req.body.restId);
//   console.log(req.body.userEmail);

//   if (req.body.userEmail) {
//     functionn((err, conn) => {
//       if (err) {
//         console.log("Error while connecting to database");
//         res.writeHead(500, {
//           "Content-type": "text/plain"
//         });
//         res.end("Error while connecting to database");
//       } else {
//         //query
//         ownerLogin.aaggregate([
//           {
//             $lookup: {
//               from: "Items",
//               pipeline: [
//                 {
//                   $match: { restId: req.body.restId }
//                 },
//                 { $project: { restName: "restName", itemName: "itemName" } }
//               ],
//               as: "Items"
//             }
//           },
//           function(err, result) {
//             if (err) {
//               console.log(err);
//               res.writeHead(400, {
//                 "Content-type": "text/plain"
//               });
//               res.end("Couldnt get cuisine names");
//             } else {
//               console.log(result);
//               res.writeHead(200, {
//                 "Content-type": "text/plain"
//               });
//               res.end(JSON.stringify(result));
//             }
//           }
//         ]);
//       }
//     });
//   }
// });

// const sql = `SELECT i.*, r.* FROM items i, restaurants r
// WHERE r.restId = i.restId AND r.restId = ${mysql.escape(
//   req.body.restId
// )};`;
// console.log(sql);
// conn.query(sql, (err, result) => {
// if (err) {
// console.log(err);
// res.writeHead(400, {
// "Content-type": "text/plain"
// });
// res.end("Couldnt get cuisine names");
// } else {
// console.log(result);
// res.writeHead(200, {
// "Content-type": "text/plain"
// });
// res.end(JSON.stringify(result));
// }
// });
// }
// });
// }
// });

//put restaurant details
app.put("/updaterestdetails", (req, res) => {
  console.log("Inside update restaurant");

  userdet.findOne(
    {
      // userId: req.body.userId,
      userEmail: req.body.userEmail
    },
    function(err, result) {
      // console.log("---" + result1);
      if (err) {
        console.log("Error in fetching User Id");
        console.log(err);
      } else {
        console.log("User Id fetched");

        console.log(result);
        restaurantdet.update(
          {
            restName: req.body.restName,
            restAddress: req.body.restAddress,
            restDesc: req.body.restDesc,
            restId: req.body.restId,
            restPhone: req.body.restPhone,
            restZip: req.body.restZip,
            restImage: req.body.restImage,
            userId: req.body.userId
          },
          function(err, result2) {
            console.log("------" + result2);
            if (err) {
              console.log("Error in updating restaurant details");
              console.log(err);
              res.writeHead(400, {
                "Content-type": "text/plain"
              });
              console.log("err-----" + err);
              res.end("Error in updating profile data");
            } else {
              console.log("restaurant details update complete!");
              res.writeHead(200, {
                "Content-type": "text/plain"
              });
              res.end("restaurant details update complete!");
            }
          }
        );
      }
    }
  );
});

// const sql1 =
//           "SELECT userId from users WHERE userEmail = " +
//           mysql.escape(req.body.userEmail);
//         console.log("sql1---" + sql1);
//         conn.query(sql1, (err, result1) => {
//           if (err) {
//             console.log("Error in fetching User Id");
//             console.log(err);
//           } else {
//             console.log("User Id fetched");

//             console.log(result1[0]);

//             var sql2 =
//               "UPDATE restaurants SET " +
//               "restName = " +
//               mysql.escape(req.body.restName) +
//               "," +
//               "restAddress = " +
//               mysql.escape(req.body.restAddress) +
//               "," +
//               "restDesc = " +
//               mysql.escape(req.body.restDesc) +
//               "," +
//               "restZip = " +
//               mysql.escape(req.body.restZip) +
//               "," +
//               "restImage =" +
//               mysql.escape(req.body.restImage) +
//               "," +
//               "restPhone = " +
//               mysql.escape(req.body.restPhone) +
//               " WHERE userId = " +
//               result1[0].userId;
//             console.log("sql2------" + sql2);

//             conn.query(sql2, function(err, result2) {
//               if (err) {
//                 console.log("Error in updating restaurant details");
//                 console.log(err);
//                 res.writeHead(400, {
//                   "Content-type": "text/plain"
//                 });
//                 console.log("err-----" + err);
//                 res.end("Error in updating profile data");
//               } else {
//                 console.log("restaurant details update complete!");
//                 res.writeHead(200, {
//                   "Content-type": "text/plain"
//                 });
//                 res.end("restaurant details update complete!");
//               }
//             });
//           }
//         });
//       }
//     });
//   }
// });

//AllCuisines
app.get("/getCuisines/:cuisineName", (req, res) => {
  console.log("In getCuisines");
  const { cuisineName } = req.params;
  if (req.body.userEmail) {
    functionn((err, conn) => {
      if (err) {
        console.log("Error while connecting to database");
        res.writeHead(500, {
          "Content-type": "text/plain"
        });
        res.end("Error while connecting to database");
      } else {
        //query
        menuitems.distinct({ cuisineName }, function(err, result) {
          if (err) {
            res.writeHead(400, {
              "Content-type": "text/plain"
            });
            res.end("Couldnt get cuisine names");
          } else {
            if (result.length == 0) {
              res.writeHead(401, {
                "Content-type": "text/plain"
              });
              res.end("Sorry, No cuisines found");
            } else {
              res.writeHead(200, {
                "Content-type": "application/json"
              });
              res.end(JSON.stringify(result));
            }
          }
        });
      }
    });
  }
});

// app.get("/getCuisines", (req, res) => {
//   console.log("In getCuisines");

//   if (req.body.userEmail) {
//     pool.getConnection((err, conn) => {
//       if (err) {
//         console.log("Error while connecting to database");
//         res.writeHead(500, {
//           "Content-type": "text/plain"
//         });
//         res.end("Error while connecting to database");
//       } else {
//         //query
//         const sql = `SELECT DISTINCT cuisineName FROM items`;
//         //console.log(sql);
//         conn.query(sql, (err, result) => {
//           if (err) {
//             res.writeHead(400, {
//               "Content-type": "text/plain"
//             });
//             res.end("Couldnt get cuisine names");
//           } else {
//             if (result.length == 0) {
//               res.writeHead(401, {
//                 "Content-type": "text/plain"
//               });
//               res.end("Sorry, No cuisines found");
//             } else {
//               res.writeHead(200, {
//                 "Content-type": "application/json"
//               });
//               res.end(JSON.stringify(result));
//             }
//           }
//         });
//       }
//     });
//   }
// });
app.post("/additem", (req, res) => {
  console.log("inside add items");
  // var { restId } = require("mongodb");
  console.log(req.body);
  restaurantdet.find(
    {
      userEmail: req.body.userEmail
      // restid: localStorage.getItem("restid")
    },
    function(err, result) {
      // console.log("restid", restid);

      if (err) {
        console.log("-----");
      } else {
        // restId = result;
        // console.log("-------", restId);
        menuitems.find(
          // { _id: restId },
          { cuisineName: req.body.cuisineName },

          function(err, result1) {
            if (err) {
              console.log("....");
            } else {
              var userSchema = new menuitems({
                itemName: req.body.itemName,
                itemDesc: req.body.itemDesc,
                itemId: req.body.itemId,
                itemImage: req.body.itemImage,
                itemPrice: req.body.itemPrice,
                cuisineName: req.body.cuisineName,
                itemType: req.body.itemType,
                //cuisineId: req.body.cuisineId
                restId: req.body.restId

                // restId: localStorage.getItem("restid")

                // restId: result1
              });

              userSchema
                .save()
                .then(result1 => {
                  console.log(result1);
                })
                .catch(err => console.log(err));
            }
          }
        );
      }
    }
  );
});
// app.post("/additem", (req, res) => {
//   console.log("Inside add items");
//   var max = 0;
//   var cuisineId = 0;
//   var userSchema = new menuitems({
//     itemName: req.body.itemName,
//     itemDesc: req.body.itemDesc,
//     itemId: req.body.itemId,
//     itemImage: req.body.itemImage,
//     itemPrice: req.body.itemPrice,
//     cuisineName: req.body.cuisineName
//     //cuisineId: req.body.cuisineId
//   });
//   // if (req.body.userEmail) {
//   userdet.find(
//     {
//       userEmail: req.body.userEmail,
//       accountType: 2
//     },
//     function(err, result) {
//       console.log("---------------", result);

//       if (err) {
//         console.log("Error in retrieving Restaurant Id");
//         res.writeHead(400, {
//           "Content-type": "text/plain"
//         });
//         res.end("Error in retrieving Restaurant Id");
//       } else {
//         menuitems.find(
//           { cuisineId },
//           {
//             cuisineName: req.body.cuisineName
//           },
//           function(err, result2) {
//             console.log("------------->", req.body.cuisineName);

//             if (err) {
//               console.log("Error in retrieving cuisine Id");
//               res.writeHead(401, {
//                 "Content-type": "text/plain"
//               });
//               res.end("Error in retrieving cuisine Id");
//             } else {
//               menuitems.find().sort({ cuisineId: -1 }),
//                 function(err, result3) {
//                   if (err) {
//                     console.log("Error in retrieving maximum cuisine Id");
//                     res.writeHead(401, {
//                       "Content-type": "text/plain"
//                     });
//                   } else {
//                     if (result2.length !== 0) {
//                       fianlcuisineId = result2.cuisineId;
//                     } else {
//                       max = result3.max;
//                       fianlcuisineId = max + 1;
//                     }
//                     userSchema
//                       .save()
//                       .then(result3 => {
//                         console.log(result3);
//                       })
//                       .catch(err => console.log(err));

//                     // functionn(err,result4){
//                     if (err) {
//                       if (err.sqlMessage.includes("Duplicate entry")) {
//                         console.log(
//                           "Restaurant with same cuisine already exists"
//                         );
//                         res
//                           .status(402)
//                           .end("Restaurant with same cuisine already exists");
//                       } else {
//                         console.log(err);
//                         res.writeHead(403, {
//                           "Content-type": "text/plain"
//                         });
//                       }
//                       res.end("Error in inserting items");
//                     } else {
//                       res.writeHead(200, {
//                         "Content-type": "application/json"
//                       });
//                       res.end("item successfully inserted");
//                       console.log("Item details Inserted");
//                     }
//                   }
//                 };
//             }
//           }
//         );
//       }
//     }
//   );

//   // }
// });
// app.post("/additem", (req, res) => {
//   console.log("Inside add items");
//   var max = 0;
//   if (req.body.userEmail) {
//     pool.getConnection((err, conn) => {
//       if (err) {
//         console.log("Error while creating connection");
//         res.writeHead(500, {
//           "Content-type": "text/plain"
//         });
//         res.end("Error while creating connection");
//       } else {
//         const sql1 =
//           "SELECT r.restId from restaurants r, users u WHERE u.userId = r.userId and u.userEmail = " +
//           mysql.escape(req.body.userEmail) +
//           "and u.accountType = " +
//           2;
//         console.log("sql1---" + sql1);
//         conn.query(sql1, (err, result1) => {
//           if (err) {
//             console.log("Error in retrieving Restaurant Id");
//             res.writeHead(400, {
//               "Content-type": "text/plain"
//             });
//             res.end("Error in retrieving Restaurant Id");
//           } else {
//             const sql2 =
//               "SELECT cuisineId from items where cuisineName = " +
//               mysql.escape(req.body.cuisineName);
//             conn.query(sql2, (err, result2) => {
//               if (err) {
//                 console.log("Error in retrieving cuisine Id");
//                 res.writeHead(401, {
//                   "Content-type": "text/plain"
//                 });
//                 res.end("Error in retrieving cuisine Id");
//               } else {
//                 sql3 = "SELECT MAX(cuisineId) as max FROM items";
//                 conn.query(sql3, (err, result3) => {
//                   if (err) {
//                     console.log("Error in retrieving maximum cuisine Id");
//                     res.writeHead(401, {
//                       "Content-type": "text/plain"
//                     });
//                     res.end("Error in retrieving maximum cuisine Id");
//                   } else {
//                     if (result2.length !== 0) {
//                       fianlcuisineId = result2[0].cuisineId;
//                     } else {
//                       max = result3[0].max;
//                       fianlcuisineId = max + 1;
//                     }
//                     sql4 =
//                       "Insert INTO items (itemName, itemDesc, itemImage, itemType, itemPrice, cuisineName, restId, cuisineId) VALUES ( " +
//                       mysql.escape(req.body.itemName) +
//                       "," +
//                       mysql.escape(req.body.itemDesc) +
//                       "," +
//                       mysql.escape(req.body.itemImage) +
//                       "," +
//                       mysql.escape(req.body.itemType) +
//                       "," +
//                       mysql.escape(req.body.itemPrice) +
//                       "," +
//                       mysql.escape(req.body.cuisineName) +
//                       "," +
//                       result1[0].restId +
//                       "," +
//                       fianlcuisineId +
//                       ");";
//                     conn.query(sql4, (err, result4) => {
//                       if (err) {
//                         if (err.sqlMessage.includes("Duplicate entry")) {
//                           console.log(
//                             "Restaurant with same cuisine already exists"
//                           );
//                           res
//                             .status(402)
//                             .end("Restaurant with same cuisine already exists");
//                         } else {
//                           console.log(err);
//                           res.writeHead(403, {
//                             "Content-type": "text/plain"
//                           });
//                         }
//                         res.end("Error in inserting items");
//                       } else {
//                         res.writeHead(200, {
//                           "Content-type": "application/json"
//                         });
//                         res.end("item successfully inserted");
//                         console.log("Item details Inserted");
//                         //res.end(JSON.stringify(result4));
//                       }
//                     });
//                   }
//                 });
//               }
//             });
//           }
//         });
//       }
//     });
//   }
// });

//edit item
//
app.post("/updateitem", (req, res) => {
  console.log("Inside update item details");
  console.log("detttttttttt", req.body);
  menuitems.updateMany(
    { _id: req.body.itemId },
    {
      itemName: req.body.itemName,
      itemDesc: req.body.itemDesc,
      itemImage: req.body.itemImage,
      itemType: req.body.itemType,
      itemPrice: req.body.itemPrice
    },
    function(err, result) {
      if (err) {
        console.log("Error in updating item details");
        console.log(err);
        res.writeHead(400, {
          "Content-type": "text/plain"
        });
        console.log("err-----", err);
        res.end("Error in updating item details");
      } else {
        console.log("Item details update complete!");
        res.writeHead(200, {
          "Content-type": "text/plain"
        });
        res.end("Item details update complete!");
      }
    }
  );
});

// app.post("/updateitem", (req, res) => {
//   console.log("Inside update item details");
//   if (req.body.userEmail) {
//     pool.getConnection((err, conn) => {
//       if (err) {
//         console.log("Error while creating connection");
//         res.writeHead(500, {
//           "Content-type": "text/plain"
//         });
//         res.end("Error while creating connection");
//       } else {
//         sql1 =
//           "UPDATE items set " +
//           "itemName =" +
//           mysql.escape(req.body.itemName) +
//           "," +
//           "itemDesc = " +
//           mysql.escape(req.body.itemDesc) +
//           "," +
//           "itemImage = " +
//           mysql.escape(req.body.itemImage) +
//           "," +
//           "itemType = " +
//           mysql.escape(req.body.itemType) +
//           "," +
//           "itemPrice = " +
//           mysql.escape(req.body.itemPrice) +
//           " WHERE itemId = " +
//           mysql.escape(req.body.itemId);
//         conn.query(sql1, function(err, result1) {
//           if (err) {
//             console.log("Error in updating item details");
//             console.log(err);
//             res.writeHead(400, {
//               "Content-type": "text/plain"
//             });
//             console.log("err-----" + err);
//             res.end("Error in updating item details");
//           } else {
//             console.log("Item details update complete!");
//             res.writeHead(200, {
//               "Content-type": "text/plain"
//             });
//             res.end("Item details update complete!");
//           }
//         });
//       }
//     });
//   }
// });
//Allsections
app.post("/allsections", (req, res) => {
  console.log("Inside all sections");
  console.log("oooooooooooooooooooooo", req.body);
  // restaurantdet.find(
  //   {
  //     // userEmail: localStorage.getItem("userEmail"),
  //     userEmail: req.body.userEmail,
  //     restId: req.body.restId
  //     // restid: localStorage.getItem("restid")
  //   },
  //   function(err, result) {
  //     if (err) {
  //       console.log("Error in getting restaurant id");
  //       res.writeHead(400, {
  //         "Content-type": "text/plain"
  //       });
  //       res.end("Error in getting restaurant id");
  //     } else {
  // console.log("near menu itesms", req.body.itemType);
  menuitems.find(
    {
      // userEmail: req.body.userEmail
      // itemType: req.body.itemType
      restId: req.body.restId
    },
    function(err, result1) {
      console.log(err);
      //console.log("-----result1", result1);
      if (err) {
        console.log("Error in getting all sections");
        res.writeHead(400, {
          "Content-type": "text/plain"
        });
        res.end("Error in getting all sections");
      } else {
        res.writeHead(200, {
          "Content-type": "application/json"
        });
        console.log("result of menu items", result1);
        console.log("Displayed all sections");
        // console.log("all typesd d fmnbfdkjnfjknjkngjk",);

        res.end(JSON.stringify(result1));
      }
    }
  );
});
// }
//   );
// });

// });app.post("/allsections", (req, res) => {
//   console.log("Inside all sections");
//   if (req.body.userEmail) {
//     pool.getConnection((err, conn) => {
//       if (err) {
//         console.log("Error while creating connection");
//         res.writeHead(500, {
//           "Content-type": "text/plain"
//         });
//         res.end("Error while creating connection");
//       } else {
//         const sql1 =
//           "SELECT r.restId from restaurants r, users u WHERE u.userId = r.userId and u.userEmail = " +
//           mysql.escape(req.body.userEmail) +
//           "and u.accountType = " +
//           2;
//         conn.query(sql1, (err, result1) => {
//           if (err) {
//             console.log("Error in getting restaurant id");
//             res.writeHead(400, {
//               "Content-type": "text/plain"
//             });
//             res.end("Error in getting restaurant id");
//           } else {
//             const sql2 =
//               "SELECT DISTINCT itemType from items where restId = " +
//               mysql.escape(result1[0].restId);
//             conn.query(sql2, (err, result2) => {
//               if (err) {
//                 console.log("Error in getting all sections");
//                 res.writeHead(400, {
//                   "Content-type": "text/plain"
//                 });
//                 res.end("Error in getting all sections");
//               } else {
//                 res.writeHead(200, {
//                   "Content-type": "application/json"
//                 });
//                 console.log(result2);
//                 console.log("Displayed all sections");
//                 res.end(JSON.stringify(result2));
//               }
//             });
//           }
//         });
//       }
//     });
//   }
// });

//AllItems
app.post("/allItems", (req, res) => {
  console.log("Inside all items");
  console.log(req.body);

  restaurantdet.find(
    {
      userEmail: req.body.userEmail,
      restId: req.body.restId
    },
    function(err, result) {
      if (err) {
        console.log("Error in getting restaurant id");
        res.writeHead(400, {
          "Content-type": "text/plain"
        });
        res.end("Error in getting restaurant id");
      } else {
        console.log("Inside all items else");

        menuitems.find(
          {
            restId: req.body.restId
          },
          function(err, result1) {
            if (err) {
              console.log("Error in getting all items");
              res.writeHead(400, {
                "Content-type": "text/plain"
              });
              res.end("Error in getting all items");
            } else {
              res.writeHead(200, {
                "Content-type": "application/json"
              });
              console.log("Displayed all items");
              console.log(result1);
              res.end(JSON.stringify(result1));
            }
          }
        );
      }
    }
  );
});
// app.post("/allItems", (req, res) => {
//   console.log("Inside all items");
//   if (req.body.userEmail) {
//     pool.getConnection((err, conn) => {
//       if (err) {
//         console.log("Error while creating connection");
//         res.writeHead(500, {
//           "Content-type": "text/plain"
//         });
//         res.end("Error while creating connection");
//       } else {
//         const sql1 =
//           "SELECT r.restId from restaurants r, users u WHERE u.userId = r.userId and u.userEmail = " +
//           mysql.escape(req.body.userEmail) +
//           "and u.accountType = " +
//           2;
//         conn.query(sql1, (err, result1) => {
//           if (err) {
//             console.log("Error in getting restaurant id");
//             res.writeHead(400, {
//               "Content-type": "text/plain"
//             });
//             res.end("Error in getting restaurant id");
//           } else {
//             // const sql2 = "SELECT DISTINCT itemName from items where restId =  " + mysql.escape(result1[0].restId);
//             const sql2 =
//               "SELECT DISTINCT itemId, itemName, itemPrice, itemImage, itemDesc, itemType, cuisineName from items where restId =  " +
//               mysql.escape(result1[0].restId);
//             conn.query(sql2, (err, result2) => {
//               if (err) {
//                 console.log("Error in getting all items");
//                 res.writeHead(400, {
//                   "Content-type": "text/plain"
//                 });
//                 res.end("Error in getting all items");
//               } else {
//                 res.writeHead(200, {
//                   "Content-type": "application/json"
//                 });
//                 console.log("Displayed all items");
//                 res.end(JSON.stringify(result2));
//               }
//             });
//           }
//         });
//       }
//     });
//   }
// });
//itemsBasedonSections
app.post(
  "/itemsbasedonsections",
  (req, res) => {
    console.log("Inside items based on sections");
    // restaurantdet.find(
    //   {
    //     userEmail: req.body.userEmail,
    //     restId: req.body.restId
    //   },
    //   function(err, request) {
    //     if (err) {
    //       console.log("Error in getting restaurant id");
    //       res.writeHead(400, {
    //         "Content-type": "text/plain"
    //       });
    //       res.end("Error in getting restaurant id");
    //     } else {
    menuitems.find(
      {
        itemType: req.body.itemType
      },
      function(err, result1) {
        if (err) {
          console.log("Error in getting items based on sections");
          res.writeHead(400, {
            "Content-type": "text/plain"
          });
          res.end("Error in getting items based on sections");
        } else {
          res.writeHead(200, {
            "Content-type": "application/json"
          });
          console.log("Displayed all items based on sections");
          console.log(result1);
          res.end(JSON.stringify(result1));
        }
      }
    );
  }
  // }
);
//});

// app.post("/itemsbasedonsections", (req, res) => {
//   console.log("Inside items based on sections");
//   if (req.body.userEmail) {
//     pool.getConnection((err, conn) => {
//       if (err) {
//         console.log("Error while creating connection");
//         res.writeHead(500, {
//           "Content-type": "text/plain"
//         });
//         res.end("Error while creating connection");
//       } else {
//         const sql1 =
//           "SELECT r.restId from restaurants r, users u WHERE u.userId = r.userId and u.userEmail = " +
//           mysql.escape(req.body.userEmail) +
//           "and u.accountType = " +
//           2;
//         conn.query(sql1, (err, result1) => {
//           if (err) {
//             console.log("Error in getting restaurant id");
//             res.writeHead(400, {
//               "Content-type": "text/plain"
//             });
//             res.end("Error in getting restaurant id");
//           } else {
//             const sql2 =
//               "SELECT * from items WHERE itemType =  " +
//               mysql.escape(req.body.itemType) +
//               "and restId = " +
//               mysql.escape(result1[0].restId);
//             conn.query(sql2, (err, result2) => {
//               if (err) {
//                 console.log("Error in getting items based on sections");
//                 res.writeHead(400, {
//                   "Content-type": "text/plain"
//                 });
//                 res.end("Error in getting items based on sections");
//               } else {
//                 res.writeHead(200, {
//                   "Content-type": "application/json"
//                 });
//                 console.log("Displayed all items based on sections");
//                 res.end(JSON.stringify(result2));
//               }
//             });
//           }
//         });
//       }
//     });
//   }
// });

//deleteItem
app.put("/deleteitem", (req, res) => {
  console.log("Inside delete item details", req.body);
  menuitems.deleteMany(
    {
      _id: req.body.itemId
    },
    function(err, result) {
      if (err) {
        console.log("Error in deleting item details");
        console.log(err);
        res.writeHead(400, {
          "Content-type": "text/plain"
        });
        console.log("err-----", err);
        res.end("Error in deleting item details");
      } else {
        console.log("Item details deleted!");
        res.writeHead(200, {
          "Content-type": "text/plain"
        });
        res.end("Item details deleted!");
      }
    }
  );

  // });
});

// app.put("/deleteitem", (req, res) => {
//   console.log("Inside delete item details", req.body);
//   if (req.body.userEmail) {
//     pool.getConnection((err, conn) => {
//       if (err) {
//         console.log("Error while creating connection");
//         res.writeHead(500, {
//           "Content-type": "text/plain"
//         });
//         res.end("Error while creating connection");
//       } else {
//         sql1 =
//           "DELETE FROM items WHERE itemId = " + mysql.escape(req.body.itemId);
//         conn.query(sql1, function(err, result1) {
//           if (err) {
//             console.log("Error in deleting item details");
//             console.log(err);
//             res.writeHead(400, {
//               "Content-type": "text/plain"
//             });
//             console.log("err-----" + err);
//             res.end("Error in deleting item details");
//           } else {
//             console.log("Item details deleted!");
//             res.writeHead(200, {
//               "Content-type": "text/plain"
//             });
//             res.end("Item details deleted!");
//           }
//         });
//       }
//     });
//   }
// });
//update section
app.put("/updateSection", (req, res) => {
  console.log("Inside update section");
  menuitems.find(
    {
      restId: req.body.restId,
      itemType: req.body.itemType
    },
    function(err, result) {
      if (err) {
        console.log("Error in getting restaurant id");
        res.writeHead(400, {
          "Content-type": "text/plain"
        });
        res.end("Error in getting restaurant id");
      } else {
        menuitems.update(
          { itemType: req.body.itemType1 },
          {
            itemType: req.body.itemType
          },
          function(err, result1) {
            console.log("come ckeipjelnclwencljnjncd", result1);
            if (err) {
              console.log("Error in updating sections");
              res.writeHead(400, {
                "Content-type": "text/plain"
              });
              res.end("Error in updating sections");
            } else {
              res.writeHead(200, {
                "Content-type": "application/json"
              });
              console.log("Section/s updated");
              res.end("Section/s updated");
            }
          }
        );
      }
    }
  );
});

// app.put("/updateSection", (req, res) => {
//   console.log("Inside update section");
//   if (req.body.userEmail) {
//     pool.getConnection((err, conn) => {
//       if (err) {
//         console.log("Error while creating connection");
//         res.writeHead(500, {
//           "Content-type": "text/plain"
//         });
//         res.end("Error while creating connection");
//       } else {
//         const sql1 =
//           "SELECT r.restId from restaurants r, users u WHERE u.userId = r.userId and u.userEmail = " +
//           mysql.escape(req.body.userEmail) +
//           "and u.accountType = " +
//           2;
//         conn.query(sql1, (err, result1) => {
//           if (err) {
//             console.log("Error in getting restaurant id");
//             res.writeHead(400, {
//               "Content-type": "text/plain"
//             });
//             res.end("Error in getting restaurant id");
//           } else {
//             const sql2 =
//               "UPDATE items set itemType = " +
//               mysql.escape(req.body.itemType) +
//               " WHERE restId = " +
//               mysql.escape(result1[0].restId) +
//               " AND itemType= " +
//               mysql.escape(req.body.itemType1);
//             console.log("sql2", sql2);
//             conn.query(sql2, (err, result2) => {
//               if (err) {
//                 console.log("Error in updating sections");
//                 res.writeHead(400, {
//                   "Content-type": "text/plain"
//                 });
//                 res.end("Error in updating sections");
//               } else {
//                 res.writeHead(200, {
//                   "Content-type": "application/json"
//                 });
//                 console.log("Section/s updated");
//                 res.end("Section/s updated");
//               }
//             });
//           }
//         });
//       }
//     });
//   }
// });

//delete section
app.put("/deletesection", (req, res) => {
  console.log("Inside delete section");
  menuitems.find(
    {
      userEmail: req.body.userEmail,
      itemType: req.body.itemType
    },
    function(err, result) {
      console.log("wow wwowowowowowowowowowowo", result);
      if (err) {
        console.log("Error in getting restaurant id");
        res.writeHead(400, {
          "Content-type": "text/plain"
        });
        res.end("Error in getting restaurant id");
      } else {
        menuitems.deleteMany(
          {
            itemType: req.body.itemType
          },
          function(err, result1) {
            console.log("bababababababababbabbababab", result1);
            if (err) {
              console.log("Error in deleting sections");
              res.writeHead(400, {
                "Content-type": "text/plain"
              });
              res.end("Error in deleting sections");
            } else {
              res.writeHead(200, {
                "Content-type": "application/json"
              });
              // console.log(result);
              console.log("Section/s deleted");
              res.end("Section/s deleted");
            }
          }
        );
      }
    }
  );
});

// app.put("/deletesection", (req, res) => {
//   console.log("Inside delete section");
//   if (req.body.userEmail) {
//     pool.getConnection((err, conn) => {
//       if (err) {
//         console.log("Error while creating connection");
//         res.writeHead(500, {
//           "Content-type": "text/plain"
//         });
//         res.end("Error while creating connection");
//       } else {
//         const sql1 =
//           "SELECT r.restId from restaurants r, users u WHERE u.userId = r.userId and u.userEmail = " +
//           mysql.escape(req.body.userEmail) +
//           "and u.accountType = " +
//           2;
//         conn.query(sql1, (err, result1) => {
//           if (err) {
//             console.log("Error in getting restaurant id");
//             res.writeHead(400, {
//               "Content-type": "text/plain"
//             });
//             res.end("Error in getting restaurant id");
//           } else {
//             const sql2 =
//               "DELETE FROM items WHERE itemType = " +
//               mysql.escape(req.body.itemType) +
//               "and restId = " +
//               mysql.escape(result1[0].restId);
//             conn.query(sql2, (err, result2) => {
//               if (err) {
//                 console.log("Error in deleting sections");
//                 res.writeHead(400, {
//                   "Content-type": "text/plain"
//                 });
//                 res.end("Error in deleting sections");
//               } else {
//                 res.writeHead(200, {
//                   "Content-type": "application/json"
//                 });
//                 console.log(result2.orderId);
//                 console.log("Section/s deleted");
//                 res.end("Section/s deleted");
//               }
//             });
//           }
//         });
//       }
//     });
//   }
// });

module.exports = app;
