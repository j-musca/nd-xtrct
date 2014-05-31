#!/bin/env node

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var database_connection_string = "127.0.0.1:27017/extractor";

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  database_connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PORT + "/" +
  process.env.OPENSHIFT_APP_NAME;
}

var mongoose = require('mongoose');
mongoose.connect(database_connection_string);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var serverFactory = require("./server");
var server = serverFactory.createServer();

server.listen(port, ip_address, function() {
  console.log("%s listening at %s", server.name, server.url);
});

//var InformationSource = require("./models/information-source");
//var twitterSource = InformationSource.createTwitterSource("programming", "programming", "j_musca");
//
//twitterSource.save(function(error, model) {
//    if (error) {
//        console.log(error);
//    } else {
//        console.log("Saved: " + model);
//    }
//});

var InformationSource = require("./models/information-source");
//
//InformationSource.model.remove({}, function() {
//    console.error("Deleted information sources");
//    var twitterSource = InformationSource.createTwitterSource("programming", "programming", "j_musca");
////    var redditSource = InformationSource.createRedditSource("reddit-programming", "programming");
////    var rssSource = InformationSource.createRssSource("computerbase", "http://www.computerbase.de/rss/news.xml");
//
//    var sources = [twitterSource];
//
//    sources.forEach(function(source) {
//        source.save(function(error, model) {
//            if (error) {
//                console.log(error);
//            } else {
//                console.log("Saved: " + model);
//            }
//        });
//    });
//});

//var Entry = require("./models/entry");
//
//Entry.getEntriesAfterCollectionDate(new Date(2014,4,30), function(error, entries) {
//   entries.forEach(function(entry){
//
//   });
//});

//
//Entry.model.findOne({}).exec(function(error, result) {
//    InformationSource.model.findById(result.source, function (error, informationSource) {
//        console.log(informationSource);
//    });
//});

var ConnectorService = require("./services/connector-service");
var EntryService = require("./services/entry-service");
var ReaderService = require("./services/reader-service");
var Job = require("./jobs/job");

var connectorService = new ConnectorService();
var entryService = new EntryService();
var readerService = new ReaderService(connectorService.getConnectors(), entryService.saveEntries);
var readerJob = new Job(10, readerService);

readerJob.startJob();