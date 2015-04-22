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
}

var BlinkRate = Parse.Object.extend("BlinkRate");
var query = new Parse.Query(BlinkRate);
query.equalTo("hostname", hostname);

function configureLed(rate) {
  if(board) {
    board.on("ready", function() {
      var led = new five.Led(3);
      led.blink(result.rate);
    });
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
  query.find({
    success: function(results) {
      var result = results[0];
      if(!result) {
        console.error("Could not find rate for ", hostname);
        return;
      }
      var newRate = result.get('rate');
      setRate(newRate);
    },
    error: function(error) {
      console.log("Error: " + error.code + " " + error.message);
    }
  });
}

setInterval(fetchRate, 1000);
