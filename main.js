var Edison = require("edison-io");
var five = require("johnny-five");
var Parse = require('parse').Parse;

Parse.initialize("VFYr9LGA1q4Bop4970er5xi97ApHCNc9KsWorTXV", "J5wTOcSlZ2wZXDaAPQVP78x9vBdLScZBRrW3glSQ");

var board = new five.Board({
  io: new Edison()
});

board.on("ready", function() {
  var led = new five.Led(3);
  led.blink(1000);
});
