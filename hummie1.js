var wmbus = require('wmbus-client')

module.exports = function (RED) {

    //configure the node
    function initNode(node, config) {
        RED.nodes.createNode(node, config);
        //get the configuration
        let dongleConfig = RED.nodes.getNode(config.wmbusdongle);

        node.filterApplied = false;
        node.serialnumber = config.serialnumber;
        node.name = config.name||"hummie1";
        node.timeoutTime = config.timeout * 1000;
        node.meter = new wmbus.Hummie1Meter();

        //If nothing was configured then exit with false
        if (!dongleConfig) {
            node.debug("No config for wmbus");
            return false;
        }

        let client = dongleConfig.wmbusClient;

        client.on("connected", function () {
            node.status({ fill: "yellow", shape: "dot", text: "Applying filter for serial no: " + node.serialnumber });
        });

        client.on("disconnected", function () {
            node.status({ fill: "red", shape: "ring", text: "disconnected" });
        });

        client.on("error", function () {
            node.status({ fill: "red", shape: "dot", text: "Error connecting" });
        });

        client.on("data", function (telegram) {
            NewData(telegram, node.serialnumber, node);
        });


        //let all packages get handled by this meter
        node.meter.applySettings({
            disableMeterDataCheck: true
        });


        node.debug("Setup complete");
        return true;
    }
    /**
     * Function is used to bute swap a buffer. First byte becomes the last one
     * @param {any} buffer
     */
    function reverseBuffer(buffer) {
        let t = Buffer.alloc(buffer.length)
        for (let i = 0, j = buffer.length - 1; i <= j; ++i, --j) {
            t[i] = buffer[j];
            t[j] = buffer[i];
        }
        return t;
    }

    function NewData(telegram, serialNo, node) {
 
        //process the meter, if it can't be processed then exit
        if (!node.meter.processTelegramData(telegram))
            return;
        //Check if this package fits the serial number, if not find the first package which fits and use that as filter
        if (!node.filterApplied) {

            //Check if the serial number of this meter match the supplied, if yes then apply the filter
            var thisSerialNo = reverseBuffer(node.meter.getAddressField(telegram).slice(2, 6)).toString("hex");
            if (thisSerialNo == serialNo) {

                node.meter.applySettings({
                    disableMeterDataCheck: true,
                    filter: [node.meter.getAddressField(telegram).toString("hex")]
                });
                node.log("Found serial and applied filter.");
                
                node.filterApplied = true;
            }
            else {
                node.log(thisSerialNo + " is not the correct serial no for this node");
                return;
            }


        }
        //reset the timeout again
        clearTimeout(node.timeout);
        //set the current status
        node.status({ fill: "green", shape: "dot", text: "connected" });
        //set a timeout if 
        node.timeout = setTimeout(() => {
            node.status({ fill: "yellow", shape: "dot", text: "Timeout, no data" });
        }, node.timeoutTime);
        

        let temperature = node.meter.getMeterValue_temp(telegram);
        let humidity = node.meter.getMeterValue_hum(telegram);
        let battery = node.meter.getMeterValue_batt(telegram);
        
        //generate a payload
        let msg = {
            payload: {
                temperature: temperature,
                humidity: humidity,
                batteryLevel: battery,
                name: node.name
            }
        };
        //Send it
        node.send(msg);


    }

    function Hummie1Node(config) {
        //configure the node
        if (!initNode(this, config))
            return;

        this.on('close', function (removed, done) {
            if (removed) {
                // This node has been deleted
            } else {
                // This node is being restarted
            }
            done();
        });

    }
    RED.nodes.registerType("hummie1", Hummie1Node);


}
