/**
 * Created by jonas on 01.05.14.
 */
var RedditConnector = function() {
    var reddit = require("redwrap");

    this.getNewestEntries = function(informationSource, callback) {
        var subRedditName = informationSource.connectionData.subRedditName;

        reddit.r(subRedditName, function(error, data, response) {
            if (error) {
                console.log("Error during reddit read: " + error);
                transformToEntries(informationSource, [], callback);
            } else {
                var entries = getNewEntries(data["data"]["children"], informationSource);
                console.log("Got " + entries.length + " new entries for source " + informationSource.name);
                transformToEntries(informationSource, entries, callback);
                updateInformationSource(informationSource, entries);
            }
        });

        function getNewEntries(entries, informationSource) {
            var utcTimestamp = informationSource.lastEntryData.newestEntryUTCTimestamp;

            if (utcTimestamp !== null) {
                return entries.filter(function(entry) {
                    return entry.created_utc > utcTimestamp;
                });
            } else {
                return entries;
            }
        }

        function findNewestEntryTimestamp(newestTimestamp, currentEntry) {
            if (newestTimestamp === null) {
                newestTimestamp = currentEntry.data.created_utc;
            } else {
                newestTimestamp = newestTimestamp > currentEntry.data.created_utc ? newestTimestamp : currentEntry.data.created_utc;
            }

            return newestTimestamp;
        }

        function transformToEntries(informationSource, redditEntries, callback) {
            var Entry = require("../models/entry");
            var entries = redditEntries.map( function(redditEntry) {
                return Entry.createEntryFromReddit(redditEntry, informationSource)
            });
            callback(entries);
        }

        function updateInformationSource(informationSource, entries) {
            var InformationSource = require("../models/information-source");
            var newestEntryUTCTimestamp = entries.reduce(findNewestEntryTimestamp, informationSource.lastEntryData.newestEntryUTCTimestamp);

            InformationSource.model.update({ _id: informationSource.id }, { $set: { lastEntryData: {"newestEntryUTCTimestamp": newestEntryUTCTimestamp } }}, function(error) {
                if (error) {
                    console.log("Could not update information source: " + informationSource.name + " | Error: " +  error);
                } else {
                    console.log("Updated information source: " + informationSource.name);
                }
            });
        }
    };
};

module.exports = RedditConnector;

  
