/**
 * Created by jonas on 01.05.14.
 */

var TwitterConnector = function(twitterConnection) {
    var connection = twitterConnection;

    this.getNewestEntries = function(informationSource, processingCallback) {
        connection.get(informationSource, handleResponse);

        function handleResponse(error, entries) {
            if (error) {
                console.log("Error during twitter read: " + error);
                transformToEntries(informationSource, [], processingCallback);
            } else {
                console.log("Got " + entries.length + " new entries for source " + informationSource.name);
                transformToEntries(informationSource, entries, processingCallback);
                updateInformationSource(informationSource, entries);
            }
        }

        function findMaxId(newestId, currentEntry) {
            if (newestId === null) {
                newestId = currentEntry.id;
            } else {
                newestId = newestId > currentEntry.id ? newestId : currentEntry.id;
            }

            return newestId;
        }

        function transformToEntries(informationSource, twitterEntries, callback) {
            var Entry = require("../models/entry");
            var entries = twitterEntries.map( function(twitterEntry) {
                return Entry.createEntryFromTwitter(twitterEntry, informationSource)
            });
            callback(entries);
        }

        function updateInformationSource(informationSource, entries) {
            var InformationSource = require("../models/information-source");
            var tweetId = entries.reduce(findMaxId, informationSource.lastEntryData.tweetId);

            InformationSource.model.update({ _id: informationSource.id }, { $set: { lastEntryData: {"tweetId": tweetId } }}, function(error) {
                if (error) {
                    console.log("Could not update information source: " + informationSource.name + " | Error: " +  error);
                } else {
                    console.log("Updated information source: " + informationSource.name);
                }
            });
        }
    };
};

module.exports = TwitterConnector;