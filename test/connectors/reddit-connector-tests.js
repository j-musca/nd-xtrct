/**
 * Created by jonas on 14.06.14.
 */

var should = require("should");
var RedditConnector = require("../../connectors/reddit-connector");
var InformationSource = require("../../models/information-source");

describe("A reddit connector", function() {

    afterEach(function(done) {
        InformationSource.model.remove({}, function() {
            done();
        });
    });

    it("can be created", function(done) {
        var redditConnector = new RedditConnector({});
        redditConnector.should.not.be.null;
        done();
    });

    it("can return a list of two entries if two entries are found", function(done) {
        var redditSource = InformationSource.createRedditSource("reddit", "some");

        var get = function(informationSource, callback) {
            var firstRedditData = {data: {title: "first", domain: "first.de", created_utc: "123", selftext: "", url: "first.de/first", permalink: "/r/first"}};
            var secondRedditData = {data: {title: "second", domain: "second.de", created_utc: "124", selftext: "", url: "second.de/second", permalink: "/r/second"}};
            callback(null, [firstRedditData, secondRedditData])
        };

        var dummyConnection = {get: get};
        var callback = function(entries) {
            entries.should.have.length(2);
            done();
        };

        var redditConnector = new RedditConnector(dummyConnection);
        redditConnector.getNewestEntries(redditSource, callback);
    });

    it("can return an empty list of entries if an error occured", function(done) {
        var redditSource = InformationSource.createRedditSource("reddit", "some");

        var get = function(informationSource, callback) {
            var firstRedditData = {data: {title: "first", domain: "first.de", created_utc: "123", selftext: "", url: "first.de/first", permalink: "/r/first"}};
            var secondRedditData = {data: {title: "second", domain: "second.de", created_utc: "124", selftext: "", url: "second.de/second", permalink: "/r/second"}};
            callback("Some Error", [firstRedditData, secondRedditData])
        };

        var dummyConnection = {get: get};
        var callback = function(entries) {
            entries.should.be.empty;
            done();
        };

        var redditConnector = new RedditConnector(dummyConnection);
        redditConnector.getNewestEntries(redditSource, callback);
    });

    it("can ignore old entries", function(done) {
        var redditSource = InformationSource.createRedditSource("reddit", "some");
        redditSource.lastEntryData.newestEntryUTCTimestamp = 123;

        var get = function(informationSource, callback) {
            var firstRedditData = {data: {title: "first", domain: "first.de", created_utc: "123", selftext: "", url: "first.de/first", permalink: "/r/first"}};
            var secondRedditData = {data: {title: "second", domain: "second.de", created_utc: "124", selftext: "", url: "second.de/second", permalink: "/r/second"}};
            callback(null, [firstRedditData, secondRedditData])
        };

        var dummyConnection = {get: get};
        var callback = function(entries) {
            entries.should.have.length(1);
            done();
        };

        var redditConnector = new RedditConnector(dummyConnection);
        redditConnector.getNewestEntries(redditSource, callback);
    });
});