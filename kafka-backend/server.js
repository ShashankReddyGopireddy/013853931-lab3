var connection = new require("./kafka/Connection");
var mongoose = require("mongoose");
//var configLink=require('./../config');
mongoose.Promise = global.Promise;

mongoose.connect(
  "mongodb+srv://admin:admin@mongodbcluster-va4s4.mongodb.net/grubhub?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
var mdb = mongoose.connection;

mdb.on("error", console.error.bind(console, "Connection error"));
mdb.on("open", () => {
  console.log("MongoDB connected!");
});

//var signin = require('./services/signin.js');

var Login = require("./services/login");

function handleTopicRequest(topic_name, fname) {
  //var topic_name = 'root_topic';
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log("server is running ");
  consumer.on("message", function(message) {
    console.log("message received for " + topic_name + " ", fname);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    fname.handle_request(data.data, function(err, res) {
      console.log("after handle" + res);
      var payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res
          }),
          partition: 0
        }
      ];
      producer.send(payloads, function(err, data) {
        console.log(data);
      });
      return;
    });
  });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request

handleTopicRequest("login", Login);
