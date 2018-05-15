
var io = require('socket.io-client');
//var sc = io.connect('https://rmvts.herokuapp.com/');
var sc = io.connect('http://192.168.8.100:3000');
var exec = require('child_process').exec;

sc.on('statuslampu', (data) => {
 if(data.msg == 1){
  console.log('status lampu: ', data.msg);
 }
 else{
  console.log('status lampu: ', data.msg);
 }
});

sc.on('takefoto', (data) => {
 console.log(data.msg);
 exec('raspistill -o /home/pi/'+data.msg+'.jpg', (err, stout, sterr) => {
  console.log('stout: ', stout);
  console.log('sterr: ', sterr);
  exec("curl -F file_foto=@/home/pi/"+data.msg+".jpg https://rmvts.herokuapp.com/images/upload", (err, stout, sterr) => {
   console.log('stout: ', stout);
   console.log('sterr: ', sterr);
  });
 });
});

sc.on('statusgps', (data) => {
 if(data.msg == 1){
  exec('sudo systemctl start gps-python.service', (err, stout, sterr) => {
   console.log('stout: ', stout);
   console.log('sterr: ', sterr);
   if(err !== null){
    console.log('exec error: ', err);
   }
  });
 }
 else{
  exec('sudo systemctl stop gps-python.service', (err, stout, sterr) => {
   console.log('stout: ', stout);
   console.log('sterr: ', sterr);
   if(err !== null){
    console.log('exec error: ', err);
   }
  });
 }
});
