var Gpio = require('onoff').Gpio;
var LED = new Gpio(4, 'out');
var intervalBlink = setInterval(blinkLED, 1000);

function blinkLED(){
	if(LED.readSync() === 0){
		LED.writeSync(1);
	}
	else{
		LED.writeSync(0);
	}
}

function endBlink(){
	clearInterval(intervalBlink);
	LED.writeSync(0);
	LED.unexport();
}

setTimeout(endBlink, 5000);
