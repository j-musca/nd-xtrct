/**
 * Created by jonas on 14.06.14.
 */

var RedditConnection = function() {
    var reddit = require("redwrap");

    this.get = function(informationSource, callback) {
        var subRedditName = informationSource.connectionData.subRedditName;

        reddit.r(subRedditName, function(error, data, response) {
            callback(error, data["data"]["children"]);
        });
    };
};

module.exports = RedditConnection;