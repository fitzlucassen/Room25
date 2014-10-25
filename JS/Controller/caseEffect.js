function CaseEffectController(client){
	this.client = client;
}

CaseEffectController.prototype.manageCaseEffect = function(user, effect, userMain) {
	var nextOne = userMain ? userMain : user;
	if(effect === 'death'){
		this.client.emitDeath(user);

		setTimeout(this.client.emitNextPlayer, 200 , nextOne);
	}
	else if(effect === 'noSee'){
		// TODO
		this.client.emitNextPlayer(nextOne);
	}
	else if(effect === 'noSecondAction'){
		// TODO
		this.client.emitNextPlayer(nextOne);
	}
	else if(effect === 'deathAfterNextAction'){
		// TODO
		this.client.emitNextPlayer(nextOne);
	}
	else if(effect === 'deathAfterNextTour'){
		// TODO
		this.client.emitNextPlayer(nextOne);
	}
	else if(effect === 'exchangeTuile'){
		// TODO
		this.client.emitNextPlayer(nextOne);
	}
	else if(effect === 'deathIfTwo'){
		this.client.emitDeathForFirstHere(user);
	}
	else if(effect === 'doController'){
		this.client.view.controller(user);
	}
	else if(effect === 'goTo2-2'){
		this.client.emitGoToCentral(user);
	}
	else if(effect === 'doSee'){
		this.client.view.regarder(user.id);
		this.client.emitNextPlayer(nextOne);
	}
	else if(effect === 'goInAnotherTuile'){
		this.client.view.exchangeTuile(user.id);
	}
	else {
		this.client.emitNextPlayer(nextOne);
	}
};