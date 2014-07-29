$(document).ready(function() {
    var View = new MainView();
    var ErrView = new ErrorView();
    var Client = new ClientController(View);


    Client.initialize();

    $('body').on('click', '#getMyName', function() {
        var patt = /[a-zA-Z\-\']+/;

        if (!patt.test($('#newName').val())) {
            ErrView.manageLoginError();
            return false;
        }

        Client.newUser($('#newName').val());
        $('#popin-grayback').fadeOut('slow');
    });

    $('body').on('click', '#popin, #popin-grayback', function(e) {
        e.stopPropagation();
        if ($(this).hasClass('grayback'))
            $('#popin-grayback').fadeOut('slow');
    });

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

    $('body').on('click', 'ul.personnage li, .characterTaken', function(e) {
        e.stopPropagation();

        if (!$(this).hasClass('characterTaken')) {
            $('.characterTaken-' + $('.userID').val()).remove();
            Client.characterChoosen($(this).children('span').text(), $('.userID').val());
        }
    });

    $('body').on('click', '.btn', function(e) {
        Client.play();
    });
});