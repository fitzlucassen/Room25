var userManager = function(){
	this.getById = function(users, id) {
		var u = null;

	    for (var a in users) {
	        if (users.hasOwnProperty(a)) {
	            if (users[a].id == id){
	                u = a;
	                break;
	            }
	        }
	    }

	    return u;
	};

	this.getByOrder = function(users, order){
	    var u = null;

	    for (var a in users) {
	        if (users.hasOwnProperty(a)) {
	            if (users[a].order == order){
	                u = users[a];
	                break;
	            }
	        }
	    }
	    return u;
	};

	this.getInTheSameRow = function(users, coords, sens){
	    var r = [];
	    if(sens == 'top' || sens == 'bottom'){
	        for(var u in users){
	            if(users.hasOwnProperty(u)){
	                if(users[u].position.x == coords.split('-')[0])
	                    r.push(u);
	            }
	        }
	    }
	    else if(sens == 'left' || sens == 'right'){
	        for(var u2 in users){
	            if(users.hasOwnProperty(u2)){
	                if(users[u2].position.y == coords.split('-')[1])
	                    r.push(u2);
	            }
	        }
	    }
	    return r;
	};

	this.getInTheSameCase = function(users, user){
	    var r = [];

	    for(var u in users){
	        if(users.hasOwnProperty(u)){
	            if(users[u].position.x == user.position.x && users[u].position.y == user.position.y && users[u].id != user.id){
	                r.push(users[u]);
	            }
	        }
	    }
	    return r;
	};

	this.processPlayerOrder = function(users, shuffleFunction){
	    users = shuffleFunction(users);

	    for(var i in users){
	        if (users.hasOwnProperty(i)) {
	            users[i].order = i;
	        }
	    }
	    return users;
	};
};

exports.userManager = userManager;