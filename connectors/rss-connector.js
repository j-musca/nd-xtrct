/**
 * Created by jonas on 01.05.14.
 */
var RssConnector = function(rssConnection) {
    var connection = rssConnection;

    this.getNewestEntries = function(informationSource, processingCallback) {
        connection.get(informationSource, handleResponse);

        function handleResponse(error, rssEntries) {
            if (error) {
                console.log("Error during rss read: " + error);
                transformToEntries(informationSource, [], processingCallback);
            } else {
                var entries = getNewEntries(rssEntries, informationSource);
                console.log("Got " + entries.length + " new entries for source " + informationSource.name);
                transformToEntries(informationSource, entries, processingCallback);
                updateInformationSource(informationSource, entries);
            }
        }

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


  
