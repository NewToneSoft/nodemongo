'use strict';

app

    .controller('mainCtl', function(QuestionMgr, CategoryMgr, $scope, $http) {
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
                                question.optionArray,  
                                question.correctOption,  
                                question.level,  
                                question.level 
                            ); 

                        }); 
                    }); 
                    console.log('success')
                })
            } 
    })

    .controller('practiceCtl', function($location, $scope, comm, CategoryMgr) {
        var questionsList = [];

        $scope.listQuestions = function(idx) {
            $scope.lists.questions.forEach(function(q) {
                if (q.category === idx) {
                    questionsList.push(q);
                }
            });
            comm.saveQuiz(questionsList);
            $location.path('/practice-quiz');
        }

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

    .controller('practiceQuizCtl', function($scope, $location, comm) {
        function getCategory(id){
            var idx = $scope.getIndexOfId($scope.lists.categories, id);

            if (idx != -1) {
                $scope.currentCategory = $scope.lists.categories[idx];
            }
        }

        var currentIdx = 0;
        $scope.quiz = {};
        $scope.quiz.answered = 0;
        $scope.quiz.correct = 0;
        $scope.quiz.selected = null;
        $scope.questionsList = comm.returnQuiz();
        $scope.currentQuiz = $scope.questionsList[currentIdx];
        getCategory($scope.currentQuiz.category);

        $scope.checkAnswer = function(sel){
            $scope.quiz.answered++;
            if (currentIdx < $scope.questionsList.length) {
                currentIdx++;
            } else {
                $location.path('/practice-quiz');
            }

            if ($scope.currentQuiz.correctOption == sel) {
                $scope.quiz.correct++;
            }
            $scope.quiz.selected = null;
            $scope.currentQuiz = $scope.questionsList[currentIdx];
            getCategory($scope.currentQuiz.category);
        }


    })

    .controller('rankingCtl', function($q, $scope, MemberMgr) {
        MemberMgr.listMembers();
    })

    .controller('docCtl', function($q, $scope) {

    })

    .controller('contestCtl', function($q, $scope) {

    })

    .controller('aboutCtl', function($q, $scope) {

    });

