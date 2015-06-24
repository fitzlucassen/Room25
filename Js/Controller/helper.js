var HelperController = function() {

}

HelperController.prototype.GetCurrentID = function() {
	 return $('.userID').val();
};

HelperController.prototype.SetCurrentID = function(id) {
	$('.userID').attr('value', id);
};

HelperController.prototype.GetCharacterDiv = function(id) {
	if(id !== null && id >= 0){
		return $('.character-' + id);
	}
	else{
		return $('.character-' + this.GetCurrentID());
	}
};

HelperController.prototype.GetTuile = function(x, y) {
	if(x !== null && x >= 0 && y !== null && y >= 0)
		return $('.tuile[data-position="'+ x + '-' + y + '"]');
	else
		return $('.tuile[data-position="2-2"]');
};

HelperController.prototype.GetAction = function(action) {
	if(action)
		return $('.actions .action img[alt="' + action + '"]');
	else
		return $('.actions .action img');
};