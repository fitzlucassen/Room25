function DOMView(helper) {
    this.caseWidth = 175;
    this.caseHeight = 175;

    this.Helper = helper;
}

// On montre le bouton de lancement
DOMView.prototype.showButton = function() {
    $('.btn').fadeIn(200, function() {
        $('.btn').css('display', 'block');
    });
};

// On supprime le bouton de lancement
DOMView.prototype.hideButton = function() {
    $('.btn').fadeOut(200);
};


// On montre le bouton de validation des actions
DOMView.prototype.showButtonOk = function() {
    $('.btnOk').fadeIn('slow', function() {
        $('.btnOk').css('display', 'block');
    });
};

// On cache le bouton de validation des actions
DOMView.prototype.hideButtonOk = function() {
    $('.btnOk').fadeOut('slow');
};

// On désactive les actions (loader par dessus)
DOMView.prototype.disableActions = function() {
    $('.actions').append('<div class="loading"><p>En attente des autres joueurs...</p><img src="Images/loader.gif" alt="loader"></div>');
};

// On desactive le loader (tout le monde est prêt)
DOMView.prototype.hideActions = function() {
    $('.loading img').remove();
    $('.btnOk').fadeOut('slow');
    $('.loading p').html('C\'est parti !');
};

DOMView.prototype.appendGardienWins = function() {
    $('.gameboard').append('<p class="tmpMessage">La partie est finie, les gardiens ont gagné !</p>');
};

DOMView.prototype.appendTmpMessage = function(message){
    $('.gameboard').append('<p class="tmpMessage tmp">' + message + '</p>');

    setTimeout(function(){
        $('.tmpMessage.tmp').fadeOut('slow', function(){
            $(this).remove();
        });
    }, 3000);
};