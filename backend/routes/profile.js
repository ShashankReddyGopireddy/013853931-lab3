const express = require("express");
const pool = require("../configFiles/connectionPooling");
var mysql = require("mysql");
const app = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

//Storing documents/Images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

//get profile details
app.post("/getprofile", (req, res) => {
  console.log("Inside get profile");
  console.log(req.body.userEmail);
  // console.log("req.body", req.body);
  // if (req.body.userEmail) {

  if (req.body.userEmail) {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log("Error while creating connection");
        res.writeHead(500, {
          "Content-type": "text/plain"
        });
        res.end("Error while creating connection");
      } else {
        //query
        console.log(
          "mysql.escape(req.body.userEmail)" + mysql.escape(req.body.userEmail)
        );

        const sql1 =
          "SELECT * FROM users WHERE userEmail= " +
          mysql.escape(req.body.userEmail);
        // mysql.escape(req.body.userEmail);

        // const sql2 = "SELECT RestaurantName, RestaurantAdr, RestaurantZip, RestaurantPhone FROM restaurant WHERE UserName= "+mysql.escape(req.body.UserName);

        conn.query(sql1, (err, result) => {
          if (err) {
            console.log("Error in retrieving profile data");

            res.writeHead(400, {
              "Content-type": "text/plain"
            });

            res.end("Error in retrieving profile data");
          } else {
            console.log("Profile data: ", result);
            console.log(typeof JSON.stringify(result[0].userId));

            console.log("Inside else loop for sql2");

            const sql2 =
              "SELECT * FROM restaurants WHERE userId= " +
              mysql.escape(result[0].userId);

            conn.query(sql2, (err, result1) => {
              if (err) {
                console.log("Error while getting restaurent details");

                // res.writeHead(400,{

                //     'Content-type': 'text/plain'

                // });

                // res.end("Error while getting restaurent details");
              }

              //   else{

              console.log("result1", result1);

              if (result1 && result1.length != 0) {
                const obj = result.concat(result1);

                console.log("--obj--" + obj);
                res.writeHead(200, {
                  "Content-type": "application/json"
                });

                res.end(JSON.stringify(obj));
              } else {
                res.writeHead(200, {
                  "Content-type": "application/json"
                });

                console.log("Profile data reterived");

                res.end(JSON.stringify(result[0]));
              }
            });
          }
        });
      }
    });

    //   }
  } else {
    console.log("Error in retrieving profile data");

    res.writeHead(400, {
      "Content-type": "text/plain"
    });

    res.end("Error in retrieving profile data");
  }
});

//update profile
app.put("/updateprofile", (req, res) => {
  console.log("Inside update profile");

  // console.log("req.body.user" + req.body.user);

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
          "SELECT userId from users WHERE userEmail = " +
          mysql.escape(req.body.userEmail);

        console.log("sql1---" + sql1);

        conn.query(sql1, (err, result1) => {
          if (err) {
            console.log("Error in fetching User Id");

            console.log(err);
          } else {
            console.log("User Id fetched");

            console.log(result1[0]);

            //Hashing Password!

            //const hashedPassword = bcrypt.hashSync(req.body.userPassword);

            var sql2 =
              "UPDATE users set " +
              "userName = " +
              mysql.escape(req.body.userName) +
              "," +
              "userEmail = " +
              mysql.escape(req.body.userEmail) +
              "," +
              "userPassword = " +
              mysql.escape(req.body.userPassword) +
              "," +
              "userPhone = " +
              mysql.escape(req.body.userPhone) +
              "," +
              "userAddress = " +
              mysql.escape(req.body.userAddress) +
              "," +
              "userZip= " +
              mysql.escape(req.body.userZip) +
              "," +
              "userImage = " +
              mysql.escape(req.body.userImage) +
              " WHERE userId = " +
              result1[0].userId;

            console.log("sql2---" + sql2);

            conn.query(sql2, function(err, result2) {
              if (err) {
                console.log("Error in updating profile data");

                console.log(err);

                res.writeHead(400, {
                  "Content-type": "text/plain"
                });

                console.log("err-----" + err);

                res.end("Error in updating profile data");
              } else {
                console.log("Profile data update complete!");

                res.writeHead(200, {
                  "Content-type": "text/plain"
                });

                res.end("Profile data update complete!");
              }
            });
          }
        });
      }
    });
  }
});

//uplaod-file
app.post("/upload-file", upload.array("photos", 5), (req, res) => {
  console.log("req.body", req.body);
  res.end();
});

//download-file
app.get("/download-file/:user_image", (req, res) => {
  // console.log('Inside DOwnload File');
  // var file = req.params.file;
  // console.log("file name",file)
  // var filelocation = path.join(__dirname + '../../uploads', file);
  // console.log("file loc",filelocation)

  // var img = fs.readFileSync(filelocation);
  // var base64img = new Buffer(img).toString('base64');
  // res.writeHead(200, {
  //     'Content--type': 'image/jpg'
  // });
  // res.end(base64img);

  var image = path.join(__dirname + "../../uploads", req.params.user_image);

  if (fs.existsSync(image)) {
    res.sendFile(image);
  } else {
    res.end("image not found");
  }
});

module.exports = app;
