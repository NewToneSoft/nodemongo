'use strict';

var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

    var colections = [];
    colections.users = db.collection('users');
    colections.categories = db.collection('categories');
    colections.questions = db.collection('questions');
    colections.teams = db.collection('teams');
    colections.sprints = db.collection('sprints');
    colections.answered_questions = db.collection('answered_questions');

    app.get('/clear', function (req, res) {
        db.collection('users').remove();
        db.collection('categories').remove();
        db.collection('questions').remove();
        db.collection('sprints').remove();
        res.end();
    });



    // LIST
    app.get('/api/:db', function (req, res) {
        var cat = colections[req.params.db];

        cat.find({}, function(err, result) {
            if (err) { res.send(err); }
            if (result) { res.send(result); }
        });
    });

    // SAVE / UPDATE
    app.post('/api/:db', function(req, res){
        var cat   = colections[req.params.db],
            final = JSON.parse(JSON.stringify(req.body));

        delete final.db;

        if (!req.body._id){
            cat.insert(final, function(err, result){
                if (err) {res.send(err);}
                if (result) {
                    res.end();
                }
            });
        } else {
            delete final._id;
            cat.update({_id: new ObjectID(req.body._id) }, final, function(err, result){
                if (err){res.send(err);}
                if (result) {
                    if (req.params.db == 'users'){
                        req.login(final, function(err) {
                            if (err){res.send(err);}
                            res.end();
                        });
                    }
                    res.end();
                }
            });
        }
    });

    // DELETE
    app.delete('/api/:db/:id', function(req, res){
        var cat = colections[req.params.db];

        cat.remove({_id: new ObjectID(req.params.id) }, function(err, result){
            if (err) {res.send(err);}
            if (result) {
                res.end();
            }
        });
    });
};