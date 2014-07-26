'use strict';

/**
 * @ngdoc function
 * @name 1mBookingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the 1mBookingApp
 */
angular.module('Room25App')
    .controller('CharacterCtrl', function($scope, $http) {
        // JSON des dispos des salles de réunion
        $scope.characters = [];
        $scope.currentUserID = -1;

        $http({
            method: 'GET',
            url: 'characters.json'
        }).success(function(data) {
            $scope.characters = data;
        }).error(function(data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });

        $scope.$watch('currentUserID', function(newValue, oldValue) {
            $scope.currentUserID = newValue;
        }, true);
    });