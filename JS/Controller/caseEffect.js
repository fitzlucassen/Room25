function CaseEffectController(client){
	this.client = client;
}

CaseEffectController.prototype.manageCaseEffect = function(user, effect) {
	if(effect === 'death'){
		this.client.emitDeath(user);
	}
	else if(effect === 'noSee'){

	}
	else if(effect === 'noSecondAction'){
		
	}
	else if(effect === 'deathAfterNextAction'){
		
	}
	else if(effect === 'deathAfterNextTour'){
		
	}
	else if(effect === 'deathIfTwo'){
		
	}
	else if(effect === 'goTo2-2'){
		this.client.emitGoToCentral(user);
	}
	else if(effect === 'doSee'){
		this.client.view.appendTmpMessage('Choisissez la case que vous souhaitez regarder.');
		this.client.takeALook(user);
	}
	else if(effect === 'doController'){
		this.client.view.appendTmpMessage('Choisissez la rangée que vous souhaitez contrôller.');
		this.client.view.controller(user);
	}
	else if(effect === 'exchangeTuile'){
		
	}
	else if(effect === 'goInAnotherTuile'){
		
	}
};