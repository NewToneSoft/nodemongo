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

    this.create = function(firstName, lastName, email, password) {
        var member = angular.copy(new dtBase(db));
        var that = this;

        member.firstName = firstName;
        member.lastName = lastName;
        member.email = email;
        member.password = password;
        member.level = 0;
        member.team = null;
        member.answered = [];

        member.$save(db, function () {
            that.listMembers();
        }, function () {
            alert('Database error');
        });
    };

    this.update = function(updatedMember) {
        var member = angular.copy(new dtBase(db));
        var that = this;

        member._id = updatedMember._id;
        member.firstName = updatedMember.firstName;
        member.lastName = updatedMember.lastName;
        member.email = updatedMember.email;
        member.password = updatedMember.password;
        member.level = updatedMember.level;
        member.team = updatedMember.team;
        member.answered = updatedMember.answered;

        member.$save(db, function () {
            that.listMembers();
        }, function () {
            alert('Database error');
        });
    };

});
