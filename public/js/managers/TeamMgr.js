
'use strict';

app.service('TeamMgr', function($q, $rootScope, dtBase) {

    this.listTeams = function(){
        var deferred = $q.defer();

        dtBase.query({db: 'teams'}, function (data) {
            $rootScope.lists.teams = data;
            deferred.resolve();
        });

        return deferred.promise;
    };

    this.create = function(name, members) {
        var db = {db: 'teams'};
        var team = angular.copy(new dtBase(db));
        var parent = this;

        team.name = name;
        team.memberArray = [];
        team.answeredQuestions = [];
        team.finishedCategoriesNames = [];
        team.currentSprint = null;

        if (members) {
            team.memberArray = members;
        }

        team.$save(db, function () {
            parent.listTeams();
        }, function () {
            alert('Erro no Banco de Dados');
        });
    };

    this.addMember = function(team, member) {
        team.memberArray = this.memberArray || [];
        team.memberArray.push(member);
        member.setTeam(team);

        // TODO DB
    };

    this.finishCategory = function(team, category) {
        team.finishCategory(category);
        // DB
    };

    this.finishCategory = function(category) {
        this.finishedCategoriesNames.push(category.getName());
    };

    this.finishedCurrentSprint = function(team) {
        const numberOfCategoriesInSprint = team.currentSprint.getCategories().length;
        return team.getFinishedCategoriesNames().length >= numberOfCategoriesInSprint;
    };

    this.finishedCurrentCategory = function(team) {
        const numberOfQuestionsInCurretnCategory = team.currentSprint.getCurrentCategoryFor(team).getQuestions().length;
        return team.answeredQuestions.length === numberOfQuestionsInCurretnCategory;
    };

    this.getPoints = function(team) {
        let sum = 0;

        team.answeredQuestions.forEach(function(it) {
            sum += it.getPoints();
        });

        return sum;
    };

});
