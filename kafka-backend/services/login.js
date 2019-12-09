// var Model = require('../DatabaseConnection');
var bcrypt = require("bcrypt");
// var bcrypt = require('bcrypt');

const { userdet } = require("../models/users");

function handle_request(msg, callback) {
  console.log("Inside  Kafka Backend Login");
  console.log("Message", msg);

  console.log("in jwt requests", msg);
  userdet.findOne(
    {
      userEmail: msg.userEmail
    },
    function(err, user) {
      console.log("results");
      if (user) {
        if (!bcrypt.compareSync(msg.userPassword, user.userPassword)) {
          console.log("Invaid Credentials");
          callback(null, null);
        } else {
          console.log("in user", user);
          callback(null, user);
        }
      } else if (err) {
        console.log(err);
      } else {
        console.log("null");
        callback(null, null);
      }
    }
  );
}

exports.handle_request = handle_request;
