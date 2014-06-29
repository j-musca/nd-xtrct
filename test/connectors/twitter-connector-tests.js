/**
 * Created by jonas on 14.06.14.
 */

var should = require("should");
var TwitterConnector = require("../../connectors/twitter-connector");
var InformationSource = require("../../models/information-source");

describe("A twitter connector", function() {

    afterEach(function(done) {
        InformationSource.model.remove({}, function() {
            done();
        });
    });

    it("can be created", function(done) {
        var twitterConnector = new TwitterConnector({});
        twitterConnector.should.not.be.null;
        done();
    });

    it("can return a list of two entries if two entries are found", function(done) {
        var twitterSource = InformationSource.createTwitterSource("twitter", "slug", "ownerName");

        var get = function(informationSource, callback) {
            var firstTwitterData = {user: {name: "name", screen_name: "screenName"}, text: "text", id_str: "123", created_at: new Date().getTime()};
            var secondTwitterData = {user: {name: "name", screen_name: "screenName"}, text: "text", id_str: "123", created_at: new Date().getTime()};
            callback(null, [firstTwitterData, secondTwitterData])
        };

        var dummyConnection = {get: get};
        var callback = function(entries) {
            entries.should.have.length(2);
            done();
        };

        var twitterConnector = new TwitterConnector(dummyConnection);
        twitterConnector.getNewestEntries(twitterSource, callback);
    });

    it("can return an empty list of entries if an error occured", function(done) {
        var twitterSource = InformationSource.createTwitterSource("twitter", "some");

        var get = function(informationSource, callback) {
            var firstTwitterData = {user: {name: "name", screen_name: "screenName"}, text: "text", id_str: "123", created_at: new Date().getTime()};
            var secondTwitterData = {user: {name: "name", screen_name: "screenName"}, text: "text", id_str: "123", created_at: new Date().getTime()};
            callback("Some Error", [firstTwitterData, secondTwitterData])
        };

        var dummyConnection = {get: get};
        var callback = function(entries) {
            entries.should.be.empty;
            done();
        };

        var twitterConnector = new TwitterConnector(dummyConnection);
        twitterConnector.getNewestEntries(twitterSource, callback);
    });
});