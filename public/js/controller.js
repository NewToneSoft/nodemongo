'use strict';

app

    .controller('mainCtl', function(QuestionMgr, CategoryMgr, MemberMgr, SprintMgr) {
        CategoryMgr.listCategories();
        QuestionMgr.listQuestions();
        MemberMgr.listMembers();
        SprintMgr.listSprints();
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

    .controller('practiceQuizCtl', function($scope, comm, MemberMgr) {
        function getCategory(id){
            var idx = $scope.getIndexOfId($scope.lists.categories, id);

            if (idx != -1) {
                $scope.currentCategory = $scope.lists.categories[idx];
            }
        }

        function initQuiz() {
            if (!$scope.currentUser._id) {
                $scope.defineCurrentUserId();
            }

            if ($scope.questionsList.length > 0) {
                currentIdx = $scope.getRandomIndex($scope.questionsList);
                $scope.currentQuiz = $scope.questionsList[currentIdx];
                getCategory($scope.currentQuiz.category);
            }

            $scope.quiz.selected = null;
        }

        $scope.questionsList = comm.returnQuiz();
        var currentIdx;
        $scope.quiz = {};
        $scope.quiz.answered = 0;
        $scope.quiz.correct = 0;
        initQuiz();

        $scope.checkAnswer = function(sel) {
            $scope.quiz.answered++;

            if ($scope.currentQuiz.correctOption == sel) {
                $scope.modals.success();
                $scope.quiz.correct++;
                $scope.currentUser.level += ($scope.currentQuiz.level * 50);
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

    .controller('rankingCtl', function($q, $scope) {

    })

    .controller('docCtl', function($q, $scope) {

    })

    .controller('contestCtl', function($q, $scope, $location, comm) {
        var questionsList = [];

        $scope.startSprint = function(idx, qnt) {

            while(questionsList.length < qnt) {
                var idx = $scope.getRandomIndex($scope.lists.questions);

                if (idx != -1) {
                    var item = $scope.lists.questions[idx];

                    var idx2 = $scope.getIndexOfId(questionsList, item._id);

                    if (idx2 == -1) {
                        questionsList.push(item);
                    }
                }
            }

            comm.saveQuiz(questionsList);
            $location.path('/contest-quiz');
        };
    })

    .controller('contestQuizCtl', function($q, $scope, comm) {
        var questionsList = comm.returnQuiz();
        var currentIdx = 0;

        $scope.sprint = [];
        $scope.sprint.player = [];

        if (!$scope.currentUser._id) {
            $scope.defineCurrentUserId();
        }

        $scope.sprint.player.push({
            id: $scope.currentUser._id,
            name: $scope.currentUser.firstName + ' ' + $scope.currentUser.lastName,
            points : 0,
            questionsList: questionsList,
            answered: [],
            selected: null,
            currentQuiz: null
        });

        function initQuiz() {
            if ($scope.sprint.player[0].questionsList.length > 0) {
                $scope.sprint.player[0].currentQuiz = $scope.sprint.player[0].questionsList[currentIdx];
                $scope.sprint.player[0].selected = null;
            } else {
                $scope.modals.finish($scope.sprint.player[0].points);
            }
        }

        initQuiz();

        $scope.checkAnswer = function(sel) {
            if ($scope.sprint.player[0].currentQuiz.correctOption == sel) {
                $scope.modals.success();
                $scope.sprint.player[0].points += ($scope.sprint.player[0].currentQuiz.level * 100);
                $scope.sprint.player[0].answered.push($scope.sprint.player[0].currentQuiz._id);

                var idx = $scope.getIndexOfId($scope.sprint.player[0].questionsList, $scope.sprint.player[0].currentQuiz._id);

                if (idx != -1) {
                    $scope.sprint.player[0].questionsList.splice(idx, 1);
                    if (currentIdx > 0 && currentIdx > ($scope.sprint.player[0].questionsList.length - 1)) {
                        currentIdx--;
                    }
                }
            } else {
                $scope.modals.error();
            }
            initQuiz();
        };

        $scope.skip = function(){
            if (currentIdx == $scope.sprint.player[0].questionsList.length - 1) {
                currentIdx = 0;
            } else {
                currentIdx++;
            }
            initQuiz();
        };
    })

    .controller('aboutCtl', function($q, $scope, $http, CategoryMgr, QuestionMgr, SprintMgr) {

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

        $scope.gera3 = function(){
            SprintMgr.create("Hurry up and join now!", "Contest in progress", "10AM", "12AM", 10);
            console.log('success3')
        }
    });

