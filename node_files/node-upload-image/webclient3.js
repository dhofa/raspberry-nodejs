var io = require('socket.io-client');
var socket = io.connect('https://trackcar.herokuapp.com/');

socket.on('statuslampu', (data)=>{
 console.log('status lampu: ', data.msg);
});
