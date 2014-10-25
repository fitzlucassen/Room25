var coordsManager = function(){
    this.getForVIPCases = function() {
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
    };

    this.getForOtherCases = function() {
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
    };

    this.shufflePositions = function(coords) {
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
    };

    this.findInArray = function(array, position) {
        var positionTmp = null;

        for (var a in array) {
            if (array.hasOwnProperty(a)) {
                if (array[a].x == position.x && array[a].y == position.y){
                    positionTmp = a;
                    break;
                }
            }
        }
        return positionTmp;
    };

    this.manageCoords = function() {
        // On récupère les coordonnées autorisées pour ces cartes
        var coordsPossible = this.getForVIPCases();
        // On mélange ces coordonnées au hasard
        coordsPossible = this.shufflePositions(coordsPossible);
        var lastCardsCoords = [];
        // Et on récupère les deux premières
        lastCardsCoords.push(coordsPossible[0]);
        lastCardsCoords.push(coordsPossible[1]);

        // On récupère les autres coordonnées
        var otherCoords = this.getForOtherCases();
        // On concatène les deux tableaux de coordonnées
        otherCoords = otherCoords.concat(coordsPossible);
        // On mélange le tableau de coordonnées au hasard
        otherCoords = this.shufflePositions(otherCoords);
        otherCoords = this.deleteLastCardsCoords(otherCoords, lastCardsCoords);

        return [lastCardsCoords, otherCoords];
    };

    this.deleteLastCardsCoords = function(arrayFrom, arrayTo) {
        var arrayReturn = [];
        var that = this;

        // Et pour chacune des tuiles restante
        for (var t in arrayFrom) {
            if (arrayFrom.hasOwnProperty(t)) {
                // On vérifie que la coordonnées n'est pas déjà prise
                if (!that.findInArray(arrayTo, arrayFrom[t])) {
                    arrayReturn.push(arrayFrom[t]);
                }
            }
        }
        return arrayReturn;
    };

    this.getNewUserPositionAfterController = function(user, sens){
        if(sens == 'top'){
            if(user.position.y > 0)
                user.position.y = (user.position.y * 1) - 1;
            else
                user.position.y = 4;
        }
        else if(sens == 'bottom'){
            if(user.position.y < 4)
                user.position.y = (user.position.y * 1) + 1;
            else
                user.position.y = 0;
        }
        else if(sens == 'left'){
            if(user.position.x > 0)
                user.position.x = (user.position.x * 1) - 1;
            else
                user.position.x = 4;
        }
        else if(sens == 'right'){
            if(user.position.x < 4)
                user.position.x = (user.position.x * 1) + 1;
            else
                user.position.x = 0;
        }

        return user;
    };
};

exports.coordsManager = coordsManager;