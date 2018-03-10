'use strict';

var db = {db: 'categories'};

app.service('CategoryMgr', function($q, $rootScope, dtBase, QuestionMgr) {

    this.listCategories = function(){
        var deferred = $q.defer();

        dtBase.query(db, function (data) {
            $rootScope.lists.questions = data;
            deferred.resolve();
        });

        return deferred.promise;
    };

    this.create = function(name) {
        var category = angular.copy(new dtBase(db));

        category.name = name;
        category.questionArray = [];

        category.$save(db, function (data) {
            console.log(data);
        }, function () {
            alert('Erro no Banco de Dados');
        });
    };

    this.addQuestion = function(category, question) {
        question.setCategory(category);
        category.addQuestion(question);

        category.$save(db, function (data) {
            console.log(data);
        }, function () {
            alert('Erro no Banco de Dados');
        });

        // TODO update question

    };
});

