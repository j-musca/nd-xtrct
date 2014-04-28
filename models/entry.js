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
        source: { type: Schema.ObjectId, ref: "informationSourceSchema" }
    });

    var _model = mongoose.model("entries", entrySchema);

    function _createEntryFromTwitter(tweet, source) {
        return new _model({ name: name,
            connectionData: { slug: slug, ownerName: ownerName },
            lastEntryData: { tweetId: null },
            type: "TWITTER" })
    }

    function _createEntryFromRss(rssEntry, source) {
        return new _model({ title: rssEntry.title,
            content: rssEntry.summary,
            link: rssEntry.link,
            creationDate: new Date(),
            source: source })

    }

    function _createEntryFromReddit(thread, source) {
        return new _model({ name: name,
            connectionData: { subRedditName: subRedditName },
            lastEntryData: { newestEntryDate: null },
            type: "REDDIT" })
    }

    function _getEntrys(callback) {
        _model.find({}).exec(callback);
    }

    return {
        schema: entrySchema,
        model: _model,
        createEntryFromTwitter: _createEntryFromTwitter,
        createEntryFromRss: _createEntryFromRss,
        createEntryFromReddit: _createEntryFromReddit
    }
}();

module.exports = Entry;
