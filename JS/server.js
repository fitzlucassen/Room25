// Initialisation
var express = require('express');
var http = require('http');
var socketIO = require('socket.io');
var user = require('./nodeModules/user');
var debug = require('./nodeModules/debug');
var coords = require('./nodeModules/coords');
var game = require('./nodeModules/game');
// End

// Création du serveur
var app = express();
var server = http.createServer(app).listen('1337');
var io = socketIO.listen(server);
// End

// Gestion des modules internes
exports = module.exports = server;
exports.use = function() {
    app.use.apply(app, arguments);
};

UserManager = new user.userManager();
DebugManager = new debug.debugManager();
CoordsManager = new coords.coordsManager();
GameManager = new game.gameManager();
// End

// Tous les utilisateurs
var users = [];
var nbUser = -1;
var nbTourRestant = 10;
var isAGame = false;

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
    this.color = "";
    this.inAParty = false;
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
            users: users,
            available: !isAGame
        });

        DebugManager.messageForUser(me, 's\'est connecté');
    });

    // Quand un utilisateur à choisi un personnage
    socket.on('characterChoosen', function(object) {
        // On ajoute le nom du personnage choisi à l'utilisateur actuel
        me.character = object.name;
        me.color = object.color;

        DebugManager.messageForUser(me, 'a choisi le personnage ' + object.name);

        // Et on émet à tous les autres utilisateurs le signal qu'un personnage a été prit
        io.sockets.emit('newCharacter', {
            id: object.id,
            name: object.name,
            pseudo: me.name,
            color: me.color
        });

        //if (GameManager.moreThanFourPlayers(users)) {
        console.log("Le jeu peut démarrer");
        io.sockets.emit('letsPlay');
        //}
    });

    // Signal de début de partie
    socket.on('emitPlay', function() {
        var arrayCoords = CoordsManager.manageCoords();

        users = GameManager.manageIdentity(users, CoordsManager.shufflePositions);
        users = UserManager.processPlayerOrder(users, CoordsManager.shufflePositions);

        isAGame = true;
        io.sockets.emit('play', {
            me: me,
            users: users,
            lastCardsCoords: arrayCoords[0],
            otherCoords: arrayCoords[1]
        });
    });

    // Quand un joueur a défini ses actions
    socket.on('playerReady', function(object) {
        var u = UserManager.getById(users, object.id);
        users[u].ready = true;
        users[u].action1 = object.action1;
        users[u].action2 = object.action2;

        DebugManager.messageForUser(me, 'est prêt');

        // Si tout le monde est ok on joue
        if (GameManager.everyoneIsOk(users)) {
            console.log('Tout le monde est prêt.');
            io.sockets.emit('everyoneIsOk', users);
        }
    });

    // Retourne le user grâce à l'id fourni puis emet l'event nextsentence
    socket.on('getUserAndDoNextSentence', function(object) {
        var u = UserManager.getById(users, object.id);

        socket.emit('doNextSentence', {
            user: users[u],
            action: object.action,
            idTarget: object.idTarget
        });
    });

    // Retourne le user grâce à l'id fourni puis emet l'event nextsentence
    socket.on('getUserAndDoNextSentenceController', function(object) {
        var u = UserManager.getById(users, object.id);

        socket.emit('doNextSentenceController', {
            user: users[u],
            action: object.action,
            coords: object.coords
        });
    });

    // Une action doit être effectué
    socket.on('doAction', function(object){
        var u = users[UserManager.getById(users, object.id)];
        u.action1 = '';

        DebugManager.messageForUser(u, 'effectue l\'action ' + object.action);

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
            var uTarget = users[UserManager.getById(users, object.idTarget)];
            uTarget.position.x = object.coords.split('-')[0];
            uTarget.position.y = object.coords.split('-')[1];

            users[UserManager.getById(users, object.idTarget)] = uTarget;

            io.sockets.emit('playerPousser', {
                userTarget: uTarget,
                user: u
            });
        }

        // Si c'est l'action regarder
        else if(object.action === 'Regarder'){
            io.sockets.emit('playerRegarder', {
                user: u,
                coords: object.coords
            });
        }
        else if(object.action === 'Contrôller'){
            var us = UserManager.getInTheSameRow(users, object.coords, object.sens);

            for(var b in us){
                if(us.hasOwnProperty(b)){
                    DebugManager.messageForUser(users[us[b]], '--> avant : ' + users[us[b]].position.x + '-' + users[us[b]].position.y);

                    users[us[b]] = CoordsManager.getNewUserPositionAfterController(users[us[b]], object.sens);

                    DebugManager.messageForUser(users[us[b]], '--> après : ' + users[us[b]].position.x + '-' + users[us[b]].position.y);
                }
            }

            io.sockets.emit('playerController', {
                users: users,
                coords: object.coords,
                sens: object.sens,
                user: u
            });
        }

        // On update le user
        users[UserManager.getById(users, object.id)] = u;

        // Si c'est la deuxième action, on remet tout le monde à zéro pour le prochain tour
        if(u.action2 === object.action){
            u.action2 = '';

            u.ready = false;

            // On update le user
            users[UserManager.getById(users, object.id)] = u;

            if(GameManager.everyoneIsNok(users)){
                nbTourRestant--;
                io.sockets.emit('nextTurn', {
                    users: users,
                    nbTourRestant: nbTourRestant
                });
            }
        }
    });

    socket.on('nextPlayerOk', function(u){
        // On récupère le prochain joueur
        var nextOne = UserManager.getByOrder(users, (u.order * 1) + 1);
        // Si on est à la fin de l'array on repasse à l'index 0
        if(!nextOne)
            nextOne = UserManager.getByOrder(users, 0);

        // Si il y a une action1 on emet l'event
        if(nextOne.action1 != ''){
            DebugManager.messageForUser(nextOne, 'son tour');

            io.sockets.emit('nextPlayer', {
                user: nextOne,
                users: users
            });
        }
        // Sinon c'est qu'on passe à la deuxieme action
        else {
            // Si tout le monde a joué ses deux actions on repasse à la prévision
            if(GameManager.everyoneIsNok(users)){
                nbTourRestant--;
                io.sockets.emit('nextTurn', {
                    users: users,
                    nbTourRestant: nbTourRestant
                });
            }
            // Sinon on récupère le prochain joueur
            else {
                var o = (nextOne.order * 1);
                while(nextOne && (nextOne.action2 === '' || nextOne.action2 === null)){
                    nextOne = UserManager.getByOrder(users, ((o * 1) + 1));
                    o++;
                }

                // Si on a trouvé un joeur avec une deuxieme action
                if(nextOne){
                    DebugManager.messageForUser(nextOne, 'son tour');

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
                    nbTourRestant--;
                    io.sockets.emit('nextTurn', {
                        users: users,
                        nbTourRestant: nbTourRestant
                    });
                }
            }
        }
    });

    // L'action prévu ne peut-être effectuée
    socket.on('noPossibilities', function(object){
        var u = object.user;

        DebugManager.messageForUser(u, 'effectue l\'action' + (u.action1 === '' ? u.action2 : u.action1) + ' sans possibilité...');

        if(u.action1 === ''){
            u.action2 = '';
            u.ready = false;
        }
        u.action1 = '';
        // On update le user
        users[UserManager.getById(users, u.id)] = u;

        // On récupère le prochain joueur
        var nextOne = UserManager.getByOrder(users, (u.order * 1) + 1);
        // Si on est à la fin de l'array on repasse à l'index 0
        if(!nextOne)
            nextOne = UserManager.getByOrder(users, 0);

        // Si il y a une action1 on emet l'event
        if(nextOne.action1 != ''){
            DebugManager.messageForUser(nextOne, 'son tour');

            io.sockets.emit('nextPlayer', {
                user: nextOne,
                users: users
            });
        }
        // Sinon c'est qu'on passe à la deuxieme action
        else {
            // Si tout le monde a joué ses deux actions on repasse à la prévision
            if(GameManager.everyoneIsNok(users)){
                nbTourRestant--;
                io.sockets.emit('nextTurn', {
                    users: users,
                    nbTourRestant: nbTourRestant
                });
            }
            // Sinon on récupère le prochain joueur
            else {
                var o = (nextOne.order * 1);
                while(nextOne && (nextOne.action2 === '' || nextOne.action2 === null)){
                    nextOne = UserManager.getByOrder(users, ((o * 1) + 1));
                    o++;
                }

                // Si on a trouvé un joeur avec une deuxieme action
                if(nextOne){
                    DebugManager.messageForUser(nextOne, 'son tour');

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
                    nbTourRestant--;
                    io.sockets.emit('nextTurn', {
                        users: users,
                        nbTourRestant: nbTourRestant
                    });
                }
            }
        }
    });

    // Tue quelqu'un
    socket.on('killUser', function(user){

        users.splice(UserManager.getById(users, user.id), 1);
        io.sockets.emit('disconnectedUser', user);

        DebugManager.messageForUser(user, 'est mort');
        DebugManager.debugArrayOfObject(users);

        if(GameManager.gardienWins(users)){
            isAGame = false;
            UserManager.killLastUsers(users);
            me = null;
            nbUser = users.length;
            io.sockets.emit('canConnect', isAGame);
            io.sockets.emit('gardienWins');
        }
    });

    // Retourne à la case central
    socket.on('goToCentral', function(user){
        DebugManager.messageForUser(user, 'est mort');

        var u = UserManager.getById(users, user.id);
        users[u].position.x = 2;
        users[u].position.y = 2;

        io.sockets.emit('userCentral', users[u]);
    });

    // Effectue l'action controller via la case controller
    socket.on('controlEffect', function(user){
        DebugManager.messageForUser(user, 'va controller une rangé');

        var u = UserManager.getById(users, user.id);
        users[u].position.x = 2;
        users[u].position.y = 2;

        io.sockets.emit('userCentral', users[u]);
    });

    // Tue la première personne présente sur la case poison
    socket.on('deathForFirstHere', function(user){
        var u = UserManager.getInTheSameCase(users, user)[0];

        if(u != null){
            users.splice(UserManager.getById(users, u.id), 1);
            io.sockets.emit('disconnectedUser', u);

            DebugManager.messageForUser(u, 'est mort');
            DebugManager.debugArrayOfObject(users);

            if(GameManager.gardienWins(users)){
                io.sockets.emit('gardienWins');
            }
        }
    });

    // Quand un utilisateur se téléporte via la case spécifique
    socket.on('exchangeTuile', function(object){
        var u = UserManager.getById(users, object.id);
        var lastCoords = users[u].position.x + "-" + users[u].position.y;

        var targetUsers = UserManager.getInTheSameCase(users, users[u]);

        users[u].position.x = object.coords.split('-')[0];
        users[u].position.y = object.coords.split('-')[1];
        
        for(var i in targetUsers){
            if(users.hasOwnProperty(i)){
                users[i].position.x = object.coords.split('-')[0];
                users[i].position.y = object.coords.split('-')[1];
            }
        }

        DebugManager.messageForUser(users[u], 'se téléporte en ' + users[u].position.x + '-' + users[u].position.y);

        targetUsers.push(users[u]);
        io.sockets.emit('exchangeTuile', {
            users: targetUsers, 
            user: users[u],
            lastCoords: lastCoords
        });
    });

    // Quand un utilisateur échange tuile
    socket.on('exchangeAndApplyTuile', function(object){
        var u = UserManager.getById(users, object.id);
        var lastCoords = users[u].position.x + "-" + users[u].position.y;

        DebugManager.messageForUser(users[u], ' échange sa tuile avec ' + users[u].position.x + '-' + users[u].position.y);

        io.sockets.emit('exchangeAndApplyTuile', {
            users: users, 
            user: users[u],
            lastCoords: lastCoords,
            newCoords: object.coords
        });
    });

    // Quand un utilisateur se deconnecte
    socket.on('disconnect', function(reason) {
        if (!me) {
            return false;
        }

        // On supprime l'utilisateur du tableau
        users.splice(UserManager.getById(users, me.id), 1);

        DebugManager.messageForUser(me, 's\'est deconnecté');
        DebugManager.debugArrayOfObject(users);
        console.log(reason);

        // Et on émet à tous les autres joueurs qu'un utilisateur s'est deconnecté
        io.sockets.emit('disconnectedUser', me);

        if (!GameManager.moreThanFourPlayers(users)) {
            io.sockets.emit('cantPlay');
        }
    });
});
