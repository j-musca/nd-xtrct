/**
 * Created by jonas on 17.05.14.
 */

var Job = function (intervalInSeconds, service) {

    var second = 1000;
    var intervalInMilliseconds = intervalInSeconds * second;
    var intervalObject = null;
    var callbackFunction = function() {
        console.log("Start service as job.");
        service.startService()
    };

    this.startJob = function() {
        if (intervalObject == null) {
            intervalObject = setInterval(callbackFunction, intervalInMilliseconds);
        }
    };

    this.stopJob = function() {
        if (intervalObject != null) {
            clearInterval(intervalObject);
            intervalObject = null;
        }
    };
};

module.exports = Job;
