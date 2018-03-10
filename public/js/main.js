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

var SweetAlertModals = {
    sucess: function() {
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


var app = angular.module('wapp', ['ngResource', 'ngRoute', 'ngAnimate', 'ui.bootstrap'])

    .run(['$rootScope', '$http', '$window', function($rootScope, $http, $window){

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

    }])

    .factory('dtBase', function($resource){
        return $resource('/api/:db/:id/',{},{});
    })

    .config(function($routeProvider, $locationProvider) {

        $routeProvider.when('/', {templateUrl: 'partial/main.html'})

            .when('/practice', {templateUrl: 'partial/practice.html'})
            .when('/contests', {templateUrl: 'partial/contests.html'})
            .when('/ranking', {templateUrl: 'partial/ranking.html'})
            .when('/documentation', {templateUrl: 'partial/documentation.html'})
            .when('/about', {templateUrl: 'partial/about.html'})
            .otherwise({redirectTo:'/login'});

        $locationProvider.html5Mode(true);

    });

