function ClientController(view) {
    this.socket = {};
    this.view = view;
}

ClientController.prototype.initialize = function() {
    this.socket = io.connect('http://localhost:1337');

    that = this;

    // Lorsqu'un utilisateur s'est connecté
    this.socket.on('connectedUser', function(object) {
        that.view.appendUserID(object.me);
        that.view.refreshUsers(object.users);
    });
    // Lorsqu'un utilisateur s'est deconnecté
    this.socket.on('disconnectedUser', function(user) {
        that.view.deleteUser(user);
    });
    // Lorsqu'un utilisateur a choisi un personnage
    this.socket.on('newCharacter', function(object) {
        that.view.deleteCharacter(object.id, object.name, object.pseudo);
    });
    // Supprime le bouton si tout le monde n'est pas prêt (personnage)
    this.socket.on('cantPlay', function() {
        that.view.deleteButton();
    });
    // On fait apparaître le bouton si tout le monde est prêt (personnage)
    this.socket.on('letsPlay', function() {
        that.view.showButton();
    });
    // Si tout le monde est ok (actions)
    this.socket.on('everyoneIsOk', function(users) {
        that.view.hideActions();
        var u = {};

        for (var a in users) {
            if (users.hasOwnProperty(a)) {
                if (users[a].order == 1){
                    u = users[a];
                    break;
                }
            }
        }
        that.view.appendTurnOf(u, users);
    });

    // Si on a reçu le signal de jeu
    this.socket.on('play', function(object) {
        LastCoords = object.lastCardsCoords;
        OtherCoords = object.otherCoords;

        that.view.redirectToGame(object);
    });

    this.socket.on('doNextSentence', function(object){
        that.view.nextSentence({
            user: object.user,
            action: object.action,
            idTarget: object.idTarget
        });
    });
};

// Nouvel utilisateur avec un pseudo
ClientController.prototype.newUser = function(name) {
    this.socket.emit('readyToPlay', {
        name: name
    });
};

// Actions choisies
ClientController.prototype.validateAction = function(id, action1, action2) {
    this.socket.emit('playerReady', {
        id: id,
        action1: action1,
        action2: action2
    });
};

// Personnage choisi
ClientController.prototype.characterChoosen = function(name, id) {
    this.socket.emit('characterChoosen', {
        name: name,
        id: id
    });
};

// Clique sur le bouton "jouer"
ClientController.prototype.play = function() {
    this.socket.emit('emitPlay');
};

// effectue l'action du joueur
ClientController.prototype.emitAction = function(element){
    var action = element.attr('data-action');

    if(action === 'Déplacer' || action === 'Regarder'){
        this.socket.emit('doAction', {
            id: $('.userID').val(),
            action: action,
            coords: element.parent().attr('data-position')
        });
        $('.selectMe').remove();
    }
    else if(action === 'Contrôller') {
        this.view.nextSentence({
            id: $('.userID').val(),
            action: action,
            coords: element.parent().attr('data-position')
        });
    }
    else if(action === 'Pousser' && element.parent().hasClass('character')){
        var idTarget = element.parent().removeClass('character').attr('class').split('-')[1];
        element.parent().addClass('character');

        this.socket.emit('getUserAndDoNextSentence', {
            id: $('.userID').val(),
            action: action,
            idTarget: idTarget
        });
    }
    else {
        this.socket.emit('doAction', {
            id: $('.userID').val(),
            action: action,
            coords: element.parent().attr('data-position'),
            character: $('.characterSelectMe').parent().removeClass('character').attr('class').split('-')[1]
        });
        $('.characterSelectMe').parent().addClass('character');
        $('.selectMe').remove();
    }
};

// effectue l'action du joueur
ClientController.prototype.emitComplexAction = function(object){
    this.socket.emit('doAction', {
        id: $('.userID').val(),
        action: object.action,
        sens: object.sens,
        coords: object.position
    });
};