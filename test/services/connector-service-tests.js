/**
 * Created by jonas on 18.05.14.
 */

var should = require("should");
var ConnectorService = require("../../services/connector-service");

describe("A connector service", function() {

    it("can be created", function(done) {
        var connectorService = new ConnectorService();
        connectorService.should.not.be.null;
        done();
    });

    it("can return a map of connectors", function(done) {
        var connectorService = new ConnectorService();
        var connectors = connectorService.getConnectors();
        connectors.should.not.be.null;
        done();
    });

    it("can return a map of connectors with three entries", function(done) {
        var connectorService = new ConnectorService();
        var connectors = connectorService.getConnectors();
        connectors.should.have.property("TWITTER");
        connectors.should.have.property("RSS");
        connectors.should.have.property("REDDIT");
        done();
    });

    it("can return a map of connectors with not-empty values", function(done) {
        var connectorService = new ConnectorService();
        var connectors = connectorService.getConnectors();
        connectors["TWITTER"].should.not.be.null;
        connectors["RSS"].should.not.be.null;
        connectors["REDDIT"].should.not.be.null;
        done();
    });
});
