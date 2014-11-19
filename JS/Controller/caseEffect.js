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
		var userDiv = this.client.view.Helper.GetCharacterDiv(user.id);

		userDiv.attr('handicap', 'noSee');

		this.client.emitNextPlayer(nextOne);
	}
	else if(effect === 'noSecondAction'){
		var userDiv = this.client.view.Helper.GetCharacterDiv(user.id);

		userDiv.attr('handicap', 'noSecondAction');
		
		this.client.emitNextPlayer(nextOne);
	}
	else if(effect === 'deathAfterNextAction'){
		var userDiv = this.client.view.Helper.GetCharacterDiv(user.id);

		userDiv.attr('handicap', 'deathAfterNextAction');
		
		this.client.emitNextPlayer(nextOne);
	}
	else if(effect === 'deathAfterNextTour'){
		var userDiv = this.client.view.Helper.GetCharacterDiv(user.id);

		userDiv.attr('handicap', 'deathAfterNextTour');
		
		this.client.emitNextPlayer(nextOne);
	}
	else if(effect === 'exchangeTuile'){
		this.client.view.exchangeAndApplyTuile(user.id);
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