var BOSH_HOST = "http://127.0.0.1:7070/http-bind/";
var conn = null;
var img = null;
var username = null;
var profile_message = null;
myApp.controller("LoginController", function($scope, $http, $window, testFactory,$rootScope,$sce) {
	$scope.message = {value: null,
			user_key: null};
	// openfire login and connect
	$scope.show = false;
	$scope.IsSmileyDivVisible = false;
	$scope.ToggleSmileyDiv = function() {
		$scope.IsSmileyDivVisible = $scope.IsSmileyDivVisible ? false : true;
	};
	$scope.tab = 1;

    $scope.setTab = function(newTab){
      $scope.tab = newTab;
    };
    $scope.animalsEmojis = [
                            ":dog: :cat: :snake:"
                       ];
    $scope.smileEmojis = [
                          ":bowtie: :smile: :laughing: :blush: " +
                          ":smiley: :relaxed: :smirk: :heart_eyes: " +
                          ":kissing_heart: :kissing_closed_eyes: :flushed: :relieved: " +
                          ":satisfied: :grin: :wink: :stuck_out_tongue_winking_eye: " +
                          ":stuck_out_tongue_closed_eyes: :grinning: :kissing: :kissing_smiling_eyes: " +
                          ":stuck_out_tongue: :sleeping: :worried: :frowning: " +
                          ":anguished: :open_mouth: :grimacing: :confused: " +
                          ":hushed: :expressionless: :unamused: :sweat_smile: " +
                          ":disappointed: :confounded: :fearful: :persevere:" +
                          ":cry: :sob: :joy: :astonished:" +
                          ":scream: :neckbeard: :tired_face: :angry:" +
                          ":rage: :triumph: :sleepy: :yum:" +
                          ":mask: :sunglasses: :dizzy_face: :imp:" +
                          ":smiling_imp: :neutral_face: :no_mouth: :innocent:" +
                          ":alien: :yellow_heart: :blue_heart: :purple_heart: :heart: " +
                          ":green_heart: :broken_heart: :heartbeat: :heartpulse: " +
                          ":two_hearts: :revolving_hearts: :cupid: :sparkling_heart: " +
                          ":sparkles: :star: :star2: :dizzy: " +
                          ":boom: :collision: :anger: :exclamation: " +
                          ":question: :grey_exclamation: :grey_question: :zzz: " +
                          ":dash: :sweat_drops: :notes: :musical_note: "						  
                      ];
    $scope.heartEmojis = [
                          ":fire: :hankey: :poop: :shit: " +
                          ":\+1: :thumbsup: :\-1: :thumbsdown: " +
                          ":ok_hand: :punch: :facepunch: :fist: " +
                          ":v: :wave: :hand: :raised_hand: " +
                          ":open_hands: :point_up: :point_down: :point_left: " +
                          ":point_right: :raised_hands: :pray: :point_up_2: " +
                          ":clap: :muscle: :metal: :fu: "						  
                      ];
    $scope.houseEmojis = [
                            ":house: :school: :hotel:"
                        ];
    $scope.messageEmoji = "Animals: :dog: :cat: :snake: People: :smile: :confused: :angry: Places: :house: :school: :hotel: :poop:";
	$scope.messageWithAliases = "Emoji with aliases: :) <3 +1";
    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };
    $scope.addEmojiToEditBox = function(text) {
		console.log(text);
	};
	/**
	 * When user just connected and gets the roster information
	 */
	function onGetRoster(items) {
	    if (!items || items.length == 0)
	        return false;
	    var str='<ul class="people" id="contactlist">';
	       for(var i =0; i < items.length ;i++ )
	       {	
	    	   str+='<li class="person" data-chat="'+items[i].jid+'"><img src="'+"assets/images/user_default.png"+'"/><span class="name">'+items[i].name+'</span> <span class="time">2:09 PM</span> <span class="preview">I was wondering...</span></li>';
	       }
	       str+='</ul>';
	       $('#contacts').append(str);
	}
	function onGetVCard(stanza) {
		var $vCard = $(stanza).find("vCard");
		img = $vCard.find('RIGHTIMAGE').text();
		username = $vCard.find('USERNAME').text();
		profile_message = $vCard.find('PROFILEMESSAGE').text();
	}
	function onMessage(msg) {
		var to = msg.getAttribute('to');
	    var from = msg.getAttribute('from');
	    var type = msg.getAttribute('type');
	    var elems = msg.getElementsByTagName('body');
		if (type == "chat" && elems.length > 0 && Strophe.getBareJidFromJid(to) != Strophe.getBareJidFromJid(from)) {
			var body = elems[0];
			var text = Strophe.getText(body);
			var fromId = Strophe.getBareJidFromJid(from).replace("@splash.com","");
			//TODO Need to create function and add this code for re-usability
			if($('#'+fromId+'').length) {
				$('#'+fromId+'').append('<div class="bubble you">'+text+'</div>');
				console.log('incoming message  and parent div exits');
			} else{
				var str = '<div class="chat scroll-container" data-chat="'+fromId+'" id="'+fromId+'">';
				str += '<div class="bubble you">'+text+'</div>';
				str+='</div>';
				$('#right_chat_div').append(str);
				console.log('incoming message  and parent div not exits');
			 }
		  } else {
			  console.log('forward message');
		  }
		return true;
	}
	$scope.loadConversations = function(sender_key) {
		$scope.message = {value: null,
				user_key: sender_key};
		 // use this if you are using id to check
		if( $('#'+sender_key+'').length )
		{
		     // it exists
			//$('#right_chat_div').empty();
			return true;
		}
		//$('#right_chat_div').empty();
		/*var str = '<div class="chat scroll-container" data-chat="'+sender_key+'" id="'+sender_key+'">';
		for(var i =0; i < 10 ;i++ ){
			 if( i % 2 != 0){
				 str += '<div class="bubble you"> message number -'+i+ sender_key+'</div>';
			 }else {
				 str += '<div class="bubble me"> message number -'+i+ sender_key+'</div>';
			 }
		}
		str+='</div>';
		$('#right_chat_div').append(str);*/
	};
	$scope.sendMessage = function sendMessage(message_obj) {
		var text_message = message_obj.value;
		var to = message_obj.user_key;
		var toId = Strophe.getBareJidFromJid(to).replace("@splash.com","");
		//TODO Need to create function and add this code for re-usability
		if($('#'+toId+'').length) {
			$('#'+toId+'').append('<div class="bubble me">'+text_message+'</div>');
		} else{
			var str = '<div class="chat scroll-container" data-chat="'+toId+'" id="'+toId+'">';
			str += '<div class="bubble me">'+text_message+'</div>';
			str+='</div>';
			$('#right_chat_div').append(str);
		 }
		var Id = $('.right .chat').attr('id');
		//get div element by id to scroll chat to bottom
		var objDiv = document.getElementById(Id);
		if(objDiv.scrollHeight != null){
			objDiv.scrollTop = objDiv.scrollHeight;
		}
		$scope.message = {value: null,
				user_key: to};
		var contact_jid = to+'@'+conn.domain;
		sendMessagePacket(text_message, conn.authzid, contact_jid);
	};
	function sendMessagePacket(text_message, bare_jid, contact_jid) {
	    var timestamp = new Date().getTime();
	    var to_jid = Strophe.getBareJidFromJid(contact_jid);
	    var message = $msg({from: bare_jid, to: to_jid, type: 'chat', id: timestamp}).c('body').t(text_message).up().c('active', {'xmlns': 'http://jabber.org/protocol/chatstates'});
	    var forwarded = $msg({to:bare_jid, type:'chat', id:timestamp}).c('forwarded', {xmlns:'urn:xmpp:forward:0'})	.c('delay', {xmns:'urn:xmpp:delay',stamp:timestamp}).up().cnode(message.tree());
	    conn.send(message);
	    conn.send(forwarded);
	}
	Login = {
			Status: {
		        ERROR: 0,
		        CONNECTING: 1,
		        CONNFAIL: 2,
		        AUTHENTICATING: 3,
		        AUTHFAIL: 4,
		        CONNECTED: 5,
		        DISCONNECTED: 6,
		        DISCONNECTING: 7,
		        ATTACHED: 8
		    }
	};
	$scope.connect = function(user, $location) {
		var BOSH_HOST = "http://127.0.0.1:7070/http-bind/";
		var SHORT_HOST_NAME = "splash.com";
		var LOGON_USER = user.mobile;
		var LOGON_PWD = user.password;
		conn = new Strophe.Connection(BOSH_HOST);
		conn.connect(LOGON_USER + "@" + SHORT_HOST_NAME, LOGON_PWD, function(
				status) {
			$scope.show = true;
			if (status === Strophe.Status.CONNECTED) {
				log(status);
				console.log('Connected');
				testFactory.setConnection(conn);
				// set presence
				conn.send($pres());
				conn.roster.get(onGetRoster, 0);
				redirectToHomePage();
				getVcard($scope,conn.authjid);
				conn.addHandler(onMessage, null, "message", null, null, null);
			} else if (status === Strophe.Status.DISCONNECTED) {
				log(status);
			} else if (status === Strophe.Status.CONNECTING) {
				log(status);
			} else if (status === Strophe.Status.DISCONNECTING) {
				log(status);
			} else if (status === Strophe.Status.AUTHENTICATING) {
				log(status);
			} else if (status === Strophe.Status.CONNFAIL) {
				log(status);
			} else if (status === Strophe.Status.AUTHFAIL) {
				log(status);
			} else if (status === Strophe.Status.REGISTER) {
				log(status);
			}
		});
	};
	$scope.disconnect = function() {
		if(conn != null){
			conn.disconnect("user disconnected");
		} else {
			console.log("disconnect faild");
		}
	};
	$scope.change_status = function(sts) {
		if(conn != null){
			var status;
			if(sts === undefined){
				status = $pres();
				$scope.user_status_img = 'assets/icons/status_online.png';
			}else{
				status = $pres().c('show').t(sts);
				switch (sts) {
	            case 'away':
	            	$scope.user_status_img = 'assets/icons/status_away.png';
	                break;
	            case 'dnd':
	            	$scope.user_status_img = 'assets/icons/status_busy.png';
	                break;
	            case 'xa':
	            	$scope.user_status_img = 'assets/icons/status_offline.png';
                break;
	            default:
	            	$scope.user_status_img = 'assets/icons/status_online.png';
				}	
			}
			conn.send(status); 
		} else {
			console.log("not connected");
		}
	};
	function log(status) {
		if(status == Login.Status.CONNECTED){
			$('#log').html(document.createTextNode('Connected'));
		}else if (status === Login.Status.DISCONNECTED) {
		} else if (status === Login.Status.CONNECTING) {
			$('#log').html(document.createTextNode('Connecting'));
		} else if (status === Login.Status.DISCONNECTING) {
		} else if (status === Login.Status.AUTHENTICATING) {
			$('#log').html(document.createTextNode('authenticating'));
		} else if (status === Login.Status.CONNFAIL) {
			$('#log').html(document.createTextNode('Connection with server failed.'));
		} else if (status === Login.Status.AUTHFAIL) {
			$('#log').html(document.createTextNode('Please check credentials.'));
		} else if (status === Login.Status.REGISTER) {
			console.log('registration required');
		}
	}
	function getVcard($scope,jid) {
		conn.vcard.get(function(stanza) {
			$rootScope.$broadcast('vcard-recieved', stanza);
		}, jid);
	}
	$scope.$on('vcard-recieved', function(event, stanza) {
		var $vCard = $(stanza).find("vCard");
		img = $vCard.find('RIGHTIMAGE').text();
		username = $vCard.find('USERNAME').text();
		console.log(username);
		profile_message = $vCard.find('PROFILEMESSAGE').text();
		$scope.$apply(function() {
			$scope.link = img;
			$scope.username = username;
			$scope.profile_message = profile_message;
		});
	});
	$scope.$watch(function() {
		$scope.link = img;
		$scope.username = username;
		$scope.profile_message = profile_message;
	});
	function onSubscriptionRequest(stanza) {
		if (stanza.getAttribute("type") == "subscribe") {
			var from = $(stanza).attr('from');
			log('onSubscriptionRequest: from=' + from);
			// Send a 'subscribed' notification back to accept the incoming
			// subscription request
			conn.send($pres({
				to : from,
				type : "subscribed"
			}));
		}
		return true;
	}
	function redirectToHomePage() {
		$window.location.href = '#homepage';
		conn.addHandler(onSubscriptionRequest, null, "presence", "subscribe");
	}
	$scope.$on('$stateChangeStart', function (event){
		  if (forbit){
		    event.preventDefault()
		  }
		  else{  
		    return
		  }
	});
});
myApp.service('SessionService', function($window) {
    var service = this;
    var sessionStorage = $window.sessionStorage;

    service.get = function(key) {
        return sessionStorage.getItem(key);
    };

    service.set = function(key, value) {
        sessionStorage.setItem(key, value);
    };

    service.unset = function(key) {
        sessionStorage.removeItem(key);
    };
});
myApp.factory('testFactory', function(){
    var connection = null;
    return {
    	getConnection : function () {
            return countF; // we need some way to access actual variable value
        },
        setConnection:function(setConnection){
        	this.connection = connection;
            return connection;
        }
    };            
});