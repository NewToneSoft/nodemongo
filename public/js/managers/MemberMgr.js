'use strict';

app.service('MemberMgr', function($q, $rootScope, dtBase) {

    this.create = function(name) {
        var db = {db: 'questions'};
        var newQ = member.copy(new dtBase(db));

        member.name = name;
        member.points = 0;
        member.team = null;

        member.$save(db, function (data) {
            console.log(data);
        }, function () {
            alert('Erro no Banco de Dados');
        });
    };
});
