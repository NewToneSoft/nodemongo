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

            if (idx) {
                $scope.lists.questions.forEach(function(q) {
                    if (q.category === idx && $scope.currentUser.answered.indexOf(q._id) == -1) {
                        questionsList.push(q);
                    }
                });
            } else {
                while(questionsList.length < 10) {
                    var idx = $scope.getRandomIndex($scope.lists.questions);

                    if (idx != -1) {
                        var item = $scope.lists.questions[idx];

                        var idx2 = $scope.getIndexOfId(questionsList, item._id);

                        if (idx2 == -1) {
                            questionsList.push(item);
                        }
                    }
                }
            }

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

    .controller('rankingCtl', function() {

    })

    .controller('docCtl', function() {

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
        $scope.sprint.questionValidation = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3];

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
                $scope.sprint.questionValidation[currentIdx] = 1;
                $scope.modals.success();
                $scope.sprint.player[0].points += ($scope.sprint.player[0].currentQuiz.level * 100);
                $scope.sprint.player[0].answered.push($scope.sprint.player[0].currentQuiz._id);
                currentIdx++;
                var idx = $scope.getIndexOfId($scope.sprint.player[0].questionsList, $scope.sprint.player[0].currentQuiz._id);

                if (idx != -1) {
                    $scope.sprint.player[0].questionsList.splice(idx, 1);
                    if (currentIdx > 0 && currentIdx > ($scope.sprint.player[0].questionsList.length - 1)) {
                        currentIdx--;
                    }
                }
            } else {
                $scope.sprint.questionValidation[currentIdx] = 0;
                $scope.modals.error();
                $scope.skip();

            }
            initQuiz();
        };

        $scope.skip = function(){
            $scope.sprint.questionValidation[currentIdx] = 2;
            if (currentIdx == $scope.sprint.player[0].questionsList.length - 1) {
                currentIdx = 0;
            } else {
                currentIdx++;
            }
            initQuiz();
        };
    })

    .controller('aboutCtl', function() {


    });

