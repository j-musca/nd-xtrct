#!/bin/env node
var restify = require("restify");

function helloWorldRespond(reqest, response, next) {
  response.send({"hello": "world"});
  next();
}

function twitterConfig(reqest, response, next) {
    var config = { accessToken : process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret : process.env.TWITTER_ACCESS_TOKEN_SECRET,
    consumerKey : process.env.TWITTER_CONSUMER_KEY,
    consumerKeySecret : process.env.TWITTER_CONSUMER_SECRET };

    response.send(config);
    next();
}

function createServer() {
    var server = restify.createServer();

    server.pre(restify.pre.pause());
    server.pre(restify.pre.sanitizePath());
    server.pre(restify.pre.userAgentConnection());
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.gzipResponse());
    server.use(restify.queryParser());

    server.get("/", helloWorldRespond);
    server.get("/twitterConfig", twitterConfig);

    return server;
}

module.exports = {
    createServer: createServer
};