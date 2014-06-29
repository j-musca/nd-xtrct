/**
 * Created by jonas on 14.06.14.
 */

var TwitterConnection = function(twitterConfig) {
    var Twit = require("twit");

    var twitterClient = new Twit({
        consumer_key: twitterConfig.consumerKey,
        consumer_secret: twitterConfig.consumerKeySecret,
        access_token: twitterConfig.accessToken,
        access_token_secret: twitterConfig.accessTokenSecret
    });

    this.get = function(informationSource, callback) {
        var slug = informationSource.connectionData.slug;
        var owner = informationSource.connectionData.ownerName;
        var params = {"slug": slug, "owner_screen_name": owner, "include_entities": true};

        if (informationSource.lastEntryData.tweetId !== null) {
            params["since_id"] = informationSource.lastEntryData.tweetId
        }

        twitterClient.get("lists/statuses", params, function(error, entries) {
            callback(error, entries);
        });
    };
};

module.exports = TwitterConnection;