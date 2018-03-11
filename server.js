'use strict';

var express       = require('express'),
    app           = express(),
    mongojs       = require('mongojs'),
    bodyParser    = require('body-parser'),
    passport      = require('passport'),
    cookieParser  = require('cookie-parser'),
    session       = require('express-session'),
    flash         = require('connect-flash'),
    ip            = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP   || '0.0.0.0',
    port          = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    mongoURL      = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = '';


if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
        mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
        mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
        mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
        mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
        mongoUser = process.env[mongoServiceName + '_USER'];

    if (mongoHost && mongoPort && mongoDatabase) {
        mongoURLLabel = mongoURL = 'mongodb://';
        if (mongoUser && mongoPassword) {
            mongoURL += mongoUser + ':' + mongoPassword + '@';
        }
        // Provide UI label that excludes user id and pw
        mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
        mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
    }
}

var db = mongojs(mongoURL);

require('./config/passport')(passport, db);

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(flash());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'smellycatsmellycat' }));
app.use(passport.initialize());
app.use(passport.session());

require('./app/dtbase.js')(app, db);
require('./app/routes.js')(app, passport, db);

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);
