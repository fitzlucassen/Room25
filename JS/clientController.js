function ClientController() {
    this.socket = {};
}

ClientController.prototype.initialize = function() {
    this.socket = io.connect('http://localhost:1337');

    this.socket.on('connectedUser', function(user) {
        View.appendUser(user);
    });
    this.socket.on('disconnectedUser', function(user) {
        View.deleteUser(user);
    });
};

ClientController.prototype.newUser = function() {
    this.socket.emit('readyToPlay');
};