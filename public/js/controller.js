'use strict';

app

    .controller('mainCtl', function($q, $scope, $http, CategoryMgr, QuestionMgr) {
        CategoryMgr.listCategories();
        QuestionMgr.listQuestions();
        $scope.gera = function(){
        $http.get('js/output.json').
            then(function onSuccess(response) {
                response.data.forEach(function(category) {
                    CategoryMgr.create(category.name);


                    category.questionArray.forEach(function(question) {
                        QuestionMgr.create(
                            question.text, 
                            question.options, 
                            question.correctOption, 
                            question.level, 
                            question.level,
                            category.name
                        );

                       
                    });
                });
                console.log('sucess')
            });
        }
    })

    .controller('practiceCtl', function($q, $scope, QuestionMgr,CategoryMgr) {


        $scope.gera = function(){
            var temp = $scope.lists.questions;
            var cat = $scope.lists.categories;
    
    for (var c = cat.length-1; c >= 0; c--) {
        for(var i = 0; i <= 10; i++) {
            CategoryMgr.addQuestion(cat[c], temp[temp.length - 1]);
            temp.splice(temp.length - 1, 1);
        }
        }
    }
    })

    .controller('rankingCtl', function($q, $scope, MemberMgr) {
        MemberMgr.listMembers();
    })

    .controller('docCtl', function($q, $scope, QuestionMgr, CategoryMgr) {
        
   

    
 
                    
         
            

                

    })

    .controller('contestCtl', function($q, $scope) {

    })

    .controller('aboutCtl', function($q, $scope) {

    });

