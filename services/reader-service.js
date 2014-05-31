/**
 * Created by jonas on 18.05.14.
 */

var ReaderService = function(connectors, defaultCallback) {

    this.startService = function() {
        this.readEntries(defaultCallback);
    };

    this.readEntries = function(callback) {
        var InformationSource = require("../models/information-source");
        InformationSource.getInformationSources(function (error, informationSources) {
            if (error) {
                console.log("Could not load information sources: " + error);
            } else {
                informationSources.forEach(function (informationSource) {
                    var connector = connectors[informationSource.type] || null;

                    if (connector !== null) {
                        connector.getNewestEntries(informationSource, callback);
                    } else {
                        console.log("No connector found for type: " + informationSource.type);
                        callback([])
                    }
                });
            }
        });
    };
};

module.exports = ReaderService;








