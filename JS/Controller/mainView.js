function MainView(helper, DOMView, CoordsProvider) {
    this.caseWidth = 175;
    this.caseHeight = 175;

    this.Helper = helper;
    this.CaseEffect = null;
    this.DOMView = DOMView;
    this.CoordsProvider = CoordsProvider;
}

MainView.prototype.setCaseEffect = function(ce) {
    this.CaseEffect = ce;
};

// On garde le UserID courant caché dans le DOM
MainView.prototype.appendUserID = function(user) {
    var that = this;
    that.Helper.SetCurrentID(user.id);
};

MainView.prototype.manageMultipleGames = function(available, users){
    if(available){
        $('.hideCharacters').css('display', 'none');
    }
    else {
        var message = 'Il y a actuellement déjà une partie qui se joue entre ';

        for (var u in users) {
            if (users.hasOwnProperty(u)) {
                message += users[u].name;

                if(u === users.length - 2)
                    message += ' et ';
                else if(u < users.length - 2)
                    message += ', ';
            }
        }
        message += '. Veillez patienter jusqu\'à la fin de celle-ci.';
        $('.hideCharacters p').html(message);
        $('.hideCharacters').css('display', 'block');
    }
};

MainView.prototype.allowGame = function() {
    $('.hideCharacters').fadeOut('slow');
};

// On ajoute un user sur un personnage
MainView.prototype.deleteCharacter = function(id, name, pseudo, color) {
    $('ul.personnage li').each(function() {
        if ($(this).children('span').text() == name) {
            $('.characterTaken-' + id).remove();
            $(this).append('<div class="characterTaken characterTaken-' + id + '" style="background:' + color + ';opacity:0.6;"><p>' + pseudo + '</p></div>');
        }
    });
};

// On supprime un personnage du DOM
MainView.prototype.deleteUser = function(user) {
    $('.characterTaken-' + user.id).remove();
    this.Helper.GetCharacterDiv(user.id).addClass('dead');

    this.DOMView.appendTmpMessage('Le joueur ' + user.name + ' est mort !');
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
				        	element.append('<div class="characterTaken characterTaken-' + users[u].id + '" style="background:' + users[u].color + ';opacity:0.6;"><p>' + users[u].name + '</p></div>');
				    }
                });
            }
        }
    }
};

// On redirige, sans rechargement, vers la page du jeu
MainView.prototype.redirectToGame = function(object, rtc) {
    var that = this;
    var userId = that.Helper.GetCurrentID();

    $('.readyToPlay').val(object.users[0].id);
    $('.readyToPlay').trigger('change');

    setTimeout(function() {
        that.Helper.SetCurrentID(userId);
        that.showPlayers(object);
        that.showIdentity(object.users, userId);
        $('.coordsReady').val(1);
        $('.coordsReady').trigger('change');

        var video = $('video.webcam');
        var ids = [];

        for(var u in object.users){
            if(object.users.hasOwnProperty(u)){
                $('.camContainer').append(video.clone().addClass('webcam-' + object.users[u].id));
                ids.push('webcam-' + object.users[u].id);
            }
        }
        video.remove();

        if(object.users[0].id != that.Helper.GetCurrentID()){
            $('#callButton').css('display','none');
            $('#hangupButton').css('display','none');
        }

        rtc.initialize(ids, 'webcam-' + that.Helper.GetCurrentID(), function(){

        });
    }, 500);
};

// Tour d'après
MainView.prototype.nextTurn = function(object) {
    $('.tourRestant').html('Il reste ' + object.nbTourRestant + ' tours.');
    $('.actions .action').fadeIn('slow');
	this.Helper.GetAction().fadeIn('slow');
	$('.actions .action').children('p').remove();
    $('.extendWidth').removeClass('extendWidth');

    $('.action1-final > img, .action2-final > img').remove();

	$('.actions .action').each(function(){
		$(this).removeClass('ok').removeClass('actionOk-1').removeClass('actionOk-2');
	});
};

// On montre tous les joueurs sur la case départ
MainView.prototype.showPlayers = function(object) {
    var that = this;
    var cpt = 0;
    for (var u in object.users) {
        if (object.users.hasOwnProperty(u)) {
            if (object.users[u].id != that.Helper.GetCurrentID().parseInt())
                $('.gameboard').append('<div class="character character-' + object.users[u].id + '" style="opacity: 0.8;background:' + object.users[u].color + ';">' + object.users[u].name + '</div>');
            else
                $('.gameboard').append('<div class="myCharacter character character-' + object.users[u].id + '" style="opacity: 0.8;background:' + object.users[u].color + ';">' + object.users[u].name + '</div>');

            
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
                $('.identity img').attr('src', 'Images/identities/' + users[u].identity + '.gif').attr('title', users[u].identity);
                $('.pseudo p').html(users[u].name);
            }
        }
    }
};

