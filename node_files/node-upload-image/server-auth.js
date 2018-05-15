var express = require('express');
var app = express();
var session = require('express-session');

app.use(session({
 secret: '4hm4d-4rd1an5y4h-n0od3',
 resave: true,
 saveUninitialized: true
}));

var auth = (req, res, next) => {
 if(req.session && req.session.user === "ardi" && req.session.admin)
  return next();
 else
  return res.sendStatus(401);
};

app.get('/login', (req, res, next) => {
 if(!req.query.username && !req.query.password){
  res.send('login failed!');
 }
 else if(req.query.username === "ardi" && req.query.password === "ardiansyah"){
  req.session.user = "ardi";
  req.session.admin = true;
  res.send('login successfully!');
 }
});

app.get('/logout', (req, res, next) => {
 req.session.destroy();
 res.send('logout session!');
});

app.get('/content', auth, (req, res) => {
 res.send('you can only see this page after you have logged in');
});

app.listen(3000, () => {
 console.log('web page run on port 3000');
});
