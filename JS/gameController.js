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

            $http({
                method: 'GET',
                url: 'tuiles.json'
            }).success(function(data) {
                $scope.tuiles = $scope.mixTuiles(data);
            }).error(function(data, status, headers, config) {
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            });

            $http({
                method: 'GET',
                url: 'actions.json'
            }).success(function(data) {
                $scope.actions = data;
            }).error(function(data, status, headers, config) {
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            });

            $scope.mixTuiles = function(data) {
                // On récupère les salles devant être à l'extérieur du plateau
                var realTuile = getTuiles(data, true);
                // Et on récupère les coordonnées autorisées pour ces cartes
                var coordsPossible = getCoordsPossible();
                var coordsDone = [];

                // On mélange ces coordonnées au hasard
                coordsPossible = mixRandomlyPositions(coordsPossible);

                // Et pour chacune des tuiles spéciales...
                for (var t in realTuile) {
                    if (realTuile.hasOwnProperty(t)) {
                        // On fixe sa position
                        realTuile[t].position.x = coordsPossible[t].x;
                        realTuile[t].position.y = coordsPossible[t].y;
                        // Et on ajoute ces positions au tableau des coordonnées prises
                        coordsDone.push(coordsPossible[t]);
                    }
                }

                // On récupère toutes les autres tuiles
                var otherTuile = getTuiles(data, false);
                // On récupère les autres coordonnées
                var otherCoords = getOtherCoordsPossible();
                // On concatène les deux tableaux de coordonnées
                otherCoords = otherCoords.concat(coordsPossible);
                // On mélange le tableau de coordonnées au hasard
                otherCoords = mixRandomlyPositions(otherCoords);

                var cpt = 0;
                // Et pour chacune des tuiles restante
                for (var t in otherTuile) {
                    if (otherTuile.hasOwnProperty(t)) {
                        // On vérifie que la coordonnées n'est pas déjà prise
                        while (findInArray(otherCoords[cpt], coordsDone)) {
                            cpt++;
                        }
                        // Et on fixe sa position
                        otherTuile[t].position.x = otherCoords[cpt].x;
                        otherTuile[t].position.y = otherCoords[cpt].y;
                        cpt++;
                    }
                }

                // Et on renvoi le tableau sans oublié la case départ
                return realTuile.concat(otherTuile).concat(getTuiles(data, null));
            }

            function getCoordsPossible() {
                return [{
                    x: 0,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }, {
                    x: 0,
                    y: 1
                }, {
                    x: 4,
                    y: 0
                }, {
                    x: 3,
                    y: 0
                }, {
                    x: 4,
                    y: 1
                }, {
                    x: 4,
                    y: 4
                }, {
                    x: 4,
                    y: 3
                }, {
                    x: 3,
                    y: 4
                }, {
                    x: 1,
                    y: 4
                }, {
                    x: 0,
                    y: 4
                }, {
                    x: 0,
                    y: 3
                }, ];
            }

            function getOtherCoordsPossible() {
                return [{
                    x: 2,
                    y: 0
                }, {
                    x: 1,
                    y: 1
                }, {
                    x: 2,
                    y: 1
                }, {
                    x: 3,
                    y: 1
                }, {
                    x: 0,
                    y: 2
                }, {
                    x: 1,
                    y: 2
                }, {
                    x: 3,
                    y: 2
                }, {
                    x: 4,
                    y: 2
                }, {
                    x: 1,
                    y: 3
                }, {
                    x: 2,
                    y: 3
                }, {
                    x: 3,
                    y: 3
                }, {
                    x: 2,
                    y: 4
                }, ];
            }

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

            function mixRandomlyPositions(coords) {
                var j = 0;
                var valI = '';
                var valJ = valI;
                var l = coords.length - 1;

                while (l > -1) {
                    j = Math.floor(Math.random() * l);
                    valI = coords[l];
                    valJ = coords[j];
                    coords[l] = valJ;
                    coords[j] = valI;
                    l = l - 1;
                }
                return coords;
            }

            function findInArray(val, array) {
                for (var a in array) {
                    if (array.hasOwnProperty(a)) {
                        if (array[a].x == val.x && array[a].y == val.y)
                            return a;
                    }
                }
            }
        });
}());