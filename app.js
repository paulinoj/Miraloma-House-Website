
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var departuretimes = require('./routes/departuretimes');
var http = require('http');
var path = require('path');
var entries = require('./routes/entries');
var transportation = require('./routes/transportation');
var eating = require('./routes/eating');
var entertainment = require('./routes/entertainment');
var neighborhood = require('./routes/neighborhood');
var television = require('./routes/television');
var sanitizeHTML = require('sanitize-html');
var validate = require('./lib/middleware/validate');
var messages = require('./lib/messages');
var app = express();


// all environments

app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('fdSA 8973 rjfsJ 3434 KjMp'));
app.use(express.session());
app.use(messages);

app.use(function(req, res, next) {
	res.locals.page = req.url;
	next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/transportation', transportation.transportation);
app.get('/eating', eating.eating);
app.get('/entertainment', entertainment.entertainment);
app.get('/neighborhood', neighborhood.neighborhood);
app.get('/television', television.television);
app.get('/departuretimes', departuretimes.departureTimes);

app.get('/post', entries.form);

app.post('/post', 
		  validate.required('entry[title]'),
		  validate.lengthAbove('entry[title]', 4),
		  entries.submit);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


