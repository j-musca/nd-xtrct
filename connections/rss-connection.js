/**
 * Created by jonas on 14.06.14.
 */

var RssConnection = function() {
    var http = require("http");
    var rssParser = require("fast-feed");

    this.get = function(informationSource, callback) {
        var url = informationSource.connectionData.url;

        http.get(url, function(response) {
            var result = "";

            response.on("data", function (chunk) {
                result += chunk;
            });

            response.on("end", function () {
                rssParser.parse(result, function(error, feed) {
                    callback(error, feed.items);
                });
            });

            response.on("error", function (error) {
                console.log("Error during rss read: " + error);
                callback(error, []);
            });
        });
    };
};

module.exports = RssConnection;