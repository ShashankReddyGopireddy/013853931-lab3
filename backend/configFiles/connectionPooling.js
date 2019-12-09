const mysql = require("mysql");

var pool = mysql.createPool({
  connectionLimit: 1000,
  host: "localhost",
  user: "root",
  password: "Shashank@96",
  database: "grubhub"
});

module.exports = pool;
