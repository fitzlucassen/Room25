function MainView() {
    this.caseWidth = 175;
    this.caseHeight = 175;
}

MainView.prototype.appendUserID = function(user) {
    $('.userID').val(user.id);
};

MainView.prototype.deleteCharacter = function(id, name, pseudo) {
    $('ul.personnage li').each(function() {
        if ($(this).children('span').text() == name) {
            $(this).append('<div class="characterTaken characterTaken-' + id + '"><p>' + pseudo + '</p></div>');
        }
    });
};

MainView.prototype.deleteUser = function(user) {
    $('.characterTaken-' + user.id).remove();
};

MainView.prototype.refreshUsers = function(users) {
    for (var u in users) {
        if (users.hasOwnProperty(u)) {
            if (users[u].character !== '') {
                $('ul.personnage li').each(appendCharacterTaken, users, u, $(this));
            }
        }
    }
};

MainView.prototype.showButton = function() {
    $('.btn').fadeIn(200, function() {
        $('.btn').css('display', 'block');
    });
};
MainView.prototype.deleteButton = function() {
    $('.btn').fadeOut(200);
};

MainView.prototype.redirectToGame = function(object) {
    $('.readyToPlay').val(1);
    $('.readyToPlay').trigger('change');

    var that = this;
    setTimeout(function() {
        that.showPlayers(object);
    }, 500);
};

MainView.prototype.showPlayers = function(object) {
    var that = this;
    var cpt = 0;
    for (var u in object.users) {
        if (object.users.hasOwnProperty(u)) {
            if (object.users[u].id !== object.me.id)
                $('.gameboard').append('<div class="character character-' + object.users[u].id + '">' + object.users[u].name + '</div>');
            else
                $('.gameboard').append('<div class="myCharacter character character-' + object.users[u].id + '">' + object.users[u].name + '</div>');

            $('.character-' + object.users[u].id).css('left', ((2 * that.caseWidth) + (cpt * $('.character').outerWidth())) + 'px');
            $('.character-' + object.users[u].id).css('top', (2 * that.caseHeight) + 'px');
            cpt++;
        }
    }

};

function appendCharacterTaken(users, u, element) {
    if (element.children('span').text() == users[u].character) {
        element.append('<div class="characterTaken characterTaken-' + users[u].id + '"><p>' + users[u].name + '</p></div>');
    }
}