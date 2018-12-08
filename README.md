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
Setup the the node with the serial number as seen on the device and the AES key for the meter (supplied with the meter if bought, might be give by the water company if installed by them).

It will start by looking for a node which match the serial number supplied. When found it will transmit the packages recieved from the meter. These are send every 16th second.

Output looks like this:
```
{
	"CurrentValue":123.4,
	"MonthStartValue":120.2,
	"MeterDry": false,
	"DryDuration": 0 hours,
	"ReverseFlow": false,
	"ReverseDuration": 1-8 hours,
	"Burst": false,
	"BurstDuration": 0 hours,
	"Leak": false,
	"LeakDuration": ≥505 hours
}
```

_CurrentValue_ is the instant value which can be read from the meter display.
_MonthStartValue_ is the meter reading at the beginning of the month.
_MeterDry_ is set if the meter is currently with out water.
_ReverseFlow_ is set if the water is flowing the wrong way.
_Burst_ is set if the flow is very high for a relative short time.
_Leak_ is set if a constant flow has been going on for a long time.

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
