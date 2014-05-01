/**
 * Created by jonas on 01.05.14.
 */

var TwitterConnector = function(twitterConfig) {
    this.Twit = require('twit');

    this.twitterClient = new this.Twit({
        consumer_key: twitterConfig.consumerKey,
        consumer_secret: twitterConfig.consumerSecret,
        access_token: twitterConfig.accessToken,
        access_token_secret: twitterConfig.accessTokenSecret
    });

    this.getNewestEntries = function(slug, owner, callback) {
        this.twitterClient.get('lists/statuses', { 'slug': slug, 'owner_screen_name': owner, 'include_entities': false, 'count': 2 }, function(error, entries) {
            callback(error, entries);
        });
    };
};

module.exports = TwitterConnector;