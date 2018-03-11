'use strict';

app

    .controller('mainCtl', function(QuestionMgr, CategoryMgr, MemberMgr) {
        CategoryMgr.listCategories();
        QuestionMgr.listQuestions();
        MemberMgr.listMembers();
    })

    .controller('practiceCtl', function($location, $scope, comm) {
        var questionsList = [];

        $scope.listQuestions = function(idx) {
            if (!$scope.currentUser.answered) {
                $scope.currentUser.answered = [];
            }

            $scope.lists.questions.forEach(function(q) {
                if (q.category === idx && $scope.currentUser.answered.indexOf(q._id) == -1) {
                    questionsList.push(q);
                }
            });
            comm.saveQuiz(questionsList);
            $location.path('/practice-quiz');
        };

    })

    .controller('practiceQuizCtl', function($scope, $location, comm, MemberMgr) {
        function getCategory(id){
            var idx = $scope.getIndexOfId($scope.lists.categories, id);

            if (idx != -1) {
                $scope.currentCategory = $scope.lists.categories[idx];
            }
        }

        function initQuiz(check) {
            if (!$scope.currentUser._id) {
                $scope.defineCurrentUserId();
            }

            if ($scope.questionsList.length > 0) {
                currentIdx = $scope.getRandomIndex($scope.questionsList);
            }

            $scope.quiz.selected = null;
            $scope.currentQuiz = $scope.questionsList[currentIdx];
            getCategory($scope.currentQuiz.category);
        }

        $scope.questionsList = comm.returnQuiz();
        var currentIdx;
        if ($scope.questionsList.length > 0) {
            currentIdx = $scope.getRandomIndex($scope.questionsList);
        }
        $scope.quiz = {};
        $scope.quiz.answered = 0;
        $scope.quiz.correct = 0;
        initQuiz();

        $scope.checkAnswer = function(sel) {
            $scope.quiz.answered++;

            if ($scope.currentQuiz.correctOption == sel) {
                $scope.modals.success();
                $scope.quiz.correct++;
                $scope.currentUser.level += ($scope.currentQuiz.level * 10);
                $scope.currentUser.answered.push($scope.currentQuiz._id);
                MemberMgr.update($scope.currentUser);

                var idx = $scope.getIndexOfId($scope.questionsList, $scope.currentQuiz._id);

                if (idx != -1) {
                    $scope.questionsList.splice(idx, 1);
                }
            } else {
                $scope.modals.error();
            }
            initQuiz();
        }
    })

    .controller('rankingCtl', function($q, $scope, MemberMgr) {
        MemberMgr.listMembers();
    })

    .controller('docCtl', function($q, $scope) {

    })

    .controller('contestCtl', function($q, $scope) {

    })

    .controller('aboutCtl', function($q, $scope, $http, CategoryMgr, QuestionMgr) {

        $scope.clear = function(){
            $http.get('/clear');
        };

        $scope.gera1 = function(){
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
                    CategoryMgr.listCategories();
                    QuestionMgr.listQuestions();
                    console.log('success1')
                })
        };


        $scope.gera2 = function(){
            var temp = $scope.lists.questions;
            var cat = $scope.lists.categories;

            for (var c = cat.length-1; c >= 0; c--) {
                for(var i = 0; i <= 10; i++) {
                    temp[temp.length - 1].category = cat[c]._id;
                    QuestionMgr.update(temp[temp.length - 1]);
                    temp.splice(temp.length - 1, 1);
                }
            }
            console.log('success2')
        }
    });

