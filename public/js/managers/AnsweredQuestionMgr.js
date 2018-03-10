'use strict';

app.service('AnsweredQuestionMgr', function($q, $rootScope, dtBase) {

    this.create = function(team, question, answer, currentSprint) {
        var db = {db: 'answered_questions'};
        var answeredQuestion = angular.copy(new dtBase(db));

        answeredQuestion.team = team;
        answeredQuestion.question = question;
        answeredQuestion.answer = answer;
        answeredQuestion.points = question.getPoints();
        answeredQuestion.sprint = currentSprint;

        answeredQuestion.$save(db, function (data) {
            console.log(data);
        }, function () {
            alert('Erro no Banco de Dados');
        });
    };

    this.presentToUser = function(question) {
        console.log(question.text + ' ' + question.correctOption);
        question.optionArray.forEach(function(option) {
            console.log(option);
        });
    };

    this.addPoints = function(answeredQuestion, pts) {
    	this.points += pts;
    };

    this.answeredCorrectly = function(answeredQuestion) {
        return answeredQuestion.answer === answeredQuestion.question.correctOption;
    };
});
