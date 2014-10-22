function MainView(helper) {
    this.caseWidth = 175;
    this.caseHeight = 175;

    this.Helper = helper;
    this.CaseEffect = null;
}

MainView.prototype.setCaseEffect = function(ce) {
    this.CaseEffect = ce;
};

// On garde le UserID courant caché dans le DOM
MainView.prototype.appendUserID = function(user) {
    var that = this;
    that.Helper.SetCurrentID(user.id);
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
    this.Helper.GetCharacterDiv(user.id).addClass('dead');

    this.appendTmpMessage('Le joueur ' + user.name + ' est mort !');
};

// Un utilisateur arrive en retard --> on met à jours tous les personnage pris
MainView.prototype.refreshUsers = function(users) {
    for (var u in users) {
        if (users.hasOwnProperty(u)) {
            if (users[u].character !== '') {
                $('ul.personnage li').each(function(){
                	var element = $(this);

				    if (element.children('span').text() == users[u].character) {
				    	if($('.characterTaken-' + users[u].id).length === 0)
				        	element.append('<div class="characterTaken characterTaken-' + users[u].id + '"><p>' + users[u].name + '</p></div>');
				    }
                });
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
    var that = this;
    var userId = that.Helper.GetCurrentID();

    $('.readyToPlay').val(1);
    $('.readyToPlay').trigger('change');

    setTimeout(function() {
        that.Helper.SetCurrentID(userId);
        that.showPlayers(object);
        that.showIdentity(object.users, userId);
        $('.coordsReady').val(1);
        $('.coordsReady').trigger('change');
    }, 500);
};

// Tour d'après
MainView.prototype.nextTurn = function(object) {
	$('.actions .action').fadeIn('slow');
	$('.actions .action').children('p').remove();

	$('.actions .action').each(function(){
		$(this).removeClass('ok').removeClass('actionOk-1').removeClass('actionOk-2');
		$(this).css({
			'margin-top': '5px'
		});
	});
};

// On montre tous les joueurs sur la case départ
MainView.prototype.showPlayers = function(object) {
    var that = this;
    var cpt = 0;
    for (var u in object.users) {
        if (object.users.hasOwnProperty(u)) {
            if (object.users[u].id != that.Helper.GetCurrentID().parseInt())
                $('.gameboard').append('<div class="character character-' + object.users[u].id + '">' + object.users[u].name + '</div>');
            else
                $('.gameboard').append('<div class="myCharacter character character-' + object.users[u].id + '">' + object.users[u].name + '</div>');

            
            var userDIV = that.Helper.GetCharacterDiv(object.users[u].id);
            if (cpt >= 3) {
                userDIV.css('left', ((2 * that.caseWidth) + ((cpt - 3) * $('.character').outerWidth())) + 'px');
                userDIV.css('top', ((2 * that.caseHeight) + $('.character').outerWidth()) + 'px');
            } else {
                userDIV.css('left', ((2 * that.caseWidth) + (cpt * $('.character').outerWidth())) + 'px');
                userDIV.css('top', (2 * that.caseHeight) + 'px');
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
MainView.prototype.appendTurnOf = function(u, users, actionNumber) {
    var that = this;
    $('.tourDe p').html('Tour de ' + u.name);

    if(u.id == $('.userID').val()){
        $('.loading').remove();
        $('.actions .action').fadeOut('slow');

        var actionDIV;
        if(actionNumber == 1){
            actionDIV = that.Helper.GetAction(u.action1);
        	actionDIV.parent().fadeIn(100).append('<p>' + actionDIV.parent().attr('data-first-sentence') + '</p>');
        }
        else{
            actionDIV = that.Helper.GetAction(u.action2);
        	actionDIV.parent().fadeIn(100).append('<p>' + actionDIV.parent().attr('data-first-sentence') + '</p>');
        }

        manageTurn(u, users, this.Helper);
    }
};

 // Affiche la seconde phrase d'une  action complexe
MainView.prototype.nextSentence = function(object) {
    var that = this;
    var actionDIV = that.Helper.GetAction(object.action);
    actionDIV.parent().children('p').html(actionDIV.parent().attr('data-second-sentence'));

    manageComplexAction(object, this.Helper);
};

// action se déplacer
MainView.prototype.deplacer = function(user) {
	var that = this;
	that.Helper.GetCharacterDiv(user.id).animate({
		top: (that.caseHeight * user.position.y) + 'px',
		left: (that.caseWidth * user.position.x) + 'px'
	}, 500, function(){
        while(that.someoneHere(user)){
            that.moveUser(user);
        }
    });

    var tuile = that.Helper.GetTuile(user.position.x, user.position.y);
	var imgs = tuile.children('img');
	imgs.first().removeClass('ng-hide');
	imgs.first().fadeIn('slow');
	imgs.last().fadeOut('slow');

    this.CaseEffect.manageCaseEffect(user, tuile.attr('data-action'));
};

// Action pousser
MainView.prototype.pousser = function(user) {
	var that = this;
	that.Helper.GetCharacterDiv(user.id).animate({
		top: (that.caseHeight * user.position.y) + 'px',
		left: (that.caseWidth * user.position.x) + 'px'
	}, 500);

    var tuile = that.Helper.GetTuile(user.position.x, user.position.y);
	var imgs = tuile.children('img');
	imgs.first().removeClass('ng-hide');
	imgs.first().fadeIn('slow');
	imgs.last().fadeOut('slow');

    that.CaseEffect.manageCaseEffect(user, tuile.attr('data-action'));
};

MainView.prototype.exchangeTuileAndUsers = function(users, user, lastCoords) {
    var futurTuile = this.Helper.GetTuile(user.position.x, user.position.y);
    var lastTuile = this.Helper.GetTuile(lastCoords.split('-')[0], lastCoords.split('-')[1]);
    var that = this;

    lastTuile.animate({
        'top': ((futurTuile.attr('data-position').split('-')[1].parseInt()) * that.caseHeight) + 'px',
        'left': ((futurTuile.attr('data-position').split('-')[0].parseInt()) * that.caseWidth) + 'px'
    }, 500);

    futurTuile.animate({
        'top': ((lastTuile.attr('data-position').split('-')[1].parseInt()) * that.caseHeight) + 'px',
        'left': ((lastTuile.attr('data-position').split('-')[0].parseInt()) * that.caseWidth) + 'px'
    }, 500);

    for(var u in users){
        if(users.hasOwnProperty(u)){
            that.Helper.GetCharacterDiv(users[u].id).animate({
                'top': ((users[u].position.y * 1) * that.caseHeight) + 'px',
                'left': ((users[u].position.x * 1) * that.caseWidth) + 'px'
            }, 500);
        }
    }

    lastTuile.attr('data-position', futurTuile.attr('data-position'));
    futurTuile.attr('data-position', lastCoords);

    setTimeout(function(){
        for(var u in users){
            if(users.hasOwnProperty(u)){
                while(that.someoneHere(users[u])){
                    that.moveUser(users[u]);
                }
            }
        }
    }, 500);
};


MainView.prototype.exchangeTuile = function(id) {
    if(id == this.Helper.GetCurrentID()){
        coords = getAllCoords();
        appendSelect(coords, 'teleporter', this.Helper);
        return true;
    }
};

// Action regarder
MainView.prototype.regarder = function(userId, coords) {

    if(!coords){
        coords = getAllCoords();
        appendSelect(coords, 'regarderMaster', this.Helper);
        return true;
    }
	var that = this;
	var position = {
		x: coords.split('-')[0].parseInt(),
		y: coords.split('-')[1].parseInt()
	};

	if(userId == that.Helper.GetCurrentID()){
		var imgs = that.Helper.GetTuile(position.x, position.y).children('img');

		if(imgs.first().hasClass('ng-hide')){
			imgs.first().removeClass('ng-hide');
			imgs.first().fadeIn('slow');
			imgs.last().fadeOut('slow');

			setTimeout(function(){
				imgs.first().addClass('ng-hide');
				imgs.first().fadeOut('slow');
				imgs.last().fadeIn('slow');
			}, 3000);
		}
	}
};

// Action contrôller
MainView.prototype.controller = function(users, coords, sens) {
    var that = this;

    if (!coords && !sens && users.id == that.Helper.GetCurrentID()){
        var coords = getAllControllerCoords();
        appendSelect(coords, 'controllerMaster', this.Helper);
        return true;
    }
    if(sens == 'left' || sens == 'right'){
        $('.tuile').each(function(){
            var x = $(this).attr('data-position').split('-')[0].parseInt();
            var y = $(this).attr('data-position').split('-')[1].parseInt();

            if(y == coords.split('-')[1].parseInt()){
                if(x == 0 && sens === 'left')
                    x = 4;
                else if(x == 4 && sens === 'right')
                    x = 0;
                else if(sens === 'left')
                    x = x - 1;
                else
                    x = x + 1;

                $(this).attr('data-position', x + '-' + y);
                $(this).addClass('moved');
            }
        });
    }
    else if(sens === 'top' || sens === 'bottom'){
        $('.tuile').each(function(){
            var x = $(this).attr('data-position').split('-')[0].parseInt();
            var y = $(this).attr('data-position').split('-')[1].parseInt();

            if(x == coords.split('-')[0].parseInt()){

                if(y == 0 && sens === 'top')
                    y = 4;
                else if(y == 4 && sens === 'bottom')
                    y = 0;
                else if(sens === 'top')
                    y = y - 1;
                else
                    y = y + 1;

                $(this).attr('data-position', x + '-' + y);
                $(this).addClass('moved');
            }
        });
    }
    $('.moved').each(function(){
        $(this).animate({
            'top': (($(this).attr('data-position').split('-')[1].parseInt()) * that.caseHeight) + 'px',
            'left': (($(this).attr('data-position').split('-')[0].parseInt()) * that.caseWidth) + 'px'
        }, 500);
    });

    for(var u in users){
        if(users.hasOwnProperty(u)){
            that.Helper.GetCharacterDiv(users[u].id).animate({
                'top': (users[u].position.y * 1) * that.caseHeight,
                'left': (users[u].position.x * 1) * that.caseWidth
            }, 500);
        }
    }
    setTimeout(function(){
        for(var u in users){
            if(users.hasOwnProperty(u)){
                while(that.someoneHere(users[u])){
                    that.moveUser(users[u]);
                }
            }
        }
    }, 500);

    setTimeout(function(){
        $('.moved').removeClass('moved');
    }, 200);
};


/*************
 * FUNCTIONS *
 *************/

MainView.prototype.someoneHere = function(user){
    var that =  this;
    var anybody = false;
    var $user = this.Helper.GetCharacterDiv(user.id);

    $('.character').each(function(){
        if($(this).css('top') == $user.css('top') && $(this).css('left') == $user.css('left') && !$(this).hasClass('character-' + user.id)){
            anybody = true;
        }
    });
    return anybody;
};

MainView.prototype.moveUser = function(user){
    var userDIV = this.Helper.GetCharacterDiv(user.id);
    userDIV.css('left', ((userDIV.css('left').substr(0, userDIV.css('left').length - 2).parseInt() + 50) + 'px'));
};

MainView.prototype.gardienWins = function() {
    $('.gameboard').append('<p class="tmpMessage">La partie est finie, les gardiens ont gagné !</p>');
};

MainView.prototype.appendTmpMessage = function(message){
    $('.gameboard').append('<p class="tmpMessage tmp">' + message + '</p>');

    setTimeout(function(){
        $('.tmpMessage.tmp').fadeOut('slow', function(){
            $(this).remove();
        });
    }, 3000);
};

// Gère le tour d'une personne
function manageTurn(u, users, helper){
    // Affiche les cases possible
    var coords = [];

    if(u.action1 !== ''){
        if(u.action1 === 'Déplacer'){
            coords = getCoordsDeplacerRegarder(u);
            appendSelect(coords, u.action1, helper);
        }
        else if(u.action1 === 'Pousser'){
            for(var a in users){
                if(users.hasOwnProperty(a)){
                    if(users[a].id !== u.id && users[a].position.x === u.position.x && users[a].position.y === u.position.y)
                        coords.push(users[a]);
                }
            }
            appendCharacterSelectMe(coords, u.action1, helper);
        }
        else if(u.action1 === 'Regarder'){
            coords = getCoordsDeplacerRegarder(u);
            appendSelect(coords, u.action1, helper);
        }
        else if(u.action1 === 'Contrôller'){
            coords = getCoordsController(u);
            appendSelect(coords, u.action1, helper);
        }
    }
    else {
        if(u.action2 === 'Déplacer'){
            coords = getCoordsDeplacerRegarder(u);
            appendSelect(coords, u.action2, helper);
        }
        else if(u.action2 === 'Pousser'){
            for(var b in users){
                if(users.hasOwnProperty(b)){
                    if(users[b].id !== u.id && users[b].position.x === u.position.x && users[b].position.y === u.position.y)
                        coords.push(users[b]);
                }
            }
            appendCharacterSelectMe(coords, u.action2, helper);
        }
        else if(u.action2 === 'Regarder'){
            coords = getCoordsDeplacerRegarder(u);
            appendSelect(coords, u.action2, helper);
        }
        else if(u.action2 === 'Contrôller'){
            coords = getCoordsController(u);
            appendSelect(coords, u.action2, helper);
        }
    }
}

// gère une action complète
function manageComplexAction(object, helper){
    if(object.action === 'Pousser'){
    	coords = getCoordsDeplacerRegarder(object.user);
        appendSelect(coords, object.action, helper);
    }
    else if(object.action === 'Contrôller'){
        if($('.selectMe').length > 8){
            $('.tourDe').append(
                '<p class="sensArrows" data-position=' + object.coords + '>' +
                    '<span class="right direction">&rarr;</span>' +
                    '<span class="left direction">&larr;</span>' +
                    '<span class="top direction">&uarr;</span>' +
                    '<span class="bottom direction">&darr;</span>' +
                '</p>');
        }
        else {
            if(object.coords.split('-')[0].parseInt() > object.user.position.x || object.coords.split('-')[0].parseInt() < object.user.position.x){
                $('.tourDe').append(
                    '<p class="sensArrows" data-position=' + object.coords + '>' +
                        '<span class="right direction">&rarr;</span>' +
                        '<span class="left direction">&larr;</span>' +
                    '</p>');
            }
            else {
                $('.tourDe').append(
                    '<p class="sensArrows" data-position=' + object.coords + '>' +
                        '<span class="top direction">&uarr;</span>' +
                        '<span class="bottom direction">&darr;</span>' +
                    '</p>');
            }
        }
    }
}

function appendSelect(coords, action, helper){
    for(var c in coords){
        if(coords.hasOwnProperty(c)){
            helper.GetTuile(coords[c].x, coords[c].y).append('<div class="selectMe" data-action="' + action + '"></div>');
            $('.selectMe').animate({'width': '175px', 'height':'175px'}, 500);
        }
    }
}

function appendCharacterSelectMe(coords, action, helper){
    for(var c in coords){
        if(coords.hasOwnProperty(c)){
            helper.GetCharacterDiv(coords[c].id).append('<div class="characterSelectMe" data-action="' + action + '"></div>');
        }
    }
}

function getCoordsController(u){
    var coords = [];

    if(u.position.x != 2 && u.position.y != 2){
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
    else if(u.position.x != 2 && u.position.y == 2){
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
    else if(u.position.x == 2 && u.position.y != 2){
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
    else {
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
    }

    return coords;
}

function getCoordsDeplacerRegarder(u){
    var coords = [];

    if((u.position.x * 1) > 0){
        coords.push({
            x: (u.position.x * 1) - 1,
            y: (u.position.y * 1)
        });
    }
    if((u.position.x * 1) < 4){
        coords.push({
            x: (u.position.x * 1) + 1,
            y: (u.position.y * 1)
        });
    }
    if((u.position.y * 1) > 0){
        coords.push({
            x: (u.position.x * 1),
            y: (u.position.y * 1) - 1
        });
    }
    if((u.position.y * 1) < 4){
        coords.push({
            x: (u.position.x * 1),
            y: (u.position.y * 1) + 1
        });
    }

    return coords;
}

function getAllCoords(){
    var coords = [];

    coords.push(
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 0, y: 2},
        {x: 0, y: 3},
        {x: 0, y: 4},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 1, y: 2},
        {x: 1, y: 3},
        {x: 1, y: 4},
        {x: 2, y: 0},
        {x: 2, y: 1},
        {x: 2, y: 3},
        {x: 2, y: 4},
        {x: 3, y: 0},
        {x: 3, y: 1},
        {x: 3, y: 2},
        {x: 3, y: 3},
        {x: 3, y: 4},
        {x: 4, y: 0},
        {x: 4, y: 1},
        {x: 4, y: 2},
        {x: 4, y: 3},
        {x: 4, y: 4}
    );

    return coords;
}

function getAllControllerCoords(){
    var coords = [];

    coords.push(
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 0, y: 3},
        {x: 0, y: 4},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 1, y: 3},
        {x: 1, y: 4},
        {x: 3, y: 0},
        {x: 3, y: 1},
        {x: 3, y: 3},
        {x: 3, y: 4},
        {x: 4, y: 0},
        {x: 4, y: 1},
        {x: 4, y: 3},
        {x: 4, y: 4}
    );

    return coords;
}