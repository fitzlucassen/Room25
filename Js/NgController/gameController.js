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
            $scope.actions = [];
            $scope.coordsReady = -1;

            $http({
                method: 'GET',
                url: 'Json/actions.json'
            }).success(function(data) {
                $scope.actions = data;
            }).error(function(data, status, headers, config) {
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            });

            $scope.$watch('coordsReady', function(newValue, oldValue) {
                if (newValue !== -1) {
                    $http({
                        method: 'GET',
                        url: 'Json/tuiles.json'
                    }).success(function(data) {
                        $scope.tuiles = $scope.mixTuiles(data, LastCoords, OtherCoords);
                    }).error(function(data, status, headers, config) {
                        console.log(data);
                        console.log(status);
                        console.log(headers);
                        console.log(config);
                    });
                }
            }, true);

            $scope.mixTuiles = function(data, last, other) {
                // On récupère les salles devant être à l'extérieur du plateau
                var realTuile = getTuiles(data, true);

                // Et pour chacune des tuiles spéciales...
                for (var t in realTuile) {
                    if (realTuile.hasOwnProperty(t)) {
                        // On fixe sa position
                        realTuile[t].position.x = last[t].x;
                        realTuile[t].position.y = last[t].y;
                    }
                }

                // On récupère toutes les autres tuiles
                var otherTuile = getTuiles(data, false);

                // Et pour chacune des tuiles restante
                for (var tu in otherTuile) {
                    if (otherTuile.hasOwnProperty(tu)) {
                        // Et on fixe sa position
                        otherTuile[tu].position.x = other[tu].x;
                        otherTuile[tu].position.y = other[tu].y;
                    }
                }

                // Et on renvoi le tableau sans oublié la case départ
                return realTuile.concat(otherTuile).concat(getTuiles(data, null));
            };

            function getTuiles(data, last) {
                var array = [];

                for (var t in data) {
                    if (data.hasOwnProperty(t)) {
                        if (data[t].last === last)
                            array.push(data[t]);
                    }
                }
                return array;
            }
        });
}());
