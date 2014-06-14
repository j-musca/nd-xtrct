/**
 * Created by jonas on 08.06.14.
 */

var request = require("supertest");
var should = require("should");
var server = require("../server").createServer();
var InformationSource = require("../models/information-source");

describe("POST /source", function() {

    afterEach(function(done) {
        InformationSource.model.remove({}, function() {
            done();
        });
    });

    it("request deletes a twitter information source and returns the id", function (done) {
        var twitterSource = InformationSource.createTwitterSource("twitter", "slug", "ownerName");

        twitterSource.save(function(saveError, model) {
            if (saveError) {
                done(saveError);
            } else {
                request(server)
                    .post("/source")
                    .send({ "id": model.id})
                    .set("Accept", "application/json")
                    .end(function(apiError, response){
                        if (apiError) {
                            done(apiError);
                        } else {
                            var id = response.body["id"];

                            id.should.be.equal(model.id);
                            done();
                        }
                    });
            }
        });
    });

    it("request deletes a twitter information source", function (done) {
        var twitterSource = InformationSource.createTwitterSource("twitter", "slug", "ownerName");

        twitterSource.save(function(saveError, model) {
            if (saveError) {
                return done(saveError);
            } else {
                request(server)
                    .post("/source")
                    .send({ "id": model._id})
                    .set("Accept", "application/json")
                    .end(function(apiError, response){
                        if (apiError) {
                            done(apiError);
                        } else {
                            InformationSource.getInformationSources(function(error, informationSources) {
                                if (error) {
                                    done(error);
                                } else {
                                    informationSources.should.be.empty;
                                    done();
                                }
                            });

                        }
                    });
            }
        });
    });

    it("request returns error if id does not match a information source", function (done) {
        var notExistingId = "123abc";

        request(server)
        .post("/source")
        .send({ "id": notExistingId})
        .set("Accept", "application/json")
        .expect(409)
        .end(function(err, res){
            if (err) return done(err);
            done();
        });
    });
});

