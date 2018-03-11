
'use strict';
app.service('SprintMgr', function($q, $rootScope, dtBase, TeamMgr, AnsweredQuestionMgr) {
    var db = {db: 'sprints'};

    this.listSprints = function(){
        var deferred = $q.defer();

        dtBase.query(db, function (data) {
            $rootScope.lists.sprints = data;
            deferred.resolve();
        });

        return deferred.promise;
    };

    this.create = function(mainText, subText, startDate, endDate, answersToFinish) {
        var sprint = angular.copy(new dtBase(db));
        var parent = this;

        sprint.enabled = true;
        sprint.mainText = mainText;
        sprint.subText = subText;
        sprint.startDate = startDate;
        sprint.endDate = endDate;
        sprint.answersToFinish = answersToFinish;

        sprint.$save(db, function () {
            parent.listSprints();
        }, function () {
            alert('Database error');
        });
    };
});

