#!/bin/env node
var restify = require("restify");
var InformationSource = require("./models/information-source");

function helloWorldRespond(request, response, next) {
    response.send({"hello": "world"});
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

function deleteInformationSource(request, response, next) {
    var id = request.params.id;
    InformationSource.remove(id, function(error, model) {
        if (error) {
            return next(new restify.InvalidArgumentError(error.toString()))
        } else {
            response.send({"id": model.id});
            next();
        }
    });
}

function createServer() {
    var server = restify.createServer();

    server.pre(restify.pre.pause());
    server.pre(restify.pre.sanitizePath());
    server.pre(restify.pre.userAgentConnection());
    server.use(restify.fullResponse());
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.gzipResponse());
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    server.get("/", helloWorldRespond);
    server.post("/twitterSource", createTwitterSource);
    server.post("/redditSource", createRedditSource);
    server.post("/rssSource", createRssSource);
    server.del("/source", deleteInformationSource);

    return server;
}

module.exports = {
    createServer: createServer
};