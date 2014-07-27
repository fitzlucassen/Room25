function MainView() {

}

MainView.prototype.appendUserID = function(user) {
    $('.userID').val(user.id);
    $('.userID').trigger('change');
};

MainView.prototype.deleteCharacter = function(name, pseudo) {
    $('ul.personnage li').each(function() {
        if ($(this).children('span').text() == name) {
            $(this).append('<div class="characterTaken"><p>' + pseudo + '</p></div>');
        }
    });
};

MainView.prototype.deleteUser = function(user) {
    $('.' + user.id).remove();
};