'use strict';

app

    .controller('mainCtl', function($q, $scope, dtBase) {

    })

    .controller('practiceCtl', function($q, $scope, dtBase, CategoryMgr) {

        CategoryMgr.listCategories();

    })

    .controller('rankingCtl', function($q, $scope, dtBase) {

        var deferred = $q.defer();

        dtBase.query({db: 'users'}, function (data) {
            $scope.users = data;
            deferred.resolve();
        });
    })

    .controller('docCtl', function($q, $scope, dtBase, QuestionMgr) {

        QuestionMgr.listQuestions();

        $scope.save = function(text, number){
            QuestionMgr.create(text, number);
        };

    })

    .controller('contestCtl', function($q, $scope, dtBase) {

    })

    .controller('aboutCtl', function($q, $scope, dtBase) {

    });

