/**
 * Created by jonas on 14.06.14.
 */

var should = require("should");
var RssConnector = require("../../connectors/rss-connector");
var InformationSource = require("../../models/information-source");

describe("A rss connector", function() {

    afterEach(function(done) {
        InformationSource.model.remove({}, function() {
            done();
        });
    });

    it("can be created", function(done) {
        var rssConnector = new RssConnector({});
        rssConnector.should.not.be.null;
        done();
    });

    it("can return a list of two entries if two entries are found", function(done) {
        var rssSource = InformationSource.createRssSource("rss", "some");

        var get = function(informationSource, callback) {
            var firstRssData = {title: "first", description: "first desc", link: "first.de", date: new Date()};
            var secondRssData = {title: "second", description: "second desc", link: "second.de", date: new Date()};
            callback(null, [firstRssData, secondRssData])
        };

        var dummyConnection = {get: get};
        var callback = function(entries) {
            entries.should.have.length(2);
            done();
        };

        var rssConnector = new RssConnector(dummyConnection);
        rssConnector.getNewestEntries(rssSource, callback);
    });

    it("can return an empty list of entries if an error occured", function(done) {
        var rssSource = InformationSource.createRssSource("rss", "some");

        var get = function(informationSource, callback) {
            var firstRssData = {title: "first", description: "first desc", link: "first.de", date: new Date()};
            var secondRssData = {title: "second", description: "second desc", link: "second.de", date: new Date()};
            callback("Some Error", [firstRssData, secondRssData])
        };

        var dummyConnection = {get: get};
        var callback = function(entries) {
            entries.should.be.empty;
            done();
        };

        var rssConnector = new RssConnector(dummyConnection);
        rssConnector.getNewestEntries(rssSource, callback);
    });

    it("can ignore old entries", function(done) {
        var rssSource = InformationSource.createRssSource("rss", "some");
        var currentDate = new Date()
        rssSource.lastEntryData.newestEntryDate = currentDate;

        var get = function(informationSource, callback) {
            var firstRssData = {title: "first", description: "first desc", link: "first.de", date: currentDate};
            var secondRssData = {title: "second", description: "second desc", link: "second.de", date: new Date(currentDate.getTime() + 60000)};
            callback(null, [firstRssData, secondRssData])
        };

        var dummyConnection = {get: get};
        var callback = function(entries) {
            entries.should.have.length(1);
            done();
        };

        var rssConnector = new RssConnector(dummyConnection);
        rssConnector.getNewestEntries(rssSource, callback);
    });
});