var express = require('express'),
    http = require('http');

var app = express();
var server = http.createServer(app).listen(1337);

var io = require('socket.io').listen(server);

var users = [];
var nbUser = -1;
var User = function(name) {
    this.id = 0;
    this.name = name;
    this.position = {
        x: 2,
        y: 2
    };
    this.character = '';
};

io.sockets.on('connection', function(socket) {
    console.log('Nouvel utilisateur');
    var me = false;

    socket.on('readyToPlay', function(name) {
        me = new User(name.name);
        me.id = ++nbUser;

        users[me.id] = me;

        socket.emit('connectedUser', me);

        console.log('Le visiteur ' + me.id + ' : ' + me.name + ' s\'est connecté');
    });

    socket.on('characterChoosen', function(object) {
        me.character = object.name;

        io.sockets.emit('newCharacter', {
            id: object.id,
            name: object.name,
            pseudo: me.name
        });
    });

    socket.on('disconnect', function() {
        if (!me) {
            return false;
        }

        console.log(me.id + ' : ' + me.name + ' s\'est déconnecté');
        delete users[me.id];
        users.splice(me.id, 1);
        io.sockets.emit('disconnectedUser', me);
    });
});

exports = module.exports = server;
// delegates use() function
exports.use = function() {
    app.use.apply(app, arguments);
};

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