#!/usr/bin/env node

var request = require("supertest");
var should = require("should");
var server = require("../server").createServer();
var InformationSource = require("../models/information-source");

describe("GET /list", function () {

    afterEach(function(done) {
        InformationSource.model.remove({}, function() {
            done();
        });
    });

    it("returns a list of information sources", function (done) {
        var twitterSource = InformationSource.createTwitterSource("twitter", "slug", "ownerName");

        twitterSource.save(function(saveError, model) {
            if (saveError) {
                done(saveError);
            } else {
                request(server)
                    .get("/list")
                    .set("Accept", "application/json")
                    .end(function(apiError, response){
                        if (apiError) {
                            done(apiError);
                        } else {
                            var sources = response.body["sources"];

                            sources.should.have.length(1);
                            done();
                        }
                    });
            }
        });
    });
});