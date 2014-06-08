/**
 * Created by jonas on 07.06.14.
 */

var request = require("supertest");
var should = require("should");
var server = require("../server").createServer();
var InformationSource = require("../models/information-source");

describe("POST /rssSource", function() {

    afterEach(function(done) {
        InformationSource.model.remove({}, function() {
            done();
        });
    });

    it("respond with status code 200", function (done) {
        request(server)
            .post("/rssSource")
            .send({ "name": "rssSource", "url": "www.rss.de"})
            .set("Accept", "application/json")
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                done();
            });
    });

    it("respond with json format", function (done) {
        request(server)
            .post("/rssSource")
            .send({ "name": "rssSource", "url": "www.rss.de"})
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .end(function(err, res){
                if (err) return done(err);
                done();
            });
    });

    it("respond contains object with property 'id'", function (done) {
        request(server)
            .post("/rssSource")
            .send({ "name": "rssSource", "url": "www.rss.de"})
            .set("Accept", "application/json")
            .end(function(err, res){
                if (err) return done(err);
                res.body.should.have.property("id");
                done();
            });
    });

    it("request creates a reddit informations source", function (done) {
        request(server)
            .post("/rssSource")
            .send({ "name": "rssSource", "url": "www.rss.de"})
            .set("Accept", "application/json")
            .end(function(err, res){
                if (err) return done(err);
                var id = res.body["id"];

                InformationSource.getInformationSources(function(error, informationSources) {
                    if (error) {
                        done(error);
                    } else {
                        var informationSource = informationSources.filter(function(source) {
                            return source.id = id;
                        });
                        informationSource.should.not.be.null;
                        done();
                    }
                });
            });
    });

    it("invalid request creates not a reddit informations source", function (done) {
        request(server)
            .post("/rssSource")
            .send({ "name": "rssSource"})
            .set("Accept", "application/json")
            .end(function(err, res){
                if (err) return done(err);
                InformationSource.getInformationSources(function(error, informationSources) {
                    if (error) {
                        done(error);
                    } else {
                        informationSources.should.be.empty;
                        done();
                    }
                });
            });
    });

    it("invalid request gets respond with status code 409", function (done) {
        request(server)
            .post("/rssSource")
            .send({ "name": "rssSource"})
            .set("Accept", "application/json")
            .expect(409)
            .end(function(err, res){
                if (err) return done(err);
                done();
            });
    });
});
