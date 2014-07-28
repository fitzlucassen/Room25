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