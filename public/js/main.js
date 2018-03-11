'use strict';

$(document).ready(function () {
    $('.collapse-button').on('click', function(){
        if($('.sidebar').hasClass('expanded')) {
            $('.sidebar').removeClass('expanded');
            $('.sidebar').addClass('collapse');

            $('.sidebar.collapse').one("webkitTransitionEnd otransitionend msTransitionEnd transitionend", function() {
                if($('.sidebar').hasClass('collapse')){
                    $('.sidebar').addClass('collapsed');
                    $('.sidebar').removeClass('collapse');
                }
            });
        } else {
            $('.sidebar').removeClass('collapsed');
            $('.sidebar').addClass('expanded');
        }
    });

    var dropdownMenu;

    $(window).on('show.bs.dropdown', function (e) {
        dropdownMenu = $(e.target).find('.dropdown-menu');
        $('body').append(dropdownMenu.detach());

        var eOffset = $(e.target).offset();

        dropdownMenu.css({
            'display': 'block',
            'top': eOffset.top + $(e.target).outerHeight(),
            'left': eOffset.left
        });
    });

    $(window).on('hide.bs.dropdown', function (e) {
        $(e.target).append(dropdownMenu.detach());
        dropdownMenu.hide();
    });
});

var app = angular.module('wapp', ['ngResource', 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'angular-sweetalert'])

    .run(['$rootScope', '$http', '$window', 'swal', function($rootScope, $http, $window, swal){

        $rootScope.lists = [];

        // LogIn
        $http.get('/userData').then(function(resp) {

            if (resp.data.user) {
                $rootScope.currentUser = resp.data.user;
            } else {
                $window.location.replace('/login');
            }

        });

        // LogOut
        $rootScope.logOut = function(){
            if($window.confirm('LogOut?')){
                $window.location.replace('/logout');
            }
        };

        $rootScope.getIndexOfId = function(list, item) {
            return list.map(function(e) {
                return e._id;
            }).indexOf(item);
        };

        $rootScope.getRandomIndex = function(list) {
            return Math.floor(Math.random() * list.length);
        };

        $rootScope.defineCurrentUserId = function() {
            var idx = $rootScope.lists.members.map(function(e){ return e.email; }).indexOf($rootScope.currentUser.email);

            if (idx != -1){
                $rootScope.currentUser._id = $rootScope.lists.members[idx]._id;
            }
        };

        $rootScope.modals = {
            success: function() {
                swal({
                    type: 'success',
                    title: 'Correct Answer!',
                    text: 'You are in a roll of correct answers!',
                    buttonsStyling: false,
                    confirmButtonClass: 'modal-button',
                    confirmButtonText: 'Continue'
                  });
            },
            error: function() {
                swal({
                    type: 'error',
                    title: 'Wrong Answer!',
                    text: 'Not this time. Keep going!',
                    buttonsStyling: false,
                    confirmButtonClass: 'modal-button',
                    confirmButtonText: 'Continue'
                  });
            },
            finish: function(points) {
                swal({
                    title: 'Contest finished!',
                    text: 'You got '+points+' points!',
                    imageUrl: '../img/motorcycle.png',
                    buttonsStyling: false,
                    confirmButtonClass: 'modal-button',
                    confirmButtonText: 'Continue',
                    showCloseButton: true,
                    onBeforeOpen: function(element) {
                        $(element).find('.swal2-close').html('<i class="fas fa-times"></i>')
                    }
                  });
            },
            levelup: function(level){
                swal({
                    title: 'Congratulations!',
                    html: '<div class="levelup-modal">'+level+'</div>You leveled up!',
                    buttonsStyling: false,
                    confirmButtonClass: 'modal-button',
                    confirmButtonText: 'Continue',
                    showCloseButton: true,
                    onBeforeOpen: function(element) {
                        $(element).find('.swal2-close').html('<i class="fas fa-times"></i>')
                    }
                  });
            },
            locked: function(){
                swal({
                    title: 'Item Locked',
                    html: '<div class="locked-modal"><i class="fas fa-lock"></i></div>Reach level 10 to unlock',
                    showConfirmButton: false,
                    showCloseButton: true,
                    onBeforeOpen: function(element) {
                        $(element).find('.swal2-close').html('<i class="fas fa-times"></i>')
                    }
                  });
            }
        }

    }])

    .factory('dtBase', function($resource){
        return $resource('/api/:db/',{},{});
    })

    .service('comm', function() {

        this.saveQuiz = function(item) {
            this.quiz = item;
        };

        this.returnQuiz = function() {
            return this.quiz;
        };

    })

    .config(function($routeProvider, $locationProvider) {

        $routeProvider.when('/', {templateUrl: 'partial/main.html'})

            .when('/practice-quiz', {templateUrl: 'partial/practice-quiz.html'})
            .when('/practice', {templateUrl: 'partial/practice.html'})
            .when('/contests', {templateUrl: 'partial/contests.html'})
            .when('/ranking', {templateUrl: 'partial/ranking.html'})
            .when('/documentation', {templateUrl: 'partial/documentation.html'})
            .when('/about', {templateUrl: 'partial/about.html'})
            .otherwise({redirectTo:'/login'});

        $locationProvider.html5Mode(true);

    });

