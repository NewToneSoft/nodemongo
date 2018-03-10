
'use strict';

app.service('SprintMgr', function($q, $rootScope, dtBase, TeamMgr, AnsweredQuestionMgr) {

    this.listSprints = function(){
        var deferred = $q.defer();

        dtBase.query({db: 'sprints'}, function (data) {
            $rootScope.lists.sprints = data;
            deferred.resolve();
        });

        return deferred.promise;
    };

    this.create = function(name, teams, categoryArray, startDate, endDate, updateSprint) {
        var db = {db: 'sprints'};
        var sprint = (updateSprint) ? angular.copy(updateSprint) : angular.copy(new dtBase(db));
        var parent = this;

        sprint.ranking = null;
        sprint.teamArray = [];
        sprint.currentQuestion = {};
        sprint.currentCategoryName = {};
        sprint.categoryArray = categoryArray;
        sprint.startDate = startDate;
        sprint.endDate = endDate;
        sprint.answersToFinsish = 5;
        sprint.flatQuestionArray = [];

        categoryArray.forEach(function(category) {
            category.getQuestions().forEach(function(question) {
                sprint.flatQuestionArray.push(question);
            });
        });

        if (teams) {
            sprint.teamArray = teams;

            sprint.teamArray.forEach(function(it) {
                it.currentSprint = sprint;
            });
        }

        sprint.$save(db, function () {
            parent.listSprints();
        }, function () {
            alert('Erro no Banco de Dados');
        });
    };

    this.startCategory = function(sprint, team, category) {
        if (sprint.isRunning()) {
            sprint.currentCategoryName[team] = category.getName();
            sprint.flatQuestionArray[team] = category.getQuestions();
            sprint.loadQuestionFor(team, sprint.flatQuestionArray[team][0]);
        } else {
            console.log('Sprint not running!');
        }
    },

    this.isRunning = function(sprint) {
        const startTime = sprint.startDate.getTime();
        const currTime = new Date().getTime();
        const endTime = sprint.endDate.getTime();

        return startTime < currTime && currTime < endTime;
    },

    this.checkAnswer = function(sprint, team, selectedOption) {
        const currentQuestion = sprint.getCurrentQuestionFor(team);
        const answeredQuestion = AnsweredQuestionMgr.create(team, currentQuestion, selectedOption, sprint);

        sprint.remove(currentQuestion);
        team.addAnsweredQuestion(answeredQuestion);

        // TODO DB

        if(team.finishedCurrentCategory()) {
            TeamMgr.finishCategory(team, currentQuestion.getCategory());
        }

        if (team.finishedCurrentSprint()) {
            // TODO
        } else {
            sprint.loadQuestionFor(team, sprint.getNewQuestion());
        }
    },

    this.loadQuestionFor = function(sprint, team, question) {
        sprint.currentQuestion[team] = question;
    },

    this.getCurrentQuestionFor = function(sprint, team) {
        return sprint.currentQuestion[team];
    },

    this.getCurrentCategoryFor = function(sprint, team) {
        let result = null;
        const that = sprint;

        sprint.categoryArray.forEach(function(it) {
            if (it.getName() === that.currentCategoryName[team]) {
                result = it;
            }
        });

        return result;
    },

    this.getCategory = function(sprint, categoryName) {
        let result = null;

        sprint.categoryArray.forEach(function(it) {
            if (it.getName() == categoryName) {
                result = it;
            }
        });

        return result;
    },

    this.getNewQuestion = function(sprint) {
        return sprint.flatQuestionArray[0]; // TODO
    },

    this.remove = function(sprint, question) {
        const index = sprint.flatQuestionArray.indexOf(question);

        if (index > -1) {
            sprint.flatQuestionArray.splice(index, 1);
        }
    }
});

