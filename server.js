#!/bin/env node
var restify = require("restify");
var InformationSource = require("./models/information-source");
var startUpTime = new Date();

function versionInfo(request, response, next) {
    response.send({"version": "0.7", "startUpTime": startUpTime});
    next();
}

function createTwitterSource(request, response, next) {
    var name = request.params.name;
    var slug = request.params.slug;
    var ownerName = request.params.ownerName;
    var informationSource = InformationSource.createTwitterSource(name, slug, ownerName);
    saveInformationSource(informationSource, response, next);
}

function createRedditSource(request, response, next) {
    var name = request.params.name;
    var subRedditName = request.params.subRedditName;
    var informationSource = InformationSource.createRedditSource(name, subRedditName);
    saveInformationSource(informationSource, response, next);
}

function createRssSource(request, response, next) {
    var name = request.params.name;
    var url = request.params.url;
    var informationSource = InformationSource.createRssSource(name, url);
    saveInformationSource(informationSource, response, next);
}

function saveInformationSource(informationSource, response, next) {
    informationSource.save(function(error, model) {
        if (error) {
            return next(new restify.InvalidArgumentError(error.toString()))
        } else {
            response.send({"id": model.id});
            next();
        }
    });
}

function listInformationSources(request, response, next) {
    InformationSource.getInformationSources( function (error, informationSources) {
        if (error) {
            console.log("Could not load information sources for entries.")
            response.send({"sources": []});
        } else {
            response.send({"sources": informationSources});
        }
    });
}

function deleteInformationSource(request, response, next) {
    var id = request.params.id;
    InformationSource.remove(id, function(error, numberAffectedDocuments) {
        if (error) {
            return next(new restify.InvalidArgumentError(error.toString()))
        } else {
            if (numberAffectedDocuments === 0) {
                return next(new restify.InvalidArgumentError("No document with this id exists."))
            } else {
                response.send({"id": id});
                next();
            }
        }
    });
}

function createServer() {
    var jobInterval = 5;//60 * 5; // 5 minutes
    var ConnectorService = require("./services/connector-service");
    var EntryService = require("./services/entry-service");
    var ReaderService = require("./services/reader-service");
    var Job = require("./jobs/job");

    var connectorService = new ConnectorService();
    var entryService = new EntryService();
    var readerService = new ReaderService(connectorService.getConnectors(), entryService.saveEntries);
    var readerJob = new Job(jobInterval, readerService);

    readerJob.startJob();

    var server = restify.createServer();

    server.pre(restify.pre.pause());
    server.pre(restify.pre.sanitizePath());
    server.pre(restify.pre.userAgentConnection());
    server.use(restify.fullResponse());
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.gzipResponse());
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    server.get("/", versionInfo);
    server.post("/twitterSource", createTwitterSource);
    server.post("/redditSource", createRedditSource);
    server.post("/rssSource", createRssSource);
    server.get("/list", listInformationSources);
    server.post("/source", deleteInformationSource);

    return server;
}

module.exports = {
    createServer: createServer
};