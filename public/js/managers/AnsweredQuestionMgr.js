'use strict';
app.service('AnsweredQuestionMgr', function($q, $rootScope, dtBase) {
    var db = {db: 'answered_questions'};

    this.create = function(team, question, answer, currentSprint) {
        var answeredQuestion = angular.copy(new dtBase(db));

        answeredQuestion.team = team;
        answeredQuestion.question = question;
        answeredQuestion.answer = answer;
        answeredQuestion.points = question.points;
        answeredQuestion.sprint = currentSprint;

        answeredQuestion.$save(db, function (data) {
            console.log(data);
        }, function () {
            alert('Database error');
        });
    };


    this.presentToUser = function(question) {
        console.log(question.text + ' ' + question.correctOption);
        question.optionArray.forEach(function(option) {
            console.log(option);
        });
    };

    this.answeredCorrectly = function(answeredQuestion) {
        return answeredQuestion.answer === answeredQuestion.question.correctOption;
    };
});
