
'use strict';
app.service('QuestionMgr', function($q, $rootScope, dtBase) {
    var db = {db: 'questions'};

    this.listQuestions = function(){
        var deferred = $q.defer();

        dtBase.query(db, function (data) {
            $rootScope.lists.questions = data;
            deferred.resolve();
        });

        return deferred.promise;
    };

    this.create = function(text, options, correctOption, level, points) {

        var question = angular.copy(new dtBase(db));
        var that = this;

        question.text = text;
        question.optionArray = options;
        question.correctOption = correctOption;
        question.level = level || 0;
        question.points = points || 0;

        question.$save(db, function () {
            that.listQuestions();
        }, function () {
            alert('Database error');
        });
    };

    this.update = function(updatedQuestion) {
        var question = angular.copy(new dtBase(db));
        var that = this;

        question._id = updatedQuestion._id;
        question.text = updatedQuestion.text;
        question.optionArray = updatedQuestion.optionArray;
        question.correctOption = updatedQuestion.correctOption;
        question.level = updatedQuestion.level;
        question.points = updatedQuestion.points;
        question.category = updatedQuestion.category;

        question.$save(db, function () {
            that.listQuestions();
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

    this.checkSelectedOption = function(question, selectedOption) {
        return selectedOption === question.correctOption;
    };

    this.setCategory = function(question, category) {
        if (!question.category) {
            question.category = category._id;
            this.update(question);
        }
    };

    this.printText = function(question) {
        console.log(`${question.text} || answer: ${question.correctOption} || level: ${question.level}`);
    };
});
