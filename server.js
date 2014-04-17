#!/bin/env node
var restify = require("restify");

function helloWorldRespond(req, res, next) {
  res.send({"hello": "world"});
  next();
}

function createServer() {
    var server = restify.createServer();

    // Ensure we don"t drop data on uploads
    server.pre(restify.pre.pause());
    // Clean up sloppy paths like
    server.pre(restify.pre.sanitizePath());
    // Handles annoying user agents (curl)
    server.pre(restify.pre.userAgentConnection());
    // Use the common stuff you probably want
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.gzipResponse());
    server.use(restify.queryParser());

    server.get("/", helloWorldRespond);

    return server;
}

module.exports = {
    createServer: createServer
};