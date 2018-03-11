'use strict';

var express       = require('express'),
    app           = express(),
    mongojs       = require('mongojs'),
    bodyParser    = require('body-parser'),
    passport      = require('passport'),
    cookieParser  = require('cookie-parser'),
    session       = require('express-session'),
    flash         = require('connect-flash'),
    db            = mongojs('hack'),
    port          = 9000;

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

app.listen(port, function() {
    console.log('%s: Server started in %s...',
        Date(Date.now()), port);
});
