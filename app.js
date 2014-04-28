#!/bin/env node

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

// default to a "localhost" configuration:
var database_connection_string = "127.0.0.1:27017/extractor";
// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  database_connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PORT + "/" +
  process.env.OPENSHIFT_APP_NAME;
}

var mongoose = require('mongoose');
var InformationSource = require('./models/information-source');
mongoose.connect(database_connection_string);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var serverFactory = require("./server");
var server = serverFactory.createServer();

server.listen(port, ip_address, function() {
  console.log("%s listening at %s", server.name, server.url);
});

//var rss = require("./connectors/rss-connector")
//
//rss.getNewestEntries("http://rss.golem.de/rss.php?feed=ATOM1.0", function(error, entries) {
//    if (error) {
//        console.log("Something went wrong: " + error);
//    } else {
//        console.log(entries);
//    }
//});