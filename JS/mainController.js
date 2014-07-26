'use strict';


var app = angular.module('Room25App', ['ngRoute']);
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'Views/home.html'
        })
        .when('/game', {
            templateUrl: 'Views/game.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});
app.controller('MainCtrl', function($scope) {

});