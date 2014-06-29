/**
 * Created by jonas on 18.05.14.
 */

var should = require("should");
var ReaderService = require("../../services/reader-service");
var InformationSource = require("../../models/information-source");

describe("A reader service", function() {

    afterEach(function(done) {
        InformationSource.model.remove({}, function() {
            done();
        });
    });

    it("can be created", function(done) {
        var readerService = new ReaderService({});
        readerService.should.not.be.null;
        done();
    });

    it("can return an empty list if no connector is found", function(done) {
        var readerService = new ReaderService({});

        var callback = function(entries) {
            entries.should.be.empty;
            done();
        };

        var twitterSource = InformationSource.createTwitterSource("twitter", "slug", "ownerName");

        twitterSource.save(function(error, model) {
            if (error) {
                return done(error);
            } else {
                readerService.readEntries(callback);
            }
        });
    });

    it("can return a list of entries if a connector is found", function(done) {
        var dummyGetNewestEntries = function(informationSource, callback) {
            callback([1,2,3])
        };

        var dummyConnector = {getNewestEntries: dummyGetNewestEntries};

        var readerService = new ReaderService({"TWITTER": dummyConnector});

        var callback = function(entries) {
            entries.should.have.length(3);
            done();
        };

        var twitterSource = InformationSource.createTwitterSource("twitter", "slug", "ownerName");

        twitterSource.save(function(error, model) {
            if (error) {
                return done(error);
            } else {
                readerService.readEntries(callback);
            }
        });
    });
});