function RTCController(udp) {
	this.constraints = {video: true, audio: true};
	this.localVideo = null;
	this.videos = [];

	this.cpt = 0;
	this.udp = udp;
	this.callBtn = null;
	this.hangupBtn = null;
}

RTCController.prototype.initialize = function(ids, localID, callback){
	this.callBtn = document.getElementById('callButton');
	this.hangupBtn = document.getElementById('hangupButton');

	var that = this;
	that.udp.initialize();

	that.localVideo = $('.' + localID);

	for(var id in ids){
		if(ids.hasOwnProperty(id)){
			if(ids[id] != localID)
				that.videos.push($('.' + ids[id]));
		}
	}

	// when we get the other peer's stream, add it to the second
	// video element.
	that.udp.RtcPeer.onaddstream = function (e) {
		that.videos[that.cpt][0].src = window.URL.createObjectURL(e.stream);
		that.cpt++;
	};
		
	this.callBtn.onclick = function(){
		// get the user's media, in this case just video
		navigator.getUserMedia(that.constraints, function (stream) {
			// set one of the video src to the stream
			//that.localVideo[0].src = window.URL.createObjectURL(stream);
			// add the stream to the PeerConnection
			that.udp.RtcPeer.addStream(stream);
			// now we can connect to the other peer
			that.udp.connect(callback);

		}, that.udp.errorHandler);
	};

	this.hangupBtn.onclick = function(){
		for(var id in ids){
			if(ids.hasOwnProperty(id)){
				if(ids[id] != localID)
					$('.' + ids[id])[0].src = null;
			}
		}
		that.localVideo[0].src = null;
	};
};

RTCController.prototype.trace = function(text) {
	console.log((performance.now() / 1000).toFixed(3) + ": " + text);
};

RTCController.prototype.handleError = function(){};