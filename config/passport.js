'use strict';

var LocalStrategy = require('passport-local').Strategy;

var bcrypt   = require('bcrypt-nodejs');

module.exports = function(passport, db) {

    var users = db.collection('users');

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use('local-login', new LocalStrategy(function(email, password, done) {
        process.nextTick(function() {
            users.findOne({ 'email' :  email }, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false, { message: 'User not registered: ' + email }); }

                bcrypt.compare(password, user.password, function(err, res) {
                    if (!res) {
                        return done(null, false, { message: 'Incorrect password.' });
                    } else {
                        return done(null, user);
                    }
                });
            });
        });
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'newEmail',
        passwordField : 'newPassword',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            users.findOne({ 'email' :  email }, function(err, user) {
                if (err) { return done(err); }
                if (user) {
                    return done(null, false, { message: 'That user is already taken'});
                } else {
                    var newUser = {
                        email     : email,
                        firstName : req.body.firstName,
                        lastName  : req.body.lastName,
                        level     : 0,
                        answered  : []
                    };

                    bcrypt.hash(password, null, null, function(err, hash) {
                        newUser.password = hash;
                        users.insert(newUser, function(err, res){
                            if (err) {
                                throw err;
                            }
                            return done(null, newUser);
                        });
                    });
                }
            });
        });
    }));
};