/*
 Base - servidor v1.0
 2016 Nilton Cruz
 */

'use strict';

var express      = require('express'),
    app          = express(),
    mongojs      = require('mongojs'),
    bodyParser   = require('body-parser'),
    passport     = require('passport'),
    cookieParser = require('cookie-parser'),
    session      = require('express-session'),
    flash        = require('connect-flash'),
    ipaddress    = process.env.OPENSHIFT_NODEJS_IP,
    porta        = process.env.OPENSHIFT_NODEJS_PORT || 8080,
    conexao;


if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    conexao = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

var db = mongojs(conexao);

require('./config/passport')(passport, db);

app.use(express.static('public'));
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


var terminator = function(sig){
    if (typeof sig === "string") {
        console.log('%s: Received %s - terminating sample app ...',
            Date(Date.now()), sig);
        process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()) );
};

var setupTerminationHandlers = function(){
    //  Process on exit and signals.
    process.on('exit', function() { terminator(); });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
        'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
};

setupTerminationHandlers();


require('./app/dtbase.js')(app, db);
require('./app/routes.js')(app, passport, db);

app.listen(porta, ipaddress, function() {
    console.log('%s: Servidor iniciado em %s:%d ...',
        Date(Date.now()), ipaddress, porta);
});
