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
};

ClientController.prototype.newUser = function(name) {
    this.socket.emit('readyToPlay', {
        name: name
    });
};