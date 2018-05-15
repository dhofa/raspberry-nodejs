var sc = require('socket.io-client')('https://trackcar.herokuapp.com/');

sc.on('connect', ()=>{
 console.log('connect to websocket');

 sc.on('statuslampu', (data)=>{
  console.log('status lampu: ', data.msg);
 });

 sc.on('statusgps', (data)=>{
  console.log('status gps: ', data.msg);
 });
});

sc.on('statuslampu', (data)=>{
 console.log('status lampu', data.msg);
});

sc.on('statusgps', (data)=>{
 console.log('status gps: ', data.msg);
});
