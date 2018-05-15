var exec = require('child_process').exec;

exec('sudo systemctl stop gps-python.service', (err, stout, sterr) => {
 console.log('stout: ', stout);
 console.log('sterr: ', sterr);
 if(err !== null){
  console.log('exec error: ', err);
 }
});
