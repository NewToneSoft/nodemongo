/*
 módulo de Rotas - servidor v1.0
 2016 Nilton Cruz
 */

'use strict';

function ensureAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
    } else {
        next();
    }
}

module.exports = function(app, passport) {

    // LOGIN
    app.get('/login', function(req, res){
        res.render('login', { user: req.user, message: req.flash('error')});
    });

    app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
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
        if (req.params === '/' || req.params === '/login')
            next();
        else
            ensureAuthenticated(req,res,next);
    });

};