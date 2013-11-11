/**
 * Module dependencies.
 */
var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    , config = require('./config');

var app = express()


// all environments
app.set('port', process.env.PORT || config.port);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/share', routes.share.list);
app.post('/share', routes.share.add);
app.post('/share/:id/votes', routes.share.votes);
app.delete('/share/:id', routes.share.del);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
