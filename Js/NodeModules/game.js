var gameManager = function(){
    this.everyoneIsOk = function(users) {
        var ready = true;
        for (var a in users) {
            if (users.hasOwnProperty(a)) {
                if (!users[a].ready) {
                    ready = false;
                    break;
                }
            }
        }
        return ready;
    };

    this.everyoneIsNok = function(users) {
        var notReady = true;
        for (var a in users) {
            if (users.hasOwnProperty(a)) {
                if (users[a].ready) {
                    notReady = false;
                    break;
                }
            }
        }
        return notReady;
    };

    this.gardienWins = function(users){
        var bool = 0;

        for(var u in users){
            if (users.hasOwnProperty(u)) {
                if(users[u].identity === 'prisonnier'){
                    bool++;
                }
            }
        }

        return bool <= 2;
    };

    this.moreThanFourPlayers = function(users) {
        var cpt = 0;
        for (var a in users) {
            if (users.hasOwnProperty(a)) {
                if (users[a].character !== '')
                    cpt++;
            }
        }
        return cpt >= 4;
    };

    this.manageIdentity = function(users, shuffleFunction) {
        var identities;

        if (users.length == 4) {
            identities = ['prisonnier', 'prisonnier', 'prisonnier', 'prisonnier', 'gardien'];
        } else {
            identities = ['prisonnier', 'prisonnier', 'prisonnier', 'prisonnier', 'gardien', 'gardien'];
        }

        identities = shuffleFunction(identities);
        for (var u in users) {
            if (users.hasOwnProperty(u)) {
                users[u].identity = identities[u];
            }
        }

        return users;
    };
};

exports.gameManager = gameManager;