// On anime les actions
MainView.prototype.animateAction = function(element, toggle) {
    var isAction1 = $('.action1-final > img').length === 0;
    var isAction2 = $('.action2-final > img').length === 0;

    if (toggle) {
        var img = element.children('img');

        if(isAction1)
            $('.action1-final').append(img.clone());
        else if(this.Helper.GetCharacterDiv(this.Helper.GetCurrentID()).attr('handicap') != 'noSecondAction')
            $('.action2-final').append(img.clone());
        else
            return true;

        element.children('img').fadeOut('slow');

        element.addClass('ok').addClass('actionOk-' + $('.action.ok').length);
    } else {
        var title = element.attr('title');
        if(!isAction1)
            element.remove();
        else
            element.remove();

        $('.action img[title="' + title + '"]').fadeIn('slow');

        $('.action img[title="' + title + '"]').parent().removeClass('actionOk-' + $('.action img[title="' + title + '"]').parent().attr('class').split(' ').last().split('-').last()).removeClass('ok');
    }
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
            if(that.Helper.GetCharacterDiv(that.Helper.GetCurrentID()).attr('handicap') === 'noSee' && u.action1 === 'Regarder'){
                return true;
            }
            if(that.Helper.GetCharacterDiv(that.Helper.GetCurrentID()).attr('handicap') === 'deathAfterNextAction' && u.action1 !== 'Déplacer'){
                this.CaseEffect.client.emitDeath(u);
            }
            if(that.Helper.GetCharacterDiv(that.Helper.GetCurrentID()).attr('handicap') === 'deathAfterNextTour'){
                that.Helper.GetCharacterDiv(that.Helper.GetCurrentID()).attr('handicap', 'deathAfterThisTour')
            }
            actionDIV = that.Helper.GetAction(u.action1);
        	actionDIV.parent().fadeIn(100).append('<p>' + actionDIV.parent().attr('data-first-sentence') + '</p>');
            actionDIV.parent().parent().addClass('extendWidth');
        }
        else{
            if(that.Helper.GetCharacterDiv(that.Helper.GetCurrentID()).attr('handicap') === 'noSee' && u.action2 === 'Regarder'){
                return true;
            }
            if(that.Helper.GetCharacterDiv(that.Helper.GetCurrentID()).attr('handicap') === 'deathAfterNextAction' && u.action2 !== 'Déplacer'){
                this.CaseEffect.client.emitDeath(u);
            }
            if(that.Helper.GetCharacterDiv(that.Helper.GetCurrentID()).attr('handicap') === 'deathAfterThisTour' && u.action2 !== 'Déplacer'){
                this.CaseEffect.client.emitDeath(u);
            }
            actionDIV = that.Helper.GetAction(u.action2);
        	actionDIV.parent().fadeIn(100).append('<p>' + actionDIV.parent().attr('data-first-sentence') + '</p>');
            actionDIV.parent().parent().addClass('extendWidth');
        }

        manageTurn(u, users, this.Helper, this.CoordsProvider);
    }
};

 // Affiche la seconde phrase d'une  action complexe
MainView.prototype.nextSentence = function(object) {
    var that = this;
    var actionDIV = that.Helper.GetAction(object.action);
    actionDIV.parent().children('p').html(actionDIV.parent().attr('data-second-sentence'));

    manageComplexAction(object, this.Helper, this.CoordsProvider);
};

// action se déplacer
MainView.prototype.deplacer = function(user) {
	var that = this;
	this.Helper.GetCharacterDiv(user.id).animate({
		top: (that.caseHeight * user.position.y) + 'px',
		left: (that.caseWidth * user.position.x) + 'px'
	}, 500, function(){
        while(that.someoneHere(user)){
            that.moveUser(user);
        }
    });

    var tuile = this.Helper.GetTuile(user.position.x, user.position.y);
	var imgs = tuile.children('img');
	imgs.first().removeClass('ng-hide');
	imgs.first().fadeIn('slow');
	imgs.last().fadeOut('slow');

    this.Helper.GetCharacterDiv(user.id).removeAttr('handicap');
    if(user.id == this.Helper.GetCurrentID())
        that.CaseEffect.manageCaseEffect(user, tuile.attr('data-action'));
};

// Action pousser
MainView.prototype.pousser = function(userTarget, user) {
	var that = this;
	that.Helper.GetCharacterDiv(userTarget.id).animate({
		top: (that.caseHeight * userTarget.position.y) + 'px',
		left: (that.caseWidth * userTarget.position.x) + 'px'
	}, 500);

    var tuile = that.Helper.GetTuile(userTarget.position.x, userTarget.position.y);
	var imgs = tuile.children('img');
	imgs.first().removeClass('ng-hide');
	imgs.first().fadeIn('slow');
	imgs.last().fadeOut('slow');

    this.Helper.GetCharacterDiv(userTarget.id).removeAttr('handicap');
    if(user.id == this.Helper.GetCurrentID())
        that.CaseEffect.manageCaseEffect(userTarget, tuile.attr('data-action'), user);
};

// Action regarder
MainView.prototype.regarder = function(userId, coords) {
    if(!coords && userId == this.Helper.GetCurrentID()){
        this.DOMView.appendTmpMessage('Choisissez la case que vous souhaitez regarder.');
        coords = this.CoordsProvider.getAllCoords();
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
        this.DOMView.appendTmpMessage('Choisissez la rangée que vous souhaitez contrôller.');
        coords = this.CoordsProvider.getAllControllerCoords();
        appendSelect(coords, 'controllerMaster', this.Helper);
        return true;
    }
    if(sens == 'left' || sens == 'right'){
        $('.tuile').each(function(){
            var x = $(this).attr('data-position').split('-')[0].parseInt();
            var y = $(this).attr('data-position').split('-')[1].parseInt();

            if(y == coords.split('-')[1].parseInt()){
                if(x === 0 && sens === 'left')
                    x = 4;
                else if(x === 4 && sens === 'right')
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

                if(y === 0 && sens === 'top')
                    y = 4;
                else if(y === 4 && sens === 'bottom')
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

MainView.prototype.exchangeAndApplyTuileAndUsers = function(users, user, lastCoords, newCoords) {
    var futurTuile = this.Helper.GetTuile(newCoords.split('-')[0], newCoords.split('-')[1]);
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

    lastTuile.attr('data-position', futurTuile.attr('data-position'));
    futurTuile.attr('data-position', lastCoords);

    var imgs = futurTuile.children('img');
    imgs.first().removeClass('ng-hide');
    imgs.first().fadeIn('slow');
    imgs.last().fadeOut('slow');

    if(user.id == this.Helper.GetCurrentID())
        that.CaseEffect.manageCaseEffect(user, futurTuile.attr('data-action'));
};

MainView.prototype.exchangeTuile = function(u) {
    if(u.id == this.Helper.GetCurrentID()){
        this.DOMView.appendTmpMessage('Choisissez la case où vous voulez vous rendre.');
        coords = this.CoordsProvider.getAllCoords();
        coords = this.CoordsProvider.removeVisibleCoords(coords, this.Helper);
        appendSelect(coords, 'teleporter', this.Helper);

        if($('.selectMe').length === 0){
            this.CaseEffect.client.socket.emit('noPossibilities', {user: u});
        }

        return true;
    }
};

MainView.prototype.exchangeAndApplyTuile = function(id) {
    if(id == this.Helper.GetCurrentID()){
        this.DOMView.appendTmpMessage('Choisissez la case à échanger.');
        coords = this.CoordsProvider.getAllCoords();
        coords = this.CoordsProvider.removeVisibleCoords(coords, this.Helper);
        appendSelect(coords, 'exchange', this.Helper);
        return true;
    }
};

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

/*************
 * FUNCTIONS *
 *************/

// Gère le tour d'une personne
function manageTurn(u, users, helper, cProvider){
    // Affiche les cases possible
    var coords = [];

    if(u.action1 !== ''){
        if(u.action1 === 'Déplacer'){
            coords = cProvider.getCoordsDeplacerRegarder(u);
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
            coords = cProvider.getCoordsDeplacerRegarder(u);
            appendSelect(coords, u.action1, helper);
        }
        else if(u.action1 === 'Contrôller'){
            coords = cProvider.getCoordsController(u);
            appendSelect(coords, u.action1, helper);
        }
    }
    else {
        if(u.action2 === 'Déplacer'){
            coords = cProvider.getCoordsDeplacerRegarder(u);
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
            coords = cProvider.getCoordsDeplacerRegarder(u);
            appendSelect(coords, u.action2, helper);
        }
        else if(u.action2 === 'Contrôller'){
            coords = cProvider.getCoordsController(u);
            appendSelect(coords, u.action2, helper);
        }
    }
}

// gère une action complète
function manageComplexAction(object, helper, cProvider){
    if(object.action === 'Pousser'){
    	coords = cProvider.getCoordsDeplacerRegarder(object.user);
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