function MainView() {

}

MainView.prototype.appendUserID = function(user) {
    $('.userID').val(user.id);
    $('.userID').trigger('change');
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
            if (users[u].character != '') {
                $('ul.personnage li').each(function() {
                    if ($(this).children('span').text() == users[u].character) {
                        $(this).append('<div class="characterTaken characterTaken-' + users[u].id + '"><p>' + users[u].name + '</p></div>');
                    }
                });
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