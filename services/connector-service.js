/**
 * Created by jonas on 18.05.14.
 */

var ConnectorService = function() {

    function createTwitterConnector() {
        var TwitterConnector = require('../connectors/twitter-connector');
        var twitterConfig = { accessToken: process.env.TWITTER_ACCESS_TOKEN || "local",
            accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || "local",
            consumerKey: process.env.TWITTER_CONSUMER_KEY || "local",
            consumerKeySecret: process.env.TWITTER_CONSUMER_SECRET || "local" };
        return new TwitterConnector(twitterConfig);
    }

    function createRssConnector() {
        var RssConnector = require('../connectors/rss-connector');
        return new RssConnector();
    }

    function createRedditConnector() {
        var RedditConnector = require('../connectors/reddit-connector');
        return new RedditConnector();
    }

    this.getConnectors = function() {
        return {"REDDIT": createRedditConnector(),
            "RSS": createRssConnector(),
            "TWITTER": createTwitterConnector()};
    };
};

module.exports = ConnectorService;