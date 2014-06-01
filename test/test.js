#!/usr/bin/env node

var request = require("supertest");
var should = require("should");
var server = require("../server").createServer();
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/test');

describe("GET /", function() {
  it("respond with status code 200", function (done) {
    request(server)
      .get("/")
      .set("Accept", "application/json")
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done();
      });
  });

  it("respond with json format", function (done) {
    request(server)
      .get("/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .end(function(err, res){
        if (err) return done(err);
        done();
      });
  });

  it("respond contains object with property 'hello' and value 'world'", function (done) {
    request(server)
      .get("/")
      .set("Accept", "application/json")
      .end(function(err, res){
        if (err) return done(err);
        res.body.should.have.property("version");
        done();
      });
  });
});