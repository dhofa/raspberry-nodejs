var express = require('express');
var multer = require('multer');
var app = express();

var storage = multer.diskStorage({
 destination: (req, file, callback) => {
  callback(null, './uploads');
 },
 filename: (req, file, callback) => {
  var pecah = file.originalname.split('.');
  callback(null, file.fieldname + '-' + Date.now() + '.' + pecah[pecah.length-1]);
 }
});

var upload = multer({
 storage: storage
}).single('userPhoto');

app.get('/', (req, res, next) => {
 res.sendFile(__dirname + '/index.html');
});

app.post('/api/photo', (req, res, next) => {
 upload(req, res, (err) => {
  if(err){
   return res.end("error uploading file");
  }
  res.end("file uploaded");
 });
});

app.listen(3000, () => {
 console.log('working on port 3000');
});
