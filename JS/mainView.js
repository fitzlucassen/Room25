function MainView() {
    this.caseWidth = 175;
    this.caseHeight = 175;
}

// On garde le UserID courant caché dans le DOM
MainView.prototype.appendUserID = function(user) {
    $('.userID').val(user.id);
};

// On ajoute un user sur un personnage
MainView.prototype.deleteCharacter = function(id, name, pseudo) {
    $('ul.personnage li').each(function() {
        if ($(this).children('span').text() == name) {
            $(this).append('<div class="characterTaken characterTaken-' + id + '"><p>' + pseudo + '</p></div>');
        }
    });
};

// On supprime un personnage du DOM
MainView.prototype.deleteUser = function(user) {
    $('.characterTaken-' + user.id).remove();
};

// Un utilisateur arrive en retard --> on met à jours tous les personnage pris
MainView.prototype.refreshUsers = function(users) {
    for (var u in users) {
        if (users.hasOwnProperty(u)) {
            if (users[u].character !== '') {
                $('ul.personnage li').each(appendCharacterTaken, users, u, $(this));
            }
        }
    }
};

// On montre le bouton de lancement
MainView.prototype.showButton = function() {
    $('.btn').fadeIn(200, function() {
        $('.btn').css('display', 'block');
    });
};

// On supprime le bouton de lancement
MainView.prototype.deleteButton = function() {
    $('.btn').fadeOut(200);
};

// On redirige, sans rechargement, vers la page du jeu
MainView.prototype.redirectToGame = function(object) {
    var userId = $('.userID').val();

    $('.readyToPlay').val(1);
    $('.readyToPlay').trigger('change');

    var that = this;
    setTimeout(function() {
        $('.userID').val(userId);
        that.showPlayers(object);
        that.showIdentity(object.users, userId);
        $('.coordsReady').val(1);
        $('.coordsReady').trigger('change');
    }, 500);
};

// On montre tous les joueurs sur la case départ
MainView.prototype.showPlayers = function(object) {
    var that = this;
    var cpt = 0;
    for (var u in object.users) {
        if (object.users.hasOwnProperty(u)) {
            if (object.users[u].id !== object.me.id)
                $('.gameboard').append('<div class="character character-' + object.users[u].id + '">' + object.users[u].name + '</div>');
            else
                $('.gameboard').append('<div class="myCharacter character character-' + object.users[u].id + '">' + object.users[u].name + '</div>');

            if (cpt >= 3) {
                $('.character-' + object.users[u].id).css('left', ((2 * that.caseWidth) + ((cpt - 3) * $('.character').outerWidth())) + 'px');
                $('.character-' + object.users[u].id).css('top', ((2 * that.caseHeight) + $('.character').outerWidth()) + 'px');
            } else {
                $('.character-' + object.users[u].id).css('left', ((2 * that.caseWidth) + (cpt * $('.character').outerWidth())) + 'px');
                $('.character-' + object.users[u].id).css('top', (2 * that.caseHeight) + 'px');
            }
            cpt++;
        }
    }

};

MainView.prototype.showIdentity = function(users, meID) {
    for (var u in users) {
        if (users.hasOwnProperty(u)) {
            if (users[u].id == meID) {
                $('.identity img').attr('src', '/Images/identities/' + users[u].identity + '.gif').attr('title', users[u].identity);
                $('.pseudo p').html(users[u].name);
            }
        }
    }
};

function appendCharacterTaken(users, u, element) {
    if (element.children('span').text() == users[u].character) {
        element.append('<div class="characterTaken characterTaken-' + users[u].id + '"><p>' + users[u].name + '</p></div>');
    }
}