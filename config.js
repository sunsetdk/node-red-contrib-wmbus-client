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
}
