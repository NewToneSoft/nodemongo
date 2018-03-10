
'use strict';

app.service('QuestionMgr', function($q, $rootScope, dtBase) {

    this.listQuestions = function(){
        var deferred = $q.defer();

        dtBase.query({db: 'questions'}, function (data) {
            $rootScope.lists.questions = data;
            deferred.resolve();
        });

        return deferred.promise;
    };

    this.create = function(text, options, correctOption, level) {
        var db = {db: 'questions'};
        var question = angular.copy(new dtBase(db));
        var parent = this;

        question.text = text;
        question.optionArray = options;
        question.correctOption = correctOption;
        question.level = level || 0;

        question.$save(db, function () {
            parent.listQuestions();
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

    this.checkSelectedOption = function(question, selectedOption) {
        return selectedOption === question.correctOption;
    };

    this.setCategory = function(question, category) {
        if (!question.category) {
            question.category = category;
        }
    };

    this.printText = function(question) {
        console.log(`${question.text} || answer: ${question.correctOption} || level: ${question.level}`);
    };
});
