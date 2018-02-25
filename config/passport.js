/*
 Módulo de Login - servidor v1.0
 2016 Nilton Cruz
 */

'use strict';

var LocalStrategy = require('passport-local').Strategy;

var base64 = exports;

base64.encode = function (unencoded) {
    return new Buffer(unencoded || '').toString('base64');
};

base64.decode = function (encoded) {
    return new Buffer(encoded || '', 'base64').toString('utf8');
};


module.exports = function(passport, db) {

    var usr = db.collection('usuarios');

    function findById(id, fn) {
        var des = false;
        var idx;

        usr.find(function(err, result) {
            if (result) {

                for(var i = 0; i < result.length; i++){
                    if(result[i].id === id){
                        des = true;
                        idx = i;
                        break;
                    }
                }

                if (des) {
                    fn(null, result[idx]);
                } else {
                    fn(new Error('User ' + id + ' does not exist'));
                }

            }
        });

    }

    function findByUsername(username, fn) {

        usr.find(function(err, result) {

            if (result) {

                for (var i = 0; i < result.length; i++) {
                    var user = result[i];
                    if (user.email.toLowerCase() === username.toLowerCase()) {
                        return fn(null, user);
                    }
                }
                return fn(null, null);
            }

        });

    }



    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy(function(username, password, done) {

        process.nextTick(function () {

            findByUsername(username, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false, { message: 'Usuário não cadastrado: ' + username }); }

                if (base64.decode(user.senha) != password) { return done(null, false, { message: 'Senha Inválida' }); }
                return done(null, user);
            })
        });
    }));


};