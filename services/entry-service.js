/**
 * Created by jonas on 25.05.14.
 */

var EntryService = function() {

    /*
     * Callback parameter is optional -> mainly for test purposes.
     */
    this.saveEntries = function (entries, callback) {
        entries.forEach(function (entry) {
            entry.save(function (error, entryDocument) {
                if (error) {
                    console.log("Could not save " + entryDocument);
                }
                if (callback !== undefined && callback !== null) {
                    callback(entryDocument);
                }
            });
        });
    }
};

module.exports = EntryService;