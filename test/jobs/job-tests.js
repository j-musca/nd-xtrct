/**
 * Created by jonas on 17.05.14.
 */


var should = require("should");
var Job = require("../../jobs/job");

describe("A job", function() {

    it("can be started and stopped", function(done) {
        var counter = 0;
        var callback = function() {
            counter++;
            if (counter == 1) {
                job.stopJob();
                done();
            }
        };

        var job = new Job(1, {"startService": callback});

        job.startJob();
    });

    it("can run 3 seconds", function(done) {
        var threeSeconds = 3;
        var counter = 0;
        var callback = function() {
            counter++;
            if (counter == threeSeconds) {
                job.stopJob();
                var endTime = new Date();
                Math.round((endTime - startTime) / 1000).should.be.exactly(threeSeconds);
                done();
            }
        };

        var startTime = new Date();
        var job = new Job(1, {"startService": callback});

        job.startJob();
    });
});

