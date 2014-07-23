var http = require('http');
var httpServer = http.createServer(function(req, res) {
    console.log('Un utilisateur a affiche la page');
});
httpServer.listen(1337);

var io = require('socket.io').listen(httpServer);
var users = [];
var User = function(name) {
    this.id = 0;
    this.name = name;
    this.position = {
        x: 2,
        y: 2
    };
};

io.sockets.on('connection', function(socket) {
    console.log('Nouvel utilisateur');
    var me = false;

    socket.on('readyToPlay', function(name) {
        me = new User(name);
        me.id = users.length;

        users[me.id] = me;

        io.sockets.emit('connectedUser', me);

        console.log('Le visiteur ' + me.id + ' s\'est connecté');
    });

    socket.on('disconnect', function() {
        if (!me) {
            return false;
        }

        delete users[me.id];
        users.splice(me.id, 1);
        io.sockets.emit('disconnectedUser', me);
    });
});

function idInArray(array, id) {
    for (var a in array) {
        if (array[a] == id || a == id)
            return true;
    }
    return false;
}

function debugArray(array) {
    for (var a in array) {
        console.log(a + ' -> ' + array[a]);
    }
}