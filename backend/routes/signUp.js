const express = require("express");
//const pool = require("../configFiles/connectionPooling");
var mysql = require("mysql");
const app = express.Router();
const bcrypt = require("bcrypt-nodejs");
var { mongoose } = require("../config/mongodb");
const { userdet } = require("../models/users");
const { restaurantdet } = require("../models/restaurants");

//CustomerSignUp
app.post("/customerSignup", (req, res) => {
  console.log("In customer signup");
  console.log(req.body);

  //Hashing Password
  const hashedPassword = bcrypt.hashSync(req.body.userPassword);
  // console.log("hashed pwd",hashedPassword)
  {
    //query

    var userSchema = new userdet({
      userName: req.body.userName,
      userPassword: hashedPassword,
      userEmail: req.body.userEmail,
      userAddress: req.body.userAddress,
      userPhone: req.body.userPhone,
      userZip: req.body.userZip,
      accountType: req.body.accountType,
      cart: [],
      orders: []
    });
    userdet.findOne(
      {
        userEmail: req.body.userEmail
      },
      function(err, result) {
        if (result) {
          console.log("email already exist");
          res.send(400).send();
        } else {
          console.log("success");
          userSchema
            .save()
            .then(result => {
              console.log(result);
            })
            .catch(err => console.log(err));
        }
      }
    );
  }
});

//OwnerSignup
app.post("/ownerSignup", (req, res) => {
  console.log("In owners signup");
  console.log(req.body);
  const hashedPassword = bcrypt.hashSync(req.body.userPassword);
  {
    var userSchema = new userdet({
      userName: req.body.userName,
      userPassword: hashedPassword,
      userEmail: req.body.userEmail,
      userAddress: req.body.userAddress,
      userPhone: req.body.userPhone,
      userZip: req.body.userZip,
      accountType: req.body.accountType,
      restid: req.body.restId,
      cart: [],
      orders: []
    });
    var userSchema1 = new restaurantdet({
      restid: req.body.restId,
      restName: req.body.restName,
      restPhone: req.body.restPhone,
      restZip: req.body.restZip,
      restAddress: req.body.restAddress,
      restDesc: req.body.restDesc,
      userEmail: req.body.userEmail
    });
    restaurantdet.findOne(
      {
        restName: req.body.restName,
        restZip: req.body.restZip
      },
      function(err, result) {
        console.log("result:", result);
        if (err) {
          console.log("Enter Valid Details");
        } else {
          console.log("in else=========");
          if (result != null && result.length != 0) {
            console.log("Duplicate Restaurant name within same location");
            res
              .status(401)
              .end("Duplicate Restaurant name within same location");
          } else {
            console.log("New Restaurant");
            userSchema.save().then(result => {
              console.log(result);
            });
            userdet.findOne(
              {
                userEmail: req.body.userEmail
              },
              function(err, result) {
                if (err) {
                  console.log("email already exist");
                  res.send(400).send();
                } else {
                  console.log(result);
                  userSchema1
                    .save()
                    .then(result => {
                      console.log(result);
                    })
                    .catch(err => console.log(err));
                }
              }
            );
          }
        }
      }
    );
  }
});

//   const sql1 = `SELECT restName, restZip FROM restaurants WHERE restName = ${mysql.escape(
//     req.body.restName
//   )}
//                 AND restZip = ${mysql.escape(req.body.restZip)}`;
//   console.log(sql1);
//   pool.getConnection((err, conn) => {
//     if (err) {
//       console.log("Error in creating connection");
//       res.writeHead(500, {
//         "Content-type": "text/plain"
//       });
//       res.end("Error in connecting connection");
//     } else {
//       conn.query(sql1, (err, result) => {
//         if (err) {
//           res.writeHead(400, {
//             "Content-type": "text/plain"
//           });
//           console.log(err);
//           res.end("Enter valid details");
//         } else {
//           if (!result.length == 0) {
//             console.log("Duplicate Restaurant name within same location");
//             res
//               .status(401)
//               .end("Duplicate Restaurant name within same location");
//           } else {
//             //Hashing Password!
//             const hashedPassword = bcrypt.hashSync(req.body.userPassword);
//             console.log("New Restaurant");
//             const sql2 =
//               "INSERT into users (userName, userEmail, userPassword, userPhone, userAddress, userZip, accountType) VALUES (" +
//               mysql.escape(req.body.userName) +
//               "," +
//               mysql.escape(req.body.userEmail) +
//               "," +
//               mysql.escape(hashedPassword) +
//               "," +
//               mysql.escape(req.body.userPhone) +
//               "," +
//               mysql.escape(req.body.userAddress) +
//               "," +
//               mysql.escape(req.body.userZip) +
//               "," +
//               mysql.escape(req.body.accountType) +
//               ");";
//             pool.getConnection((err, conn) => {
//               if (err) {
//                 console.log("Error in creating connection");
//                 res.writeHead(500, {
//                   "Content-type": "text/plain"
//                 });
//                 res.end("Error in connecting connection");
//               } else {
//                 conn.query(sql2, (err, result) => {
//                   if (err) {
//                     res.writeHead(400, {
//                       "Content-type": "text/plain"
//                     });
//                     console.log(err);
//                     if (err.sqlMessage.includes("userEmail")) {
//                       console.log("Use different email");
//                       res.status(402).end("Use different email");
//                     } else {
//                       console.log(err);

//                       res.status(403).end("Please Enter Valid details");
//                     }
//                   } else {
//                     console.log("Getting userId");

//                     const sql3 = `SELECT userId FROM users WHERE userEmail = ${mysql.escape(
//                       req.body.userEmail
//                     )}`;

//                     pool.getConnection((err, conn) => {
//                       if (err) {
//                         console.log("Error in creating connection");
//                         res.writeHead(500, {
//                           "Content-type": "text/plain"
//                         });
//                         res.end("Error in connecting connection");
//                       } else {
//                         conn.query(sql3, (err, result) => {
//                           if (err) {
//                             res.status(404).end("UserId not created");
//                           } else {
//                             console.log(result);
//                             console.log("userId created");

//                             const sql4 =
//                               "INSERT into restaurants (userId, restName, restAddress, restZip, restPhone, restDesc) VALUES ( " +
//                               result[0].userId +
//                               "," +
//                               mysql.escape(req.body.restName) +
//                               "," +
//                               mysql.escape(req.body.restAddress) +
//                               "," +
//                               mysql.escape(req.body.restZip) +
//                               "," +
//                               mysql.escape(req.body.restPhone) +
//                               "," +
//                               mysql.escape(req.body.restDesc) +
//                               ");";

//                             console.log(sql4);
//                             pool.getConnection((err, conn) => {
//                               if (err) {
//                                 console.log(err);
//                                 res
//                                   .status(500)
//                                   .end("Error in creating connection");
//                               } else {
//                                 conn.query(sql4, (err, result) => {
//                                   if (err) {
//                                     console.log(err);
//                                     res
//                                       .status(405)
//                                       .end("Enter valid restaurant details");
//                                   } else {
//                                     res.writeHead(200, {
//                                       "Content-type": "text/plain"
//                                     });
//                                     console.log("Signup successful");
//                                     res.end("Signup successful");
//                                   }
//                                 });
//                               }
//                             });
//                           }
//                         });
//                       }
//                     });
//                   }
//                 });
//               }
//             });
//           }
//         }
//       });
//     }
//   });
// });
// );
module.exports = app;
