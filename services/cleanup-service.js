/**
 * Created by jonas on 30.06.14.
 */

var CleanupService = function() {

    this.startService = function() {
        this.removeOldEntries();
    };

    this.removeOldEntries = function() {
        require('date-utils');
        var Entry = require("../models/entry");


    };
};

module.exports = CleanupService;
