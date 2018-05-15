const myRoutes = require('./routes');

module.exports = function (app, db){
	myRoutes(app,db);
}