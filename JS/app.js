var LastCoords = [];
var OtherCoords = [];

$(document).ready(function() {
    var View = new MainView();
    var ErrView = new ErrorView();
    var Client = new ClientController(View);

    Client.initialize();

    // Vérification login + envoi de l'évènement nouveau joueur
    $('body').on('click', '#getMyName', function() {
        var patt = /[a-zA-Z\-\']+/;

        if (!patt.test($('#newName').val())) {
            ErrView.manageLoginError();
            return false;
        }

        Client.newUser($('#newName').val());
        $('#popin-grayback').fadeOut('slow');
    });

    // RollHover d'un personnage (animation)
    $('body').on('mouseover', '.personnage li', function() {

        $this = $(this);
        $('.personnage li').each(function() {
            if ($this[0] != $(this)[0]) {
                $(this).stop().animate({
                    'opacity': '0.6'
                }, 200);
            }
        });
    }).on('mouseleave', '.personnage li', function() {
        $('.personnage li').stop().animate({
            'opacity': '1'
        }, 200);
    });

    // Clique sur un personnage. On émet l'évènement
    $('body').on('click', 'ul.personnage li, .characterTaken', function(e) {
        e.stopPropagation();

        if (!$(this).hasClass('characterTaken')) {
            $('.characterTaken-' + $('.userID').val()).remove();
            Client.characterChoosen($(this).children('span').text(), $('.userID').val());
        }
    });

    // Au clique sur le bouton, on lance le jeu
    $('body').on('click', '.btn', function(e) {
        Client.play();
    });

    // Au clique sur une action on la met en avant
    $('body').on('click', '.action', function(e) {

        if ($('.action.ok').length < 2 || $(this).hasClass('ok')) {
            View.animateAction($(this), !$(this).hasClass('ok'));

            if ($('.action.ok').length > 0)
                View.showButtonOk();
            else
                View.hideButtonOk();
        }
    });

    // Au clique sur le bouton des actions on les valide
    $('body').on('click', '.btnOk', function(e) {
        View.disableActions();

        var action2 = '';
        if($('.actionOk-2').length > 0)
            action2 = $('.actionOk-2').children('img').attr('alt');
        
        Client.validateAction($('.userID').val(), $('.actionOk-1').children('img').attr('alt'), action2);
    });

    // Au clique sur une case proposée
    $('body').on('click', '.tuile .selectMe, .character .characterSelectMe', function(){
        Client.emitAction($(this));
    });

    // Au clique sur une direction
    $('body').on('click', 'span.direction', function(){
    	var element = $(this);
    	var action = 'Contrôller';
    	var sens = element.removeClass('direction').attr('class');
    	var position = element.parent().attr('data-position');
    	element.addClass('direction');

    	Client.emitComplexAction({
    		element: element,
    		action: action,
    		sens: sens,
    		position: position
    	});

    	return false;
    });
});