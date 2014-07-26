function MainView() {

}

MainView.prototype.appendUserID = function(user) {
    $('.userID').val(user.id);
    $('.userID').trigger('change');
};
MainView.prototype.deleteUser = function(user) {
    $('.' + user.id).remove();
};