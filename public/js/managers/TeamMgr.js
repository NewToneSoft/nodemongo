
'use strict';
app.service('TeamMgr', function($q, $rootScope, dtBase, MemberMgr) {
    var db = {db: 'teams'};

    this.listTeams = function(){
        var deferred = $q.defer();

        dtBase.query(db, function (data) {
            $rootScope.lists.teams = data;
            deferred.resolve();
        });

        return deferred.promise;
    };

    this.create = function(name, members) {
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
            alert('Database error');
        });
    };

    this.update = function(updatedTeam) {
        var team = angular.copy(updatedTeam);
        var that = this;

        team.$save(db, function () {
            that.listTeams();
        }, function () {
            alert('Database error');
        });
    };

    this.addAnsweredQuestion = function(team, answeredQuestion) {
        team.answeredQuestions.push(answeredQuestion);
        this.update(team);
    },

    this.addMember = function(team, member) {
        team.memberArray = this.memberArray || [];
        team.memberArray.push(member);
        MemberMgr.setTeam(member, team);
        this.update(team);
    };

    this.finishCategory = function(team, category) {
        team.finishedCategoriesNames.push(category.name);
        this.update(team);
    };

    this.finishedCurrentSprint = function(team) {
        const numberOfCategoriesInSprint = team.currentSprint.categoryArray.length;
        return team.finishedCategoriesNames.length >= numberOfCategoriesInSprint;
    };

    this.finishedCurrentCategory = function(team) {
        const numberOfQuestionsInCurretnCategory = team.currentSprint.getCurrentCategoryFor(team).questionArray.length;
        return team.answeredQuestions.length === numberOfQuestionsInCurretnCategory;
    };

    this.getPoints = function(team) {
        let sum = 0;

        team.answeredQuestions.forEach(function(it) {
            sum += it.points;
        });

        return sum;
    };

});
