/**
 * Created by jonas on 24.04.14.
 */


var should = require("should");
var InformationSource = require("../../models/information-source");

describe("An Information sources", function() {
    afterEach(function(done) {
        InformationSource.model.remove({}, function() {
            done();
        });
    });

    it("can be a twitter source", function(done){
        var twitterSource = InformationSource.createTwitterSource("twitter", "slug", "ownerName");

        twitterSource.should.have.property("name", "twitter");
        twitterSource.should.have.property("connectionData", {slug: "slug", ownerName: "ownerName"});
        twitterSource.should.have.property("lastEntryData", {tweetId: null});
        twitterSource.should.have.property("type", "TWITTER");

        done();
    });

    it("can save a twitter source", function(done){
        var twitterSource = InformationSource.createTwitterSource("twitter", "slug", "ownerName");

        twitterSource.save(function(error, model) {
            if (error) {
                return done(error);
            } else {
                model.should.have.property("name", "twitter");
                model.should.have.property("connectionData", {slug: "slug", ownerName: "ownerName"});
                model.should.have.property("lastEntryData", {tweetId: null});
                model.should.have.property("type", "TWITTER");
                done();
            }
        });
    });


    it("can be a rss source", function(done){
        var rssSource = InformationSource.createRssSource("rss", "http://link.de");

        rssSource.should.have.property("name", "rss");
        rssSource.should.have.property("connectionData", {url: "http://link.de"});
        rssSource.should.have.property("lastEntryData", {newestEntryDate: null});
        rssSource.should.have.property("type", "RSS");

        done();
    });

    it("can save a rss source", function(done){
        var rssSource = InformationSource.createRssSource("rss", "http://link.de");

        rssSource.save(function(error, model) {
            if (error) {
                return done(error);
            } else {
                model.should.have.property("name", "rss");
                model.should.have.property("connectionData", {url: "http://link.de"});
                model.should.have.property("lastEntryData", {newestEntryDate: null});
                model.should.have.property("type", "RSS");
                done();
            }
        });
    });


    it("can be a reddit source", function(done){
        var redditSource = InformationSource.createRedditSource("reddit", "subReddit");

        redditSource.should.have.property("name", "reddit");
        redditSource.should.have.property("connectionData", {subRedditName: "subReddit"});
        redditSource.should.have.property("lastEntryData", {newestEntryUTCTimestamp: null});
        redditSource.should.have.property("type", "REDDIT");

        done();
    });

    it("can save a reddit source", function(done){
        var redditSource = InformationSource.createRedditSource("reddit", "subReddit");

        redditSource.save(function(error, model) {
            if (error) {
                return done(error);
            } else {
                model.should.have.property("name", "reddit");
                model.should.have.property("connectionData", {subRedditName: "subReddit"});
                model.should.have.property("lastEntryData", {newestEntryUTCTimestamp: null});
                model.should.have.property("type", "REDDIT");
                done();
            }
        });
    });

    it("can load multiple information sources", function(done){
        var redditSource = InformationSource.createRedditSource("reddit", "subReddit");
        var rssSource = InformationSource.createRssSource("rss", "http://link.de");
        var twitterSource = InformationSource.createTwitterSource("twitter", "slug", "ownerName");

        InformationSource.model.create([redditSource, rssSource, twitterSource], function(error){
            if (error) {
                return done(error);
            } else {
                InformationSource.getInformationSources(function(error, docs) {
                    if (error) {
                        return done(error);
                    } else {
                        docs.should.have.length(3);
                        done();
                    }
                });
            }
        });
    });

    it("can load one information sources", function(done){
        var redditSource = InformationSource.createRedditSource("reddit", "subReddit");

        InformationSource.model.create([redditSource], function(error){
            if (error) {
                return done(error);
            } else {
                InformationSource.getInformationSources(function(error, docs) {
                    if (error) {
                        return done(error);
                    } else {
                        docs.should.have.length(1);
                        done();
                    }
                });
            }
        });
    });
});
