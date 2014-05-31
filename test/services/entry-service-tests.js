/**
 * Created by jonas on 25.05.14.
 */

var should = require("should");
var EntryService = require("../../services/entry-service");
var Entry = require("../../models/entry");
var InformationSource = require("../../models/information-source");

describe("A entry service", function() {

    afterEach(function(done) {
        InformationSource.model.remove({}, function() {
            Entry.model.remove({}, function() {
                done();
            });
        });
    });

    it("can be created", function(done) {
        var entryService = new EntryService();
        entryService.should.not.be.null;
        done();
    });

    it("can save a list of entries", function(done) {
        var entryService = new EntryService();
        var callback = entryService.saveEntries;

        var rssSource = InformationSource.createRssSource("rss", "http://link.de");

        rssSource.save(addEntry);

        function addEntry(error, savedRssSource) {
            if (error) {
                return done(error);
            } else {
                rssSource = savedRssSource;
                var rssData = {title:"Amazing news", link:"http://link.de", summary:"This is the summary!"};
                var rssEntry = Entry.createEntryFromRss(rssData, savedRssSource);
                var testCallback = function(entry) {
                    entry.should.have.property("source", rssSource._id);
                    done();
                };

                callback([rssEntry], testCallback);
            }
        }
    });
});
