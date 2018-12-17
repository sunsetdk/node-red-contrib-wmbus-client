# node-red-contrib-wmbus-client
A node for getting data wirelessly from a Kamstrup 21 water meter

## Introduction

## Installation
```
cd $HOME/.node-red
npm install node-red-contrib-wmbus-client
```
Restart Node-RED.

## Nodes
### wmbus-dongle config node
Setup the type of dongle to use, currently 2 different onces are supported. Imst iM871A-USB and Amber AMB8465-M. It might also work with other Amber modules.
Set the comport assigned to the wmbus dongle.


### kamstrup21
Setup the the node with the serial number as seen on the device and the AES key for the meter (supplied with the meter if bought, might be give by the water company if installed by them). The timeout is used to set the status of the node if no messages ie recieved for that amount of time.

It will start by looking for a node which match the serial number supplied. When found it will transmit the packages recieved from the meter. These are send every 16th second.

Output looks like this:
```
{
	"currentValue":123.4,
	"monthStartValue":120.2,
	"meterDry": false,
	"dryDuration": 0 hours,
	"reverseFlow": false,
	"reverseDuration": 1-8 hours,
	"burst": false,
	"burstDuration": 0 hours,
	"leak": false,
	"leakDuration": ≥505 hours,
	"name": kamstrup21
}
```

_currentValue_ is the instant value which can be read from the meter display.
_monthStartValue_ is the meter reading at the beginning of the month.
_meterDry_ is set if the meter is currently with out water.
_reverseFlow_ is set if the water is flowing the wrong way.
_burst_ is set if the flow is very high for a relative short time.
_leak_ is set if a constant flow has been going on for a long time.
_name_ is the name of the node.

_xxxxDuration_ lets you know for for how long with in the last 30 days an info has been present. This comes in the following intervals.
```
	0 hours
	1-8 hours
	9-24 hours
	25-72 hours
	73-168 hours
	169-336 hours
	337-504 hours
	≥505 hours
```

### hummie1
This is a custom made node for which the source will be relased upon final design.

Setup the the node with the serial number as programmed into the device. The timeout is used to set the status of the node if no messages ie recieved for that amount of time.

It will start by looking for a node which match the serial number supplied. When found it will transmit the packages recieved from the meter.

Output looks like this:
```
{
	"temperature":22.5,
	"humidity":54,
	"batteryLevel": 2.7,
	"name": hummie1
}
```

_temperature_ is the current temperature in celsius.
_humidity_ is the current relative humidity in percent.
_batteryLevel_ is the current battery voltage.
_name_ is the name of the node.
