var io = require('socket.io-client');
//var sc = io.connect('https://rmvts.herokuapp.com/');
var sc = io.connect('http://192.168.8.100:3000/');
var exec = require('child_process').exec;
var gpio = require('onoff').Gpio;
var Client = require('node-rest-client').Client;
var client = new Client();

//declare Pin untuk relay
var RELAY1   = new gpio(4, 'out');
var RELAY2   = new gpio(17,'out');
var RELAY3   = new gpio(27,'out');
var RELAY4   = new gpio(22,'out');
var ARUS     = new gpio(25,'in','both');

//declare vibration & buzzer sensor
var VIBRATION = new gpio(21,'in','both');
//var BUZZER    = new gpio();

//declare base URL API
const BASE_BUZZER    = "http://192.168.8.100:3000/api/log-buzzer/create";
const BASE_VIBRATION = "http://192.168.8.100:3000/api/log-vibration/create";
const BASE_IGNITION  = "http://192.168.8.100:3000/api/log-ignition/create";
//Base Relay
const RELAY_GPS      = "http://192.168.8.100:3000/api/update-relay/gps";
const RELAY_IGNITION = "http://192.168.8.100:3000/api/update-relay/ignition";
const RELAY_VIBRATION= "http://192.168.8.100:3000/api/update-relay/vibration";
const RELAY_BUZZER   = "http://192.168.8.100:3000/api/update-relay/buzzer";
const BASE_RELAY_STATE = "http://192.168.8.100:3000/api/get-relay-state/${id_user}";

//settup state relay from API
getStateRelay(BASE_RELAY_STATE,'5af166ddaf533a4b9c3fc0d6');


ARUS.watch(function(err, value){
 if(value == 1){
  console.log('Arus terdeteksi ');
 }else{
  console.log('tidak ada arus listrik ');
 }
});

sc.on('relay1', (data) => {
 if(data.msg){
  console.log('relay1 aktif : ', data.msg);
  RELAY1.writeSync(0);
  updateRelay(RELAY_BUZZER,true);
  createLogActivity(BASE_BUZZER,"Buzzer Notification", "Your Buzzer Already Running");

  //menjalankan alarm
  exec('sudo systemctl start buzzer.service', (err, stout, sterr) => {
   if(err !== null){
    console.log('exec error: ', err);
   }
  });
 }
 else{
  RELAY1.writeSync(1);
  console.log('relay1 aktif : ', data.msg);
  updateRelay(RELAY_BUZZER,false);
  createLogActivity(BASE_BUZZER,"Buzzer Notification", "Your Buzzer Turned Off");

  //menonaktifkan alarm
  exec('sudo systemctl stop buzzer.service', (err, stout, sterr) => {
   if(err !== null){
    console.log('exec error: ', err);
   }
  });
 }
});

sc.on('relay2', (data) =>{
 if(data.msg){
  RELAY2.writeSync(0);
  console.log('relay2 aktif : ', data.msg);
  updateRelay(RELAY_VIBRATION,true);

  i=0;
  VIBRATION.watch(function (err, value){
   if(value == 1){
    i++;
   }
   console.log('ada getaran gaes');

   if(i == 100){
    createLogActivity(BASE_VIBRATION,"Vibration Notification", "Vibration detected on your vehicle");
  }
  });

 }else{
  RELAY2.writeSync(1);
  console.log('relay2 aktif : ', data.msg);
  updateRelay(RELAY_VIBRATION,false);
 }

});

sc.on('relay3', (data) =>{
 if(data.msg){
  RELAY3.writeSync(1);
  console.log('relay3 aktif : ', data.msg);
  updateRelay(RELAY_IGNITION,true);
 }else{
  RELAY3.writeSync(0);
  console.log('relay3 aktif : ', data.msg);
  updateRelay(RELAY_IGNITION,false);
 }
});

sc.on('relay4', (data) =>{
 if(data.msg){
  RELAY4.writeSync(0);
  console.log('relay4 aktif : ', data.msg);
  updateRelay(RELAY_IGNITION,true);
 }else{
  RELAY4.writeSync(1);
  console.log('relay4 aktif : ', data.msg);
  updateRelay(RELAY_IGNITION,false);
 }
});


sc.on('ambilfoto', (data) => {
 console.log('menjalankan FOTO');

 exec('raspistill -o /home/pi/'+data.msg+'.jpg', (err, stout, sterr) => {
  console.log('stout: ', stout);
  console.log('sterr: ', sterr);
  //exec("curl -F file_foto=@/home/pi/"+data.msg+".jpg https://rmvts.herokuapp.com/api/images/upload", (err, stout, sterr) => {
  exec("curl -F file_foto=@/home/pi/"+data.msg+".jpg http://192.168.8.102:3000/api/images/upload", (err, stout, sterr) => {
   console.log('stout: ', stout);
   console.log('sterr: ', sterr);
  });
 });
});

sc.on('statusgps', (data) => {
 if(data.msg){
  console.log('menjalankan GPS');
  updateRelay(RELAY_GPS,true);
  exec('sudo systemctl start gps-python.service', (err, stout, sterr) => {
  // console.log('stout: ', stout);
  // console.log('sterr: ', sterr);
   if(err !== null){
    console.log('exec error: ', err);
    updateRelay(RELAY_GPS,false);
   }
  });
 }
 else{
  console.log('menghentikan GPS');
  updateRelay(RELAY_GPS,false);
  exec('sudo systemctl stop gps-python.service', (err, stout, sterr) => {
  // console.log('stout: ', stout);
  // console.log('sterr: ', sterr);
   if(err !== null){
    console.log('exec error: ', err);
   }
  });
 }
});


function updateRelay(url, status){
  var args = {
   data: { state: status },
   headers: { "Content-Type": "application/json" }
  };

  client.post(url, args, function (data, response) {
    //console.log(response);
  });
}


function createLogActivity(url,title,message){
  var args = {
    data: { title: title, detail: message },
    headers: { "Content-Type": "application/json" }
  };

  client.post(url, args, function (data, response) {
    //console.log(response);
    console.log("Berhasil "+message);
  });
}



function getStateRelay(url,id_user){
  var args = {
    path: { "id_user": id_user},
    headers: { "Content-Type": "application/json" }
  };

  client.get(url, args, function (data, response) {
//    console.log("state relay ",response);
    console.log("state relay data ",data);
//    console.log("state relay "+data.vibration);
//    console.log("state relay "+data.buzzer);
    if(data.ignition){
     RELAY3.writeSync(1);
    }else{
     RELAY3.writeSync(0);
    }

    if(data.buzzer){
     RELAY1.writeSync(0);
    }else{
     RELAY1.writeSync(1);
    }

    if(data.vibration){
     RELAY2.writeSync(0);
    }else{
     RELAY2.writeSync(1);
    }

    RELAY4.writeSync(1);
  });
}
