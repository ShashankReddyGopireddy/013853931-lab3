var mongoose = require("mongoose");
//var configLink=require('./../config');
mongoose.Promise = global.Promise;

// mongoose.set('useCreateIndex', true);
mongoose.connect(
  "mongodb+srv://admin:admin@mongodbcluster-va4s4.mongodb.net/grubhub?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
// mongoose.set('useCreateIndex', true);
var mdb = mongoose.connection;

mdb.on("error", console.error.bind(console, "Connection error"));
mdb.on("open", () => {
  console.log("MongoDB connected!");
});

module.exports = { mongoose };
