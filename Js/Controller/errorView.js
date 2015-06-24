var ErrorView = function(helper) {
    this.Helper = helper;
    this.divError = $('#error-view');
    this.resources = {
        errorLogin: 'Requis, lettre uniquement. \' et - autorisés.'
    };
}

ErrorView.prototype.manageLoginError = function() {
    $('#newName').css({
        'color': 'red',
        'box-shadow': '0 0 5px red',
        '-webkit-box-shadow': '0 0 5px red',
        '-moz-box-shadow': '0 0 5px red',
        '-o-box-shadow': '0 0 5px red'
    });
    $('#newName').attr('placeholder', this.resources.errorLogin);
};
