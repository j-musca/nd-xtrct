/**
 * Created by jonas on 01.05.14.
 */
var RssConnector = function() {
    var http = require("http");
    var rssParser = require("fast-feed");

    this.getNewestEntries = function(informationSource, callback) {
        var url = informationSource.connectionData.url;

        http.get(url, function(response) {
            var result = "";

            response.on("data", function (chunk) {
                result += chunk;
            });

            response.on("end", function () {
                rssParser.parse(result, function(error, feed) {
                    if (error) {
                        console.log("Error during rss read: " + error);
                        transformToEntries(informationSource, [], callback);
                    } else {
                        var entries = getNewEntries(feed.items, informationSource);
                        console.log("Got " + entries.length + " new entries for source " + informationSource.name);
                        transformToEntries(informationSource, entries, callback);
                        updateInformationSource(informationSource, entries);
                    }
                });
            });

            response.on("error", function (error) {
                console.log("Error during rss read: " + error);
                callback([]);
            });
        });

        function getNewEntries(entries, informationSource) {
            var newestDate = informationSource.lastEntryData.newestEntryDate;

            if (newestDate !== null) {
                return entries.filter(function(entry) {
                    return entry.date > newestDate;
                });
            } else {
                return entries;
            }
        }

        function findNewestEntryDate(newestDate, currentEntry) {
            if (newestDate === null) {
                newestDate = currentEntry.date
            } else {
                newestDate = (newestDate > currentEntry.date ? newestDate : currentEntry.date)
            }

            return newestDate;
        }

        function transformToEntries(informationSource, rssEntries, callback) {
            var Entry = require("../models/entry");
            var entries = rssEntries.map( function(rssEntry) {
                return Entry.createEntryFromRss(rssEntry, informationSource)
            });
            callback(entries);
        }

        function updateInformationSource(informationSource, entries) {
            var InformationSource = require("../models/information-source");
            var newestEntryDate = entries.reduce(findNewestEntryDate, informationSource.lastEntryData.newestEntryDate);

            InformationSource.model.update({ _id: informationSource.id }, { $set: { lastEntryData: {"newestEntryDate": newestEntryDate } }}, function(error) {
                if (error) {
                    console.log("Could not update information source: " + informationSource.name + " | Error: " +  error);
                } else {
                    console.log("Updated information source: " + informationSource.name);
                }
            });
        }
    };
};

module.exports = RssConnector;


  
