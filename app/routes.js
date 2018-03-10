'use strict';

module.exports = function(app, passport) {

    app.get('/login', function(req, res){
        res.render('login', { user: req.user, message: req.flash('error')});
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash : true
    }));

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash : true
    }));

    app.get('/userData', function(req, res) {
        res.send({user:req.user});
    });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/login');
    });

    app.all('*', function(req,res,next){
        if (!req.isAuthenticated()) {
            res.redirect('/login');
        } else {
            res.redirect('/');
        }
    });
};