'use strict';
app.service('CategoryMgr', function($q, $rootScope, dtBase, QuestionMgr) {
    var db = {db: 'categories'};

    this.listCategories = function(){
        var deferred = $q.defer();

        dtBase.query(db, function (data) {
            $rootScope.lists.categories = data;
            deferred.resolve();
        });

        return deferred.promise;
    };

    this.create = function(name) {
        var category = angular.copy(new dtBase(db));
        var that = this;

        category.name = name;
        category.questionArray = [];

        category.$save(db, function () {
            that.listCategories();
        }, function () {
            alert('Database error');
        });
    };

    this.update = function(updatedCategory) {
        var category = angular.copy(new dtBase(db));
        var that = this;

        category._id = updatedCategory._id;
        category.name = updatedCategory.name;
        category.questionArray = updatedCategory.questionArray;


        category.$save(db, function () {
            that.listCategories();
        }, function () {
            alert('Database error ');
        });
    };

    this.addQuestion = function(category, question) {
        QuestionMgr.setCategory(question, category);
        category.questionArray.push(question._id);
        this.update(category);
    };
});

