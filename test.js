#!/usr/bin/env node

var request = require("supertest");
var assert = require("assert")
var server = require("./server").createServer();

describe("GET /", function() {
  it("respond with status code 200", function (done) {
    request(server)
      .get("/")
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done();
      });
  })

  it("respond with 'hello world' in the body", function (done) {
      request(server)
        .get("/")
        .expect('"hello world"')
        .end(function(err, res){
          if (err) return done(err);
          console.log(res);
          done();
        });
    })
})