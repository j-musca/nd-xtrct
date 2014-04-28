/**
 * Created by jonas on 24.04.14.
 */


var should = require("should");
var InformationSource = require("../../models/information-source");
var Entry = require("../../models/entry");

describe("Entry", function() {
    afterEach(function(done) {
        InformationSource.model.remove({}, function() {
            Entry.model.remove({}, function() {
                done();
            });
        });
    });

    it("can save a rss source", function(done){
        var rssSource = InformationSource.createRssSource("rss", "http://link.de");

        function addEntry(error, savedRssSource) {
            if (error) {
                return done(error);
            } else {
                rssSource = savedRssSource;
                var rssData = {title:"Amazing news", link:"http://link.de", summary:"This is the summary!"};
                var rssEntry = Entry.createEntryFromRss(rssData, savedRssSource);

                rssEntry.save(loadEntry);
            }
        }

        function loadEntry(error, rssEntry) {
            if (error) {
                return done(error);
            } else {
                rssEntry.should.have.property("source", rssSource._id);
                done();
            }
        }

        rssSource.save(addEntry);
    });
});