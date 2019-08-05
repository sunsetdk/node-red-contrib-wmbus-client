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

     




        this.debug("wmbus-client config node started at " + this.serielport);
    }
    RED.nodes.registerType("wmbus-dongle", wmbusdongle);
    // Make all the available types accessible for the node's config screen. The html runs on the client, but the host must look for the ports. So scan the ports and return JSON
    RED.httpAdmin.get('/wmbus-client/:cmd',  function (req, res) {
        var node = RED.nodes.getNode(req.params.id);

        if (req.params.cmd === "comports") {

            var SerialPort = require('serialport');

            var portNames = [];
            SerialPort.list(function (err, ports) {

                ports.forEach(function (port) {
                    portNames.push({
                        comName: port.comName,
                        manufacturer: port.manufacturer
                    });
                    //portNames.push(port.comName);
                    //console.log(port.manufacturer);
                });
                // return the port : manufacture for each device found
                res.json(portNames);
            });
            

        }
    });
}
