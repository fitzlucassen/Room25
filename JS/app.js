$(document).ready(function() {
    var Client = new ClientController();
    var View = new MainView();
    var ErrView = new ErrorView();

    Client.initialize();
});