var wmbus = require('wmbus-client');

module.exports = function (RED) {

    function wmbusdongle(n) {
        //create a config node
        RED.nodes.createNode(this, n);
        //set the properties set on the UI
        this.serielport = n.serielport;
        this.dongletype = n.dongletype;

        this.wmbusClient = new wmbus.TelegramClient(this.dongletype, this.serielport);

        this.on("close", function () {
            this.wmbusClient.disconnect();
        });

        //var SerialPort = require('serialport')
        //SerialPort.list(function (err, ports) {
        //    console.log(node);
        //    ports.forEach(function (port) {
        //        node.append($('<option>' + port.comName + '- ' + port.manufacturer + '</option>').attr('value', port.comName));
        //        console.log('<option>' + port.comName + '- ' + port.manufacturer + '</option>');
        //    });
        //});




        this.debug("wmbus-client config node started at " + this.serielport);
    }
    RED.nodes.registerType("wmbus-dongle", wmbusdongle);
    // Make all the available types accessible for the node's config screen
    RED.httpAdmin.get('/wmbus-client/:cmd', /*RED.auth.needsPermission('unitconverter.read'),*/ function (req, res) {
        var node = RED.nodes.getNode(req.params.id);

        if (req.params.cmd === "comports") {

            var SerialPort = require('serialport');

            var portNames = [];
            SerialPort.list().then(function (ports) {

                ports.forEach(function (port) {
                    portNames.push({
                        comName: port.comName,
                        manufacturer: port.manufacturer
                    });
                    //portNames.push(port.comName);
                    //console.log(port.manufacturer);
                });
                res.json(portNames);
            })
            .catch(function(error){
                this.debug("Unable to get the list of the PORTS");
            });
            // Return a list of all available categories (mass, length, ...)
        }
    });
}
