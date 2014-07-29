(function() {
    'use strict';
    /**
     * @ngdoc function
     * @name 1mBookingApp.controller:MainCtrl
     * @description
     * # MainCtrl
     * Controller of the 1mBookingApp
     */
    angular.module('Room25App')
        .controller('GameCtrl', function($scope, $http, $location) {
            // JSON des dispos des salles de réunion
            $scope.tuiles = [];

            $http({
                method: 'GET',
                url: 'tuiles.json'
            }).success(function(data) {
                $scope.tuiles = data;
            }).error(function(data, status, headers, config) {
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            });
        });
}());