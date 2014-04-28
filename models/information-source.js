/**
 * Created by jonas on 21.04.14.
 */

var InformationSource = function() {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var informationSourceSchema = new Schema({
        name: String,
        connectionData: Schema.Types.Mixed,
        lastEntryData: Schema.Types.Mixed,
        type: String
    });

    var _model = mongoose.model('informationSources', informationSourceSchema);

    function _createTwitterSource(name, slug, ownerName) {
        return new _model({ name: name,
            connectionData: { slug: slug, ownerName: ownerName },
            lastEntryData: { tweetId: null },
            type: "TWITTER" })
    }

    function _createRssSource(name, url) {
        return new _model({ name: name,
            connectionData: { url: url },
            lastEntryData: { newestEntryDate: null },
            type: "RSS" })

    }

    function _createRedditSource(name, subRedditName) {
        return new _model({ name: name,
            connectionData: { subRedditName: subRedditName },
            lastEntryData: { newestEntryDate: null },
            type: "REDDIT" })
    }

    function _getInformationSources(callback) {
        _model.find({}).exec(callback);
    }

    return {
        schema: informationSourceSchema,
        model: _model,
        createTwitterSource: _createTwitterSource,
        createRssSource: _createRssSource,
        createRedditSource: _createRedditSource,
        getInformationSources: _getInformationSources
    }
}();

module.exports = InformationSource;