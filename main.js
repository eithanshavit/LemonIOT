var Parse = require('parse').Parse;
var os = require('os');
require('./config');
var nconf = require('nconf');

var hostname = os.hostname();

Parse.initialize("VFYr9LGA1q4Bop4970er5xi97ApHCNc9KsWorTXV", "J5wTOcSlZ2wZXDaAPQVP78x9vBdLScZBRrW3glSQ");

if(nconf.get('ENV') !== "dev") {
  var Edison = require("edison-io");
  var five = require("johnny-five");
  var board = new five.Board({ io: new Edison() });
  var led = new five.Led(3);
}

var BlinkRate = Parse.Object.extend("BlinkRate");

function registerDevice() {
  var query = new Parse.Query(BlinkRate);
  query.equalTo("hostname", hostname);
  query.find().then(function(blinkRates) {
    if(blinkRates.length === 0) {
      var blinkRate = new BlinkRate();
      blinkRate.set("hostname", hostname);
      blinkRate.set("rate", 42);
      return blinkRate.save(null);
    } else if(blinkRates.length === 1) {
      return null;
    } else {
      console.error("Found multiple rates for", hostname);
      return null;
    }
  }).then(function(blinkRate) {
    if(blinkRate) {
      console.log("Successfully registered", hostname);
    }
  }, function(error) {
    console.error("Failed to register", hostname, error.message);
  });
}

function configureLed(rate) {
  if(board) {
    led.blink(rate);
  }
}

var currentRate = null;
function setRate(newRate) {
  if(currentRate !== newRate) {
    console.log("Hostname", hostname, "new blink rate", newRate);
    configureLed(newRate);
    currentRate = newRate;
  }
}

function fetchRate() {
  var query = new Parse.Query(BlinkRate);
  query.equalTo("hostname", hostname);
  query.find({
    success: function(results) {
      var result = results[0];
      if(!result) {
        console.error("Could not find rate for", hostname);
        return;
      }
      var newRate = result.get('rate');
      setRate(newRate);
    },
    error: function(error) {
      console.log("Error:", error.code, error.message);
    }
  });
}

function main() {
  registerDevice();
  setInterval(fetchRate, 1000);
}

main();
