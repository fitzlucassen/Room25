function ClientController(view) {
    this.socket = {};
    this.view = view;
}

ClientController.prototype.initialize = function() {
    this.socket = io.connect('http://localhost:1337');

    that = this;
    this.socket.on('connectedUser', function(user) {
        that.view.appendUserID(user);
    });
    this.socket.on('disconnectedUser', function(user) {
        that.view.deleteUser(user);
    });
    this.socket.on('newCharacter', function(object) {
        that.view.deleteCharacter(object.name, object.pseudo);
    });
};

ClientController.prototype.newUser = function(name) {
    this.socket.emit('readyToPlay', {
        name: name
    });
};

ClientController.prototype.characterChoosen = function(name, id) {
    this.socket.emit('characterChoosen', {
        name: name,
        id: id
    });
};