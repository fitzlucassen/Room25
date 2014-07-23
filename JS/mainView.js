function MainView() {

}

MainView.prototype.appendUser = function(user) {
    if ($('.' + user.id).length == 0) {

    }
}
MainView.prototype.deleteUser = function(user) {
    $('.' + user.id).remove();
}