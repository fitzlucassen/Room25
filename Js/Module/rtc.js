$(document).ready(function(){
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Generate Random Number if Needed
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    var urlargs         = urlparams();
    var my_number       = PUBNUB.$('my-number');
    var my_link         = PUBNUB.$('my-link');
    var number          = urlargs.number || 666;
    var sessions = [];

    my_number.number    = number;
    my_number.innerHTML = ''+my_number.number;
    my_link.href        = location.href.split('?')[0] + '?call=' + number;
    my_link.innerHTML   = my_link.href;

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Calling & Answering Service
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    var video_out = null;
    var img_out   = null;
    var img_self  = null;

    var phone     = window.phone = PHONE({
        number        : my_number.number, // listen on this line
        publish_key   : 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c',
        subscribe_key : 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe',
        ssl           : true
    });

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Get URL Params
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    function urlparams() {
        var params = {};
        if (location.href.indexOf('/666') < 0 && location.href.indexOf('/667') < 0) return params;

        paramsStr = "URL?number=" + (location.href.indexOf('/666') < 0 ? 667 : 666);
        PUBNUB.each(
            paramsStr.split('?')[1].split('&'),
            function(data) { var d = data.split('='); params[d[0]] = d[1]; }
        );

        return params;
    }

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Construct URL Param String
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    function urlstring(params) {
        return location.href.split('?')[0] + '?' + PUBNUB.map(
            params, function( key, val) { return key + '=' + val }
        ).join('&');
    }

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Video Session Connected
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    function connected(session) {
        if(!video_out)
            video_out = PUBNUB.$('video-display');

        video_out.innerHTML = '';
        video_out.appendChild(session.video);

        PUBNUB.$('number').value = ''+session.number;
        console.log("Hi!");
    }

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Video Session Ended
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    function ended(session) {
        set_icon('facetime-video');
        img_out.innerHTML = '';
        console.log("Bye!");
    }

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Video Session Ended
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    function set_icon(icon) {
        if(!video_out)
            video_out = PUBNUB.$('video-display');

        video_out.innerHTML = '<span class="glyphicon glyphicon-' +
            icon + '"></span>';
    }

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Request fresh TURN servers from XirSys
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    function get_xirsys_servers() {
        var servers;
        $.ajax({
            type: 'POST',
            url: 'https://api.xirsys.com/getIceServers',
            data: {
                room: 'default',
                application: 'default',
                domain: 'www.pubnub-example.com',
                ident: 'pubnub',
                secret: 'dec77661-9b0e-4b19-90d7-3bc3877e64ce',
            },
            success: function(res) {
                res = JSON.parse(res);
                if (!res.e) servers = res.d.iceServers;
            },
            async: false
        });
        return servers;
    }

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Start Phone Call
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    function dial(number) {
        // Dial Number
        var session = phone.dial(number, get_xirsys_servers());

        // No Dupelicate Dialing Allowed
        if (!session) 
            return;

        // Show Connecting Status
        set_icon('send');
    }

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Received Call Thumbnail
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    function thumbnail(session) {
        if(!img_out)
            img_out = PUBNUB.$('video-thumbnail');

        img_out.innerHTML = '';
        img_out.appendChild(session.image);
        img_out.appendChild(phone.snap().image);
    }

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Ready to Send or Receive Calls
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    phone.ready(function(){
        // Ready To Call

        // Auto Call
        if ('call' in urlargs) {
            var number = urlargs['call'];
            PUBNUB.$('number').value = number;
            dial(number);
        }

        // Make a Phone Call
        PUBNUB.bind( 'mousedown,touchstart', PUBNUB.$('dial'), function(){
            video_out = PUBNUB.$('video-display');
            img_out   = PUBNUB.$('video-thumbnail');
            img_self  = PUBNUB.$('video-self');

            set_icon('facetime-video');

            var number = PUBNUB.$('number').value;
            if (!number) 
                return;
            dial(number);
        } );

        // Hanup Call
        PUBNUB.bind( 'mousedown,touchstart', PUBNUB.$('hangup'), function() {
            phone.hangup();
            set_icon('facetime-video');
        });

        // Take Picture
        PUBNUB.bind( 'mousedown,touchstart', PUBNUB.$('snap'), function() {
            if(!img_self)
                img_self  = PUBNUB.$('video-self');

            var photo = phone.snap();
            img_self.innerHTML = ' ';
            img_self.appendChild(photo.image);
            setTimeout( function() { img_self.innerHTML = ' ' }, 750 );
        } );

    });

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Receiver for Calls
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    phone.receive(function(session){
        session.message(message);
        session.thumbnail(thumbnail);
        session.connected(connected);
        session.ended(ended);
    });

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Problem Occured During Init
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    phone.unable(function(details){
        console.log("Alert! - Reload Page.");
        console.log(details);
        set_icon('remove');
    });

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Debug Output
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    phone.debug(function(details){
        // console.log(details);
    });





    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Chat
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    var chat_in  = PUBNUB.$('pubnub-chat-input');
    var chat_out = PUBNUB.$('pubnub-chat-output');

/*    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Send Chat MSG and update UI for Sending Messages
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    PUBNUB.bind( 'keydown', chat_in, function(e) {
        if ((e.keyCode || e.charCode) !== 13)     return true;
        if (!chat_in.value.replace( /\s+/g, '' )) return true;

        phone.send({ text : chat_in.value });
        add_chat( my_number.number + " (Me)", chat_in.value );
        chat_in.value = '';
    } )*/

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Update Local GUI
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    function add_chat( number, text ) {
        if (!text.replace( /\s+/g, '' )) return true;

        var newchat       = document.createElement('div');
        newchat.innerHTML = PUBNUB.supplant(
            '<strong>{number}: </strong> {message}', {
            message : safetxt(text),
            number  : safetxt(number)
        } );
        chat_out.insertBefore( newchat, chat_out.firstChild );
    }

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // WebRTC Message Callback
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    function message( session, message ) {
        add_chat( session.number, message.text );
    }

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // XSS Prevent
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    function safetxt(text) {
        return (''+text).replace( /[<>]/g, '' );
    }
});