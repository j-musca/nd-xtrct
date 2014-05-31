/**
 * Created by jonas on 25.04.14.
 */

var Entry = function() {
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var entrySchema = new Schema({
        title: String,
        content: String,
        link: String,
        creationDate: Date,
        collectionDate: Date,
        source: { type: Schema.ObjectId, ref: "informationSources" }
    });

    var _model = mongoose.model("entries", entrySchema);

    function _createEntryFromTwitter(tweetEntry, source) {
        return new _model({ title: tweetEntry.user.name,
            content: tweetEntry.text,
            link: "https://twitter.com/" + tweetEntry.user.screen_name + "/status/" + tweetEntry.id_str,
            creationDate: new Date(tweetEntry.created_at),
            collectionDate: new Date(),
            source: source
        })
    }

    function _createEntryFromRss(rssEntry, source) {
        return new _model({ title: rssEntry.title,
            content: rssEntry.description,
            link: rssEntry.link,
            creationDate: rssEntry.date,
            collectionDate: new Date(),
            source: source })

    }

    function _createEntryFromReddit(redditEntry, source) {
        redditEntry = redditEntry.data;
        var title = redditEntry.title + " (" + redditEntry.domain + ")";
        var creationDate = new Date((redditEntry.created_utc + (60 * 60 * 5)) * 1000);
        var content = title;
        if (redditEntry.selftext !== "") {
            content = redditEntry.selftext;
        } else if (redditEntry.thumbnail !== "default") {
            content = "<img src='" + redditEntry.thumbnail + "' />"
        }

        content += "<br/><a href='" + redditEntry.url + "'>Link zum Inhalt</a>"

        var link = "http://reddit.com" + redditEntry.permalink;

        return new _model({ title: title,
            content: content,
            link: link,
            creationDate: creationDate,
            collectionDate: new Date(),
            source: source })
    }

    function _getEntrys(callback) {
        getEntriesWithParams({}, callback);
    }

    function _getEntrysAfterCollectionDate(collectionDate, callback) {
        getEntriesWithParams({ collectionDate: { $gte: collectionDate } }, callback);
    }

    function getEntriesWithParams(params, callback) {
        var InformationSource = require("./information-source");

        InformationSource.getInformationSources(function (error, informationSources) {
            if (error) {
                console.log("Could not load information sources for entries.")
            } else {
                var mappedInformationSources = {};

                informationSources.forEach(function(informationSource) {
                    mappedInformationSources[informationSource.id] = informationSource;
                });

                _model.find(params).exec(function(error, entries) {
                    if (error) {
                        callback(error, entries);
                    } else {
                        var entriesWithSources = entries.map(function(entry) {
                            return {"entry": entry, "source": mappedInformationSources[entry.source]};
                        });
                        callback(error, entriesWithSources);
                    }
                });
            }
        });

    }

    return {
        schema: entrySchema,
        model: _model,
        createEntryFromTwitter: _createEntryFromTwitter,
        createEntryFromRss: _createEntryFromRss,
        createEntryFromReddit: _createEntryFromReddit,
        getEntries: _getEntrys,
        getEntriesAfterCollectionDate: _getEntrysAfterCollectionDate
    }
}();

module.exports = Entry;
