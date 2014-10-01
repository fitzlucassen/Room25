function HelperController() {

}

HelperController.prototype.GetCurrentID = function() {
	 return $('.userID').val();
};

HelperController.prototype.SetCurrentID = function(id) {
	$('.userID').attr('value', id);
};

HelperController.prototype.GetCharacterDiv = function(id) {
	if(id){
		return $('.character-' + id);
	}
	else{
		return $('.character-' + this.GetCurrentID());
	}
};

HelperController.prototype.GetTuile = function(x, y) {
	if(x && y)
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