// Initialisation
var express = require('express'),
    http = require('http');

var app = express();
var server = http.createServer(app).listen(1337);

var io = require('socket.io').listen(server);
// End

// Tous les utilisateurs
var users = [];
var nbUser = -1;

// La classe user
var User = function(name) {
    this.id = 0;
    this.name = name;
    this.position = {
        x: 2,
        y: 2
    };
    this.character = '';
    this.identity = '';
    this.ready = false;
    this.order = 0;
    this.action1 = '';
    this.action2 = '';
};

// Au chargement de la page
io.sockets.on('connection', function(socket) {
    console.log('Nouvel utilisateur');
    var me = false;

    // Quand un utilisateur a choisi un pseudo
    socket.on('readyToPlay', function(name) {
        // ON instancie un nouveau user avec le pseudo
        me = new User(name.name);
        // On incrémente son id
        me.id = ++nbUser;
        // On l'ajoute au tableau des user
        users.push(me);

        // Et on emet le signal pour la personne qui vient de se connecter qu'on l'a bien enregistré
        socket.emit('connectedUser', {
            me: me,
            users: users
        });

        console.log('L\'utilisateur ' + me.id + ' : ' + me.name + ' s\'est connecté');
    });

    // Quand un utilisateur à choisi un personnage
    socket.on('characterChoosen', function(object) {
        // On ajoute le nom du personnage choisi à l'utilisateur actuel
        me.character = object.name;

        console.log('L\'utilisateur ' + me.id + ' : ' + me.name + ' a choisi le personnage ' + object.name);

        // Et on émet à tous les autres utilisateurs le signal qu'un personnage a été prit
        io.sockets.emit('newCharacter', {
            id: object.id,
            name: object.name,
            pseudo: me.name
        });

        //if (moreThanFourPlayers(users)) {
        console.log("Le jeu peut démarrer");
        io.sockets.emit('letsPlay');
        //}
    });

    // Signal de début de partie
    socket.on('emitPlay', function() {
        var arrayCoords = manageCoords();
        var identites = manageIdentity(users);
        users = managePlayerOrder(users);

        io.sockets.emit('play', {
            me: me,
            users: users,
            lastCardsCoords: arrayCoords[0],
            otherCoords: arrayCoords[1]
        });
    });

    // Quand un joueur a défini ses actions
    socket.on('playerReady', function(object) {
        users[findInArray(users, object.id)].ready = true;
        users[findInArray(users, object.id)].action1 = object.action1;
        users[findInArray(users, object.id)].action2 = object.action2;

        console.log('L\'utilisateur ' + me.id + ' : ' + me.name + ' est prêt.');

        // Si tout le monde est ok on joue
        if (everyoneIsOk(users)) {
            console.log('Tout le monde est prêt.');
            io.sockets.emit('everyoneIsOk', users);
        }
    });

    // Retourne le user grâce à l'id fourni puis emet l'event nextsentence
    socket.on('getUserAndDoNextSentence', function(object) {
        var u = findInArray(users, object.id);

        socket.emit('doNextSentence', {
            user: users[u],
            action: object.action,
            idTarget: object.idTarget
        });
    });

    // Une action doit être effectué
    socket.on('doAction', function(object){
        var u = users[findInArray(users, object.id)];
        u.action1 = '';

        console.log(u.id + ' --> ' + u.name + ' effectue l\'action ' + object.action);

        // Si c'est l'action déplacer
        if(object.action === 'Déplacer'){
            u.position.x = object.coords.split('-')[0];
            u.position.y = object.coords.split('-')[1];

            io.sockets.emit('playerDeplacer', {
                user: u,
            });
        }

        // Si c'est l'action pousser
        else if(object.action === 'Pousser'){
            var uTarget = users[findInArray(users, object.idTarget)];
            uTarget.position.x = object.coords.split('-')[0];
            uTarget.position.y = object.coords.split('-')[1];

            users[findInArray(users, object.idTarget)] = uTarget;

            io.sockets.emit('playerPousser', {
                user: u,
            });
        }

        // Si c'est l'action regarder
        else if(object.action === 'Regarder'){
            io.sockets.emit('playerRegarder', {
                user: u,
                coords: object.coords
            });
        }

        // On update le user
        users[findInArray(users, object.id)] = u;

        // Si c'est la deuxième action, on remet tout le monde à zéro pour le prochain tour
        if(u.action2 === object.action){
            u.action2 = '';

            u.ready = false;

            // On update le user
            users[findInArray(users, object.id)] = u;

            if(everyoneIsNOk(users)){
                io.sockets.emit('nextTurn', {
                    users: users
                });
            }
        }

        
        // On récupère le prochain joueur
        var nextOne = getByOrder(users, (u.order * 1) + 1);
        // Si on est à la fin de l'array on repasse à l'index 0
        if(!nextOne)
            nextOne = getByOrder(users, 0);

        // Si il y a une action1 on emet l'event
        if(nextOne.action1 != ''){
            console.log('Tour de ' + nextOne.id + ' --> ' + nextOne.name);

            io.sockets.emit('nextPlayer', {
                user: nextOne,
                users: users
            });
        }
        // Sinon c'est qu'on passe à la deuxieme action
        else {
            // Si tout le monde a joué ses deux actions on repasse à la prévision
            if(everyoneIsNOk(users)){
                io.sockets.emit('nextTurn', {
                    users: users
                });
            }
            // Sinon on récupère le prochain joueur
            else {
                var o = (nextOne.order * 1);
                while(nextOne && (nextOne.action2 === '' || nextOne.action2 === null)){
                    nextOne = getByOrder(users, ((o * 1) + 1));
                    o++;
                }

                // Si on a trouvé un joeur avec une deuxieme action
                if(nextOne){
                    console.log('Tour de ' + nextOne.id + ' --> ' + nextOne.name);

                    // Et on le fait jouer
                    if(nextOne.action2 != '' && nextOne.action2 != null){
                        io.sockets.emit('nextPlayer2', {
                            user: nextOne,
                            users: users
                        });
                    }
                }
                // Sinon c'est la fin du tour
                else {
                    console.log('Fin du tour');
                    for(var b in users){
                        if(users.hasOwnProperty(b)){
                            users[b].ready = false;
                            users[b].action1 = '';
                            users[b].action2 = '';
                        }
                    }
                    io.sockets.emit('nextTurn', {
                        users: users
                    });
                }
            }
        }
    });

    // Quand un utilisateur se deconnecte
    socket.on('disconnect', function(reason) {
        if (!me) {
            return false;
        }

        console.log('L\'utilisateur ' + me.id + ' : ' + me.name + ' s\'est déconnecté.');
        console.log(reason);

        // On supprime l'utilisateur du tableau
        users.splice(findInArray(users, me.id), 1);
        debugArray(users);

        // Et on émet à tous les autres joueurs qu'un utilisateur s'est deconnecté
        io.sockets.emit('disconnectedUser', me);

        if (!moreThanFourPlayers(users)) {
            io.sockets.emit('cantPlay');
        }
    });
});

exports = module.exports = server;
// delegates use() function
exports.use = function() {
    app.use.apply(app, arguments);
};

function getByOrder(users, order){
    var u = null;

    for (var a in users) {
        if (users.hasOwnProperty(a)) {
            if (users[a].order == order){
                u = users[a];
                break;
            }
        }
    }
    return u;
}

function everyoneIsOk(array) {
    var ready = true;
    for (var a in array) {
        if (array.hasOwnProperty(a)) {
            if (!array[a].ready) {
                ready = false;
                break;
            }
        }
    }
    return ready;
}

function everyoneIsNOk(array) {
    var notReady = true;
    for (var a in array) {
        if (array.hasOwnProperty(a)) {
            if (array[a].ready) {
                notReady = false;
                break;
            }
        }
    }
    return notReady;
}

function moreThanFourPlayers(array) {
    var cpt = 0;
    for (var a in array) {
        if (array.hasOwnProperty(a)) {
            if (array[a].character != '')
                cpt++;
        }
    }
    return cpt >= 4;
}

function findInArray(array, val) {
    for (var a in array) {
        if (array.hasOwnProperty(a)) {
            if (array[a].id == val)
                return a;
        }
    }
}

function findInArrayPosition(val, array) {
    for (var a in array) {
        if (array.hasOwnProperty(a)) {
            if (array[a].x == val.x && array[a].y == val.y)
                return a;
        }
    }
}

function debugArray(array) {
    for (var a in array) {
        console.log(a + ' -> ' + array[a]);
    }
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

function deleteLastCardsCoords(arrayFrom, array) {
    var arrayReturn = [];

    // Et pour chacune des tuiles restante
    for (var t in arrayFrom) {
        if (arrayFrom.hasOwnProperty(t)) {
            // On vérifie que la coordonnées n'est pas déjà prise
            if (!findInArrayPosition(arrayFrom[t], array)) {
                arrayReturn.push(arrayFrom[t]);
            }
        }
    }
    return arrayReturn;
}

function manageCoords() {
    // On récupère les coordonnées autorisées pour ces cartes
    var coordsPossible = getCoordsPossible();
    // On mélange ces coordonnées au hasard
    coordsPossible = mixRandomlyPositions(coordsPossible);
    var lastCardsCoords = [];
    // Et on récupère les deux premières
    lastCardsCoords.push(coordsPossible[0]);
    lastCardsCoords.push(coordsPossible[1]);

    // On récupère les autres coordonnées
    var otherCoords = getOtherCoordsPossible();
    // On concatène les deux tableaux de coordonnées
    otherCoords = otherCoords.concat(coordsPossible);
    // On mélange le tableau de coordonnées au hasard
    otherCoords = mixRandomlyPositions(otherCoords);
    otherCoords = deleteLastCardsCoords(otherCoords, lastCardsCoords);

    return [lastCardsCoords, otherCoords];
}

function manageIdentity(users) {
    var identities;

    if (users.length == 4) {
        identities = ['prisonnier', 'prisonnier', 'prisonnier', 'gardien'];
    } else {
        identities = ['prisonnier', 'prisonnier', 'prisonnier', 'gardien', 'gardien'];
    }

    identities = mixRandomlyPositions(identities);
    for (var u in users) {
        if (users.hasOwnProperty(u)) {
            users[u].identity = identities[u];
        }
    }
}

function managePlayerOrder(users){
    users = mixRandomlyPositions(users);
    for(var i in users){
        if (users.hasOwnProperty(i)) {
            users[i].order = i;
        }
    }
    return users;
}