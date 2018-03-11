'use strict';
app.service('MemberMgr', function($q, $rootScope, dtBase) {
    var db = {db: 'users'};

    this.listMembers = function(){

        var deferred = $q.defer();

        dtBase.query(db, function (data) {
            $rootScope.lists.members = data;
            deferred.resolve();
        });

        return deferred.promise;
    };

    this.create = function(name) {
        var member = angular.copy(new dtBase(db));
        var that = this;

        member.name = name;
        member.points = 0;
        member.team = null;

        member.$save(db, function () {
            that.listMembers();
        }, function () {
            alert('Database error');
        });
    };

    this.update = function(updatedMember) {
        var member = angular.copy(updatedMember);
        var that = this;

        member.$save(db, function () {
            that.listMembers();
        }, function () {
            alert('Database error');
        });
    };

    this.addPoints = function(member, pts) {
        member.points += pts;
        this.update(member);
    };

    this.setTeam = function(member, team) {
        member.team = team;
        this.update(member);
    };
});
