function RtcPeerConnection(){
    this.RtcPeer = null;
    this.PeerConnection = null;
    this.IceCandidate = null;
    this.configurations = {
        iceServers: [
            {url: "stun:23.21.150.121"},
            {url: "stun:stun.l.google.com:19302"},
            {url: "turn:numb.viagenie.ca", credential: "webrtcdemo", username: "louis%40mozilla.com"}
            /*{url: "turn:numb.viagenie.ca", credential: "123456", username: "famille_dudul%40hotmail.fr"}*/
        ]
    };
    this.rtcOptions = {
        optional: [
            {DtlsSrtpKeyAgreement: true},
            /*{RtpDataChannels: true}*/
        ]
    };
    this.SDPConstraints = {
        optional: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
        }
    };

    this.typeRequest = null;
    this.ROOM = null;
}

RtcPeerConnection.prototype.initialize = function(){

    if (!navigator.mozGetUserMedia && !navigator.webkitGetUserMedia) {
        console.log("Browser does not appear to be WebRTC-capable");
    }
    else {
        this.dbRef = new Firebase("https://room25.firebaseIO.com/");
        this.roomRef = this.dbRef.child("rooms");

        this.PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        this.IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
        this.SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
        navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

        // generate a unique-ish room number
        /*var ME = this.id();*/
        // determine what type of peer we are,
        // offerer or answerer.
        this.ROOM = location.hash.substr(1);
        this.typeRequest = "answerer";
        var otherType = "offerer";

        // no room number specified, so create one
        // which makes us the offerer
        if (this.ROOM == '/game') {
            this.ROOM = 42;
            this.typeRequest = "offerer";
            otherType = "answerer";
        }
        else {
            this.ROOM = 42;
        }
        
        this.RtcPeer = new this.PeerConnection(this.configurations, this.rtcOptions);

        var that = this;
        this.RtcPeer.onicecandidate = function (e) {
            // take the first candidate that isn't null
            if (!e.candidate) { return; }
            //that.RtcPeer.onicecandidate = null;
            // request the other peers ICE candidate
            that.recv(that.ROOM, "candidate:" + otherType, function (candidate) {
                that.RtcPeer.addIceCandidate(new that.IceCandidate(JSON.parse(candidate)));
            });
            // send our ICE candidate
            that.send(that.ROOM, "candidate:" + that.typeRequest, JSON.stringify(e.candidate));
        };
    }
};

RtcPeerConnection.prototype.connect = function(callback){
    var that = this;
    // start the connection!
    if (this.typeRequest === "offerer") {
        // create the offer SDP
        this.RtcPeer.createOffer(function (offer) {
            that.RtcPeer.setLocalDescription(offer);
            // send the offer SDP to FireBase
            that.send(that.ROOM, "offer", JSON.stringify(offer));
            // wait for an answer SDP from FireBase
            that.recv(that.ROOM, "answer", function (answer) {
                that.RtcPeer.setRemoteDescription(
                    new that.SessionDescription(JSON.parse(answer))
                );
            });

            callback();
        }, that.errorHandler, that.SDPConstraints);
    } else {
        // answerer needs to wait for an offer before
        // generating the answer SDP
        that.recv(that.ROOM, "offer", function (offer) {
            that.RtcPeer.setRemoteDescription(
                new that.SessionDescription(JSON.parse(offer))
            );
            // now we can generate our answer SDP
            that.RtcPeer.createAnswer(function (answer) {
                that.RtcPeer.setLocalDescription(answer);
                // send it to FireBase
                that.send(that.ROOM, "answer", JSON.stringify(answer));
            }, that.errorHandler, that.SDPConstraints);  
        }); 
    }
};

// generate a unique-ish string
RtcPeerConnection.prototype.id = function () {
    return (Math.random() * 10000 + 10000 | 0).toString();
};
// a nice wrapper to send data to FireBase
RtcPeerConnection.prototype.send = function(room, key, data) {
    this.roomRef.child(room).child(key).set(data);
};
// wrapper function to receive data from FireBase
RtcPeerConnection.prototype.recv = function(room, type, cb) {
    this.roomRef.child(room).child(type).on("value", function (snapshot, key) {
        var data = snapshot.val();
        if (data) { cb(data); }
    });
};
// generic error handler
RtcPeerConnection.prototype.errorHandler = function(err) {
    console.error(err);
};