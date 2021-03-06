(function() {
    'use strict';

    var app = angular.module('Room25App', ['ngRoute']);
    
    app.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'Views/home.html',
            })
            .when('/game/:room', {
                templateUrl: 'Views/game.html',
                reloadOnSearch: false
            })
            .when('/game/join/:room', {
                templateUrl: 'Views/game.html',
                reloadOnSearch: false
            })
            .when('/help', {
                templateUrl: 'Views/help.html',
                reloadOnSearch: false
            })
            .otherwise({
                redirectTo: '/'
            });
    });
    app.controller('MainCtrl', function($scope) {

    });
}());
