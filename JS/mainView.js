function MainView() {
    this.caseWidth = 175;
    this.caseHeight = 175;
}

// On garde le UserID courant caché dans le DOM
MainView.prototype.appendUserID = function(user) {
    $('.userID').val(user.id + '');
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
            if (object.users[u].id != $('.userID').val())
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

// On affiche pour chaque joueur son identitée
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

// On anime les actions
MainView.prototype.animateAction = function(element, toggle) {
    if (toggle) {
        element.animate({
            'margin-top': '20px'
        }, 300);
        element.addClass('ok').addClass('actionOk-' + $('.action.ok').length);
    } else {
        element.animate({
            'margin-top': '5px'
        }, 300);
        element.removeClass('actionOk-' + element.attr('class').split(' ').last().split('-').last()).removeClass('ok');
    }
};

// On montre le bouton de validation des actions
MainView.prototype.showButtonOk = function() {
    $('.btnOk').fadeIn('slow', function() {
        $('.btnOk').css('display', 'block');
    });
};

// On cache le bouton de validation des actions
MainView.prototype.hideButtonOk = function() {
    $('.btnOk').fadeOut('slow');
};

// On désactive les actions (loader par dessus)
MainView.prototype.disableActions = function() {
    $('.actions').append('<div class="loading"><p>En attente des autres joueurs...</p><img src="Images/loader.gif" alt="loader"></div>');
};

// On desactive le loader (tout le monde est prêt)
MainView.prototype.hideActions = function() {
    $('.loading img').remove();
    $('.btnOk').fadeOut('slow');
    $('.loading p').html('C\'est parti !');
};

// Affiche le tour de
MainView.prototype.appendTurnOf = function(u, users) {
    $('.tourDe p').html('Tour de ' + u.name);

    if(u.id == $('.userID').val()){
        $('.loading').remove();
        $('.actions .action').fadeOut('slow');

        $('.action img[alt="' + u.action1 + '"]').parent().fadeIn(100).append('<p>' + $('.action img[alt="' + u.action1 + '"]').parent().attr('data-first-sentence') + '</p>');

        manageTurn(u, users);
    }
};

MainView.prototype.nextSentence = function(object) {
    $('.action img[alt="' + object.action + '"]').parent().children('p').html($('.action img[alt="' + object.action + '"]').parent().attr('data-second-sentence'));

    manageComplexAction(object);
}

// Affiche un film par dessus un personnage représentant le joueur qui l'a prit
function appendCharacterTaken(users, u, element) {
    if (element.children('span').text() == users[u].character) {
        element.append('<div class="characterTaken characterTaken-' + users[u].id + '"><p>' + users[u].name + '</p></div>');
    }
}

function manageTurn(u, users){
    // Affiche les cases possible
    var coords = [];

    if(u.action1 !== ''){
        if(u.action1 === 'Déplacer'){
            coords = getCoordsDeplacerRegarder(u);
            appendSelect(coords, u.action1);
        }
        else if(u.action1 === 'Pousser'){
            for(var a in users){
                if(users.hasOwnProperty(a)){
                    if(users[a].id !== u.id && users[a].position.x === u.position.x && users[a].position.y === u.position.y)
                        coords.push(users[a]);
                }
            }
            appendCharacterSelectMe(coords, u.action1);
        }
        else if(u.action1 === 'Regarder'){
            coords = getCoordsDeplacerRegarder(u);
            appendSelect(coords, u.action1);
        }
        else if(u.action1 === 'Contrôller'){
            coords = getCoordsController(u);
            appendSelect(coords, u.action1);
        }
    }
    else {
        if(u.action2 === 'Déplacer'){
            coords = getCoordsDeplacerRegarder(u);
            appendSelect(coords, u.action2);
        }
        else if(u.action2 === 'Pousser'){
            for(var a in users){
                if(users.hasOwnProperty(a)){
                    if(users[a].id !== u.id && users[a].position.x === u.position.x && users[a].position.y === u.position.y)
                        coords.push(users[a]);
                }
            }
            appendCharacterSelectMe(coords, u.action2);
        }
        else if(u.action2 === 'Regarder'){
            coords = getCoordsDeplacerRegarder(u);
            appendSelect(coords, u.action2);
        }
        else if(u.action2 === 'Contrôller'){
            coords = getCoordsController(u);
            appendSelect(coords, u.action2);
        }
    }
}

function manageComplexAction(object){
    if(object.action === 'Pousser'){
    	coords = getCoordsDeplacerRegarder(object.user);
        appendSelect(coords, object.action);
    }
    else if(object.action === 'Contrôller'){
        $('.tourDe').append(
        '<p data-position=' + object.coords + '>' +
        	'<span class="top direction">&uarr;</span>' +
        	'<span class="right direction">&rarr;</span>' +
        	'<span class="bottom direction">&darr;</span>' +
        	'<span class="left direction">&harr;</span>' +
        '</p>');
    }
}

function appendSelect(coords, action){
    for(var c in coords){
        if(coords.hasOwnProperty(c)){
            $('.tuile[data-position="'+ coords[c].x + '-' + coords[c].y + '"').append('<div class="selectMe" data-action="' + action + '"></div>');
            $('.selectMe').animate({'width': '175px', 'height':'175px'}, 500);
        }
    }
}

function appendCharacterSelectMe(coords, action){
    for(var c in coords){
        if(coords.hasOwnProperty(c)){
            $('.character-' + coords[c].id).append('<div class="characterSelectMe" data-action="' + action + '"></div>');
        }
    }
}

function getCoordsController(u){
    var coords = [];

    if(u.position.x !== 2 && u.position.y !== 2){
        coords.push(
            {
                x: u.position.x,
                y: 0
            },
            {
                x: u.position.x,
                y: 1
            },
            {
                x: u.position.x,
                y: 2
            },
            {
                x: u.position.x,
                y: 3
            },
            {
                x: u.position.x,
                y: 4
            }
        );
        coords.push(
            {
                x: 0,
                y: u.position.y
            },
            {
                x: 1,
                y: u.position.y
            },
            {
                x: 2,
                y: u.position.y
            },
            {
                x: 3,
                y: u.position.y
            },
            {
                x: 4,
                y: u.position.y
            }
        );
    }
    else if(u.position.x !== 2 && u.position.y === 2){
        coords.push(
            {
                x: 0,
                y: u.position.y
            },
            {
                x: 1,
                y: u.position.y
            },
            {
                x: 2,
                y: u.position.y
            },
            {
                x: 3,
                y: u.position.y
            },
            {
                x: 4,
                y: u.position.y
            }
        );
    }
    else if(u.position.x === 2 && u.position.y !== 2){
        coords.push(
            {
                x: u.position.x,
                y: 0
            },
            {
                x: u.position.x,
                y: 1
            },
            {
                x: u.position.x,
                y: 2
            },
            {
                x: u.position.x,
                y: 3
            },
            {
                x: u.position.x,
                y: 4
            }
        );
    }
/*    else {
    	coords.push(
    		{
                x: 2,
                y: 0
            },
            {
                x: 2,
                y: 1
            },
            {
                x: 2,
                y: 3
            },
            {
                x: 2,
                y: 4
            },
            {
                x: 0,
                y: 2
            },
            {
                x: 1,
                y: 2
            },
            {
                x: 3,
                y: 2
            },
            {
                x: 4,
                y: 2
            }
    	);
    }*/

    return coords;
}

function getCoordsDeplacerRegarder(u){
    var coords = [];

    if(u.position.x > 0){
        coords.push({
            x: u.position.x - 1,
            y: u.position.y
        });
    }
    if(u.position.x < 4){
        coords.push({
            x: u.position.x + 1,
            y: u.position.y
        });
    }
    if(u.position.y > 0){
        coords.push({
            x: u.position.x,
            y: u.position.y - 1
        });
    }
    if(u.position.y < 4){
        coords.push({
            x: u.position.x,
            y: u.position.y + 1
        });
    }

    return coords;
}