function ErrorView() {
    this.divError = $('#error-view');
}

ErrorView.prototype.manageLoginError = function() {
    $('#newName').css({
        'color': 'red',
        'box-shadow': '0 0 5px red',
        '-webkit-box-shadow': '0 0 5px red',
        '-moz-box-shadow': '0 0 5px red',
        '-o-box-shadow': '0 0 5px red'
    });
    $('#newName').attr('placeholder', 'Requis, lettre uniquement. \' et - autorisés.');
};