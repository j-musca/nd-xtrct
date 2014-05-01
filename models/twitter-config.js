/**
 * Created by jonas on 01.05.14.
 */


var TwitterConfig = function() {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var twitterConfigSchema = new Schema({
        consumerKey: String,
        consumerSecret: String,
        accessToken: String,
        accessTokenSecret: String
    });

    var _model = mongoose.model('twitterConfigs', twitterConfigSchema);

    function updateConfig(config, data, callback) {
        config.consumerKey = data.consumerKey;
        config.consumerSecret = data.consumerSecret;
        config.accessToken = data.accessToken;
        config.accessTokenSecret = data.accessTokenSecret;

        config.save(callback);
    }

    function _save(data, callback) {
        _getTwitterConfig( function(error, config) {
            if (config === null) {
                config = new _model;
            }

            updateConfig(config, data, callback);
        });
    }

    function _getTwitterConfig(callback) {
        _model.findOne({}).exec(callback);
    }

    return {
        schema: twitterConfigSchema,
        model: _model,
        save: _save,
        getTwitterConfig: _getTwitterConfig
    }
}();

module.exports = TwitterConfig;
