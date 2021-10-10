client = '';
activeClient = '';
whisperClient = '';
chatScroll = '';
zippH = 'qdqz';


enableTheater = function(){
var currentEmbedHeight = $('.vEmbed').height();
var currentEmbedWidth = $('.vEmbed').width();
TweenMax.set('.vEmbed', {height: currentEmbedHeight, width: currentEmbedWidth});
TweenMax.to('.famous-surface:has(div#header)', 2, {y: -50});
TweenMax.to('.famous-surface:has(article#streamsContainer)', 2, {y: 0, height: '100%'});
TweenMax.to('#content', 2, {height: 'calc(100vh)'});
TweenMax.to('#sideWays', 2, {width: '340px'});
TweenMax.to('#chat-wrapper', 2, {height: 'calc(100vh - 80px)'});
TweenMax.to('.scrollbar-chat', 2, {height: 'calc(100vh - 80px)'});
TweenMax.to('#streamsContainer', 2, {backgroundColor: 'rgb(0,0,0)'});
TweenMax.to('.stream-wrap', 2, {height: '100%', onComplete: function(){ TweenMax.set('.vEmbed', {height: '100%', width: '100%'}); TweenMax.to('.vEmbed', 1, {opacity: 1}); }});
$('.sb-right').removeClass('sb-header-adjusted');
Session.set('theaterMode', 'active');
}


disableTheater = function(){
var currentEmbedHeight = $('.vEmbed').height();
var currentEmbedWidth = $('.vEmbed').width();
TweenMax.set('#sb-site', {backgroundColor: 'rgb(0,0,0)'});
TweenMax.set('.vEmbed', {height: currentEmbedHeight, width: currentEmbedWidth});
TweenMax.to('.famous-surface:has(div#header)', 2, {y: 0});
TweenMax.to('.famous-surface:has(article#streamsContainer)', 2, {y: 50, height: 'calc(100vh - 50px)'});
TweenMax.to('#content', 2, {height: 'calc(100vh - 50px)'});
TweenMax.to('#sideWays', 2, {width: '400px'});
TweenMax.to('#chat-wrapper', 2, {height: 'calc(100vh - 130px)'});
TweenMax.to('.scrollbar-chat', 2, {height: 'calc(100vh - 130px)'});
TweenMax.to('#streamsContainer', 2, {backgroundColor: 'rgb(15,15,15)'});
TweenMax.to('#sb-site', 2, {backgroundColor: 'rgb(15,15,15)'});
TweenMax.to('.underVid', 2, {display: 'block', autoAlpha: 1});
TweenMax.to('.stream-wrap', 2, {height: 'calc(100% - 46px)', onComplete: function(){ TweenMax.set('.vEmbed', {height: '100%', width: '100%'}); TweenMax.to('.vEmbed', 1, {opacity: 1}); }});
$('.sb-right').addClass('sb-header-adjusted');
Session.set('theaterMode', '');
}

handleCmd = function(cmd, target) {
  switch(cmd) {
    case 'mention':
      var currentValue = $('#messageInput').val();
      var newValue = '';
      if(currentValue){
        newValue = currentValue + ' ' + target + ' ';
      } else {
        newValue = target + ', ';
      }
      $('#messageInput').val(newValue).focus();
      break;
    case 'whisper':
      $('#messageInput').val('/w ' + target + ' ').focus();
      break;
    case 'poke':
      activeClient.action('drako_gaming', 'pokes ' + target);
      break;
    case 'permit':
      activeClient.say('drako_gaming', '!permit ' + target);
      break;
    case 'ban':
      activeClient.ban("drako_gaming", target);
      break;
    case 'unban':
      activeClient.unban("drako_gaming", target);
      break;
  }
}

handleTimeout = function(target, duration) {
  activeClient.timeout("drako_gaming", target, parseInt(duration));
}
  
  

var movePos = function(theArray, from, to) {
    theArray.splice(to, 0, theArray.splice(from, 1)[0]);
  return theArray;
};

var availableTags = function(){
  var theUsers = ChatUsers.findOne({type: 'online'});
  var persistedUsers = theUsers.chatters;
  var sessionUsers = Session.get('chatUsers' || []);
  var allUsers = _.union(persistedUsers, sessionUsers);
  var sorted = allUsers.sort();
  var needle = sorted.indexOf("drako_gaming");
  if(needle != -1){
    sorted = movePos(sorted, needle, 0);
  }
  return sorted;
}

var removeFromArray = function(theArray, from, to) {
  var rest = theArray.slice((to || from) + 1 || theArray.length);
  theArray.length = from < 0 ? theArray.length + from : from;
  return theArray.push.apply(theArray, rest);
};

var toUnicode = function(theString, escaped) {
  var unicodeString = '';
  for (var i=0; i < theString.length; i++) {
    var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
    while (theUnicode.length < 4) {
      theUnicode = '0' + theUnicode;
    }
if(escaped){
    theUnicode = '\\\\u' + theUnicode;
} else {
    theUnicode = '\\u' + theUnicode;
}
    unicodeString += theUnicode;
  }
  return unicodeString;
};

kappaCannon = function() {
var cannonID = Random.id(5);
var sizes = ["small", "medium", "large"];
var demo = $("body");
var startY = 0;
var endY = -1600;

var tl = new TimelineMax();

for (var i = 0; i < 50; i++) {
  var sizeIndex = randomNumber(0,2); //get random number between 0 and 2
  var size = sizes[sizeIndex]; //get random size
  var speed = (5 - sizeIndex) //larger faster
  var bubble = $('<div class="'+ cannonID +' bubble ' + size + 'Bubble"/>').appendTo(demo); //create a bubble
  
  //create an animation at a random start time
    tl.to(bubble, speed, {y:endY, x:randomNumber(500, 1800), repeatDelay:Math.random()*2, repeat:0}, Math.random() * 2)
}
  

tl.eventCallback("onComplete", function(){
  $('.' + cannonID).remove();
});
}

var _history = ReactiveLocalStorage('history') ? JSON.parse(ReactiveLocalStorage('history')) : [];
var _historySet = ReactiveLocalStorage('historySet') ? JSON.parse(ReactiveLocalStorage('historySet')) : [];
var _histpos = _history.length;
var _histtemp = '';

function addToHistory(_history, newEntry) {
  // Remove repeated history entries
  if (newEntry in _historySet) {
    for (var i = _history.length-1; i >= 0; i--) {
      if (_history[i] == newEntry) {
        _history.splice(i, 1);
        break;
      }
    }
  }
  if(_history.length >= 20){
   removeFromArray(_history, 0);
   ReactiveLocalStorage('history', JSON.stringify(_history));
  }
  _history.push(newEntry);
  _historySet[newEntry] = true;
}

var shortenUrl = function(url) {
    // set url length limit
    var limit = 80;
    var visibleUrl = url;
    if(url.contains('http://') || url.contains('https://')) {
      //already has protocol
    } else {
      //add protocol
      url = 'http://' + url;
    }
    // shorten URL if bigger than limit
    if ( visibleUrl.length > limit) {
        visibleUrl = visibleUrl.substring(0, limit) + '...';
    }
    return '<a href="' + url + '" target="_blank">' + visibleUrl + '</a>';
};

// our URL RegRx
var urlRegex = /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/gi;


function randomNumber(min, max){
  return Math.floor(Math.random() * (1 + max - min) + min);
}

var nthWord = function(str, n) {
  var m = str.split(" ");
  return m[--n];
};

if (!('contains' in String.prototype)) {
  String.prototype.contains = function(str, startIndex) {
    return ''.indexOf.call(this, str, startIndex) !== -1;
  };
}

function dehash(channel) {
  return channel.replace(/^#/, '');
}

function capitalize(n) {
  return n[0].toUpperCase() +  n.substr(1);
}

var twitchEmotes = {
  urlTemplate: 'http://static-cdn.jtvnw.net/emoticons/v1/{{id}}/{{image}}',
  scales: { 1: '1.0', 2: '2.0', 3: '3.0' }
},
    bttvEmotes = {
      urlTemplate: 'https://cdn.betterttv.net/emote/{{id}}/{{image}}',
      scales: { 1: '1x', 2: '2x', 3: '3x' },
      bots: [], // Bots listed by BTTV for a channel { name: 'name', channel: 'channel' }
      emoteCodeList: [], // Just the BTTV emote codes
      emotes: [], // BTTV emotes
      subEmotesCodeList: [], // I don't have a restriction set for Night-sub-only emotes, but the data's here.
      allowEmotesAnyChannel: true // Allow all BTTV emotes that are loaded no matter the channel restriction
    },
    emoteScale = 2;

function htmlEntities(html) { // Custom HTML entity encoder using an array
  function it(HTML) {
    return HTML.map(function(n, i, arr) { // Iterate
      if(n.length == 1) { // Avoid actual HTML
        return n.replace(/[\u00A0-\u9999<>\&]/gim, function(i) { // Replace all special characters (Brute force!)
          return '&#' + i.charCodeAt(0) + ';'; // Replace with HTML entities
        });
      }
      return n;
    });
  }
  var isArray = Array.isArray(html); // Make sure it's an array
  if(!isArray) { // If not
    html = html.split(''); // Make it an array
  }
  html = it(html); // Do it!
  if(!isArray) html = html.join(''); // Join back if it wasn't an array
  return html; // Return the stuff
}

function zGet(uri, data, headers, method, cb, json) { // Simplification of jQuery Ajax for my use
  return $.ajax({
    url:		uri || '',			data:		data || {},
    headers:	headers || {},		type:		method || 'GET',
    dataType:	json !== true ? json : 'jsonp', // Prefer jsonp
    success:	cb || function() { console.log('success', arguments); },
    error:		cb || function() { console.log('error', uri, arguments); }
  });
}

// Find occurences of a string
function getIndicesOf(searchStr, str, caseSensitive) { // http://stackoverflow.com/a/3410557
  var startIndex = 0, searchStrLen = searchStr.length;
  var index, indices = [];
  if(!caseSensitive) {
    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();
  }
  while((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}

// Merge array of objects
function do_merge(roles) { // http://stackoverflow.com/a/21196265
  var merger = function (a, b) {
    if (_.isObject(a)) {
      return _.extend({}, a, b, merger);
    }
    else {
      return a || b;
    }
  };
  var args = _.flatten([{}, roles, merger]);
  return _.extend.apply(_, args);
}

function formatEmotes(text, emotes, channel) { // Format the emotes into the text
  emotes = _.extend(emotes || {}, do_merge(bttvEmotes.emoteCodeList.map(function(n) { // Add BTTV emotes
    var indices = getIndicesOf(n, text, true),
        indMap = indices.map(function(m) {
          return [m, m + n.length - 1].join('-'); // Create indices for formatEmotes
        });
    var obj = {};
    obj[n] = indMap;
    return indMap.length === 0 ? null : obj;
  })));
  var splitText = text.split(''); // Separate into characters
  for(var i in emotes) { // Iterate through the emotes
    var e = emotes[i]; // An emote
    for(var j in e) { // Loop through this emote's instances
      var mote = e[j]; // Indices of this emote instance
      if(typeof mote == 'string') { // Make sure we're only getting the indices and not array methods, etc.
        mote = mote.split('-'); // Split indices 
        mote = [parseInt(mote[0]), parseInt(mote[1])]; // Parse to integers
        var length =  mote[1] - mote[0], // Get emote length
            emote = text.substr(mote[0], length + 1), // Get emote text
            empty = Array.apply(null, new Array(length + 1)).map(function() { return ''; }); // Empty array to take up space of emote characters
        var permToReplace = true, // If it's a BTTV that is allowed to be used, this will still be true ... otherwise true for Twitch emotes
            options = { // Emote image options (Twitch emote by default)
              template: twitchEmotes.urlTemplate, // Use this URL template
              id: i, // Use this image ID
              image: twitchEmotes.scales[emoteScale] // Image scale
            };
        var rSize = '';
        if(i <= 14){
          rSize = ' style="height: 18px"';
        }
        if(bttvEmotes.emoteCodeList.indexOf(emote) > -1) { // Set BTTV emote image options
          var bttvEmote = _.findWhere(bttvEmotes.emotes, { code: emote });

          options.template = bttvEmotes.urlTemplate;
          options.id = bttvEmote.id;
          options.image = bttvEmotes.scales[emoteScale];
        }
        if(permToReplace || bttvEmotes.allowEmotesAnyChannel) {
          var html = '<img class="emoticon" emote="' + emote + '" src="' + options.template
          .replace('{{id}}', options.id)
          .replace('{{image}}', options.image) + '"' + rSize + '>';
          splitText = splitText.slice(0, mote[0]).concat(empty).concat(splitText.slice(mote[1] + 1, splitText.length)); // Replace emote indices with empty space
          splitText.splice(mote[0], 1, html); // Insert emote HTML
        }
      }
    }
  }
  return htmlEntities(splitText).join(''); // Encode non-images
}

function mergeBTTVEmotes(data, channel) {
  console.log('Got BTTV emotes for ' + channel);
  bttvEmotes.emotes = bttvEmotes.emotes.concat(data.emotes.map(function(n) {
    if(!_.has(n, 'restrictions')) {
      n.restrictions = {
        channels: [],
        games: []
      };
    }
    if(n.restrictions.channels.indexOf(channel) == -1) {
      n.restrictions.channels.push(channel);
    }
    return n;
  }));
  bttvEmotes.bots = bttvEmotes.bots.concat(data.bots.map(function(n) {
    return {
      name: n,
      channel: channel
    };
  }));
}

var asyncCalls = [zGet('https://api.betterttv.net/2/emotes', {}, { Accept: 'application/json' }, 'GET', function(data) {
  console.log('Got BTTV global emotes');
  bttvEmotes.emotes = bttvEmotes.emotes.concat(data.emotes.map(function(n) {
    n.global = true;
    return n;
  }));
  bttvEmotes.subEmotesCodeList = _.chain(bttvEmotes.emotes).where({ global: true }).reject(function(n) { return _.isNull(n.channel); }).pluck('code').value();
}, false)];

function addAsyncCall(channel) {
  asyncCalls.push(zGet('https://api.betterttv.net/2/channels/drako_gaming', {}, { Accept: 'application/json' }, 'GET', function(data) {
    mergeBTTVEmotes(data, channel);
  }), false);
}
var channels = ['drako_gaming'];
for(var i in channels) { // Add BTTV emotes for the channels we're connecting to.
  addAsyncCall(channels[i]);
}

function processFragments(formattedMessage) {
  var fragmentedMessage = formattedMessage.split(' ');
  for(i in fragmentedMessage){
    if(fragmentedMessage[i].contains('"') || fragmentedMessage[i].contains('<') || fragmentedMessage[i].contains('>') || fragmentedMessage[i].contains('href=')) {
      //do nothing
    } else {
     fragmentedMessage[i] = fragmentedMessage[i].replace(urlRegex, shortenUrl);
    }
    i++;
  }
  return fragmentedMessage.join(' ');
}

clrChatClient = function() {
  var channels = ['drako_gaming'], // Channels to initially join
	fadeDelay = 5000, // Set to false to disable chat fade
	showChannel = true, // Show repespective channels if the channels is longer than 1
	useColor = false, // Use chatters' colors or to inherit
	showBadges = true, // Show chatters' badges
	showEmotes = true, // Show emotes in the chat
	doTimeouts = true, // Hide the messages of people who are timed-out
	doChatClears = true, // Hide the chat from an entire channel
	showHosting = true, // Show when the channel is hosting or not
	showConnectionNotices = true; // Show messages like "Connected" and "Disconnected"

var chat = document.getElementById('chat'),
	defaultColors = ['rgb(255, 255, 255)'],
	randomColorsChosen = {},
	clientOptions = {
			options: {
					debug: true
				},
    connection: {
        random: "chat",
        reconnect: true
    },
    identity: {
    },
			channels: channels
		}
clrClient = new irc.client(clientOptions);

function badges(chan, user) {
	
	function createBadge(name) {
		var badge = document.createElement('div');
		badge.className = 'chat-badge-' + name;
		return badge;
	}
	
	var chatBadges = document.createElement('span');
	chatBadges.className = 'chat-badges';
	
		if(user.username == chan) {
			chatBadges.appendChild(createBadge('broadcaster'));
		}
		if(user['user-type']) {
			chatBadges.appendChild(createBadge(user['user-type']));
		}
    if(user.subscriber) {
			chatBadges.appendChild(createBadge('subscriber'));
		}
	 
	return chatBadges;
}

function handleChat(channel, user, message, self) {
  var currentUser = 'noCurrentUser';
  if(Meteor.user()){
    currentUser = Meteor.user().name;
  }
  var scrolledToBottom = true;
  if((($('#chat-wrapper').prop('scrollHeight') - $('#chat-wrapper').innerHeight()) - $('#chat-wrapper').scrollTop()) > 100) {
    scrolledToBottom = false;
  }
  var messageTime = moment().format("h:mm");
  var hideTime = ReactiveLocalStorage("timestampHide");
  var chatting = user.username;
  var userColor = Chatcolor.findOne({name: chatting});
  var userGlow = Chatglow.findOne({name: chatting});
  var recentDonation = Donations.findOne({type: 'recent'}).userName;
  var topDonation = Donations.findOne({type: 'top'}).userName;
  var chan = dehash(channel),
      name = user.username,
      chatLine = document.createElement('div'),
      chatBreak = document.createElement('br'),
      chatTime = document.createElement('span'),
      chatChannel = document.createElement('span'),
      chatName = document.createElement('span'),
      chatColon = document.createElement('span'),
      chatMessage = document.createElement('span');
  var color = '#FFF';
  if(useColor){
    color = user.color ? user.color : '#FFF';
  } else {
	 color = userColor ? userColor.color : '#FFF';
  }
	if(color === null) {
		if(!randomColorsChosen.hasOwnProperty(chan)) {
			randomColorsChosen[chan] = {};
		}
		if(randomColorsChosen[chan].hasOwnProperty(name)) {
			color = randomColorsChosen[chan][name];
		}
		else {
			color = defaultColors[Math.floor(Math.random()*defaultColors.length)];
			randomColorsChosen[chan][name] = color;
		}
	}
  
  	var glow = userGlow ? userGlow.glow : 'none';
	
	chatLine.className = 'chat-line';
	chatLine.dataset.username = name;
	chatLine.dataset.channel = channel;
	
	if(user['message-type'] == 'action') {
		chatLine.className += ' chat-action';
	}
  if(hideTime){
    chatTime.className = 'chat-time hide-time';
  } else {
    chatTime.className = 'chat-time';
  }
	
  chatTime.innerHTML = '<small>' + messageTime + '</small>';
  
	chatChannel.className = 'chat-channel';
	chatChannel.innerHTML = chan;
	
	chatName.className = 'chat-name';
	chatName.style.color = color;
  chatName.style.textShadow = glow;
    if(glow != 'none'){
      chatName.style.color = '#FFF';
    }

	chatName.innerHTML = user['display-name'] || name;
  var thisName = user['display-name'] || name;
  chatName.title = thisName;
  if(chatting == recentDonation) {
    chatName.title = thisName + ' - Most Recent Donation Glow (donate any amount to steal)';
  }
  if(chatting == topDonation) {
    var donationAmount = parseFloat(Donations.findOne({type: 'top'}).amount) + .01;
   chatName.title = thisName + ' - Top Donation Glow ($' + donationAmount + ' to steal)';
  }
	
	chatColon.className = 'chat-colon';
	
	chatMessage.className = 'chat-message';
	chatMessage.style.color = color;
  var formattedMessage = formatEmotes(message, user.emotes, channel);
  var processedMessage = processFragments(formattedMessage);
	chatMessage.innerHTML = processedMessage;
	chatLine.appendChild(chatTime);
	if(clrClient.opts.channels.length > 1 && showChannel) chatLine.appendChild(chatChannel);
	if(showBadges) chatLine.appendChild(badges(chan, user));
	chatLine.appendChild(chatName);
	chatLine.appendChild(chatColon);
	chatLine.appendChild(chatMessage);
  
 
  var donationGlow = "rgb(242, 255, 0) 0px 0px 4px, rgb(103, 206, 9) 0px 0px 20px, rgb(103, 206, 9) 0px 0px 10px, rgb(103, 206, 9) 0px 0px 10px, rgb(103, 206, 9) 0px 0px 10px, rgb(103, 206, 9) 0px 0px 10px, rgb(103, 206, 9) 0px 0px 10px, rgb(103, 206, 9) 0px 0px 10px";
  var over9000 = "rgba(255, 255, 255, .4) 0px 0px 4px, rgb(212, 0, 0) 0px 0px 10px, rgb(212, 0, 0) 0px 0px 10px, rgb(212, 0, 0) 0px 0px 10px, rgb(212, 0, 0) 0px 0px 10px, rgb(212, 0, 0) 0px 0px 10px, rgb(212, 0, 0) 0px 0px 10px, rgb(212, 0, 0) 0px 0px 10px";
  var glow1 = "rgba(255, 255, 255, .4) 0px 0px 4px, rgba(212, 0, 0, 1) 0px 0px 10px, rgba(212, 0, 0, 1) 0px 0px 10px, rgba(212, 0, 0, 1) 0px 0px 10px, rgba(212, 0, 0, 1) 0px 0px 10px, rgba(212, 0, 0, 1) 0px 0px 10px, rgba(212, 0, 0, 1) 0px 0px 10px, rgba(212, 0, 0, 1) 0px 0px 10px";
  var glow0 = "rgba(255, 255, 255, .4) 0px 0px 4px, rgba(212, 0, 0, .3) 0px 0px 10px, rgba(212, 0, 0, .3) 0px 0px 10px, rgba(212, 0, 0, .3) 0px 0px 10px, rgba(212, 0, 0, .3) 0px 0px 10px, rgba(212, 0, 0, .3) 0px 0px 10px, rgba(212, 0, 0, .3) 0px 0px 10px, rgba(212, 0, 0, .3) 0px 0px 10px";
  var hslGlowA = "rgb(242, 255, 0) 0px 0px 4px, hsla(0, 60%, 48%, 1) 0px 0px 20px, hsla(0, 60%, 48%, 1) 0px 0px 10px, hsla(0, 60%, 48%, 1) 0px 0px 10px, hsla(0, 60%, 48%, 1) 0px 0px 10px, hsla(0, 60%, 48%, 1) 0px 0px 10px, hsla(0, 60%, 48%, 1) 0px 0px 10px, hsla(0, 60%, 48%, 1) 0px 0px 10px";
  var hslGlowB = "rgb(242, 255, 0) 0px 0px 4px, hsla(360, 60%, 48%, 1) 0px 0px 20px, hsla(360, 60%, 48%, 1) 0px 0px 10px, hsla(360, 60%, 48%, 1) 0px 0px 10px, hsla(360, 60%, 48%, 1) 0px 0px 10px, hsla(360, 60%, 48%, 1) 0px 0px 10px, hsla(360, 60%, 48%, 1) 0px 0px 10px, hsla(360, 60%, 48%, 1) 0px 0px 10px";
  var wickedGlowStart = "rgba(196, 49, 49, 1) 0px 0px 0px, rgba(196, 49, 49, 1) 0px 0px 20px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px";
  var wickedGlow = "rgb(0,0,0) 0px 0px 0px, rgb(242, 255, 0) 0px 0px 4px, rgba(196, 49, 49, 1) 0px 0px 20px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px";
  var wickedGlowRev = "rgb(196, 49, 49) 0px 0px 4px, rgb(196, 49, 49) 0px 0px 20px, rgb(196, 49, 49) 0px 0px 10px, rgb(196, 49, 49) 0px 0px 10px, rgb(242, 255, 0) 0px 0px 10px, rgb(242, 255, 0) 0px 0px 10px, rgb(242, 255, 0) 0px 0px 10px, rgb(242, 255, 0) 0px 0px 10px";
  var wickedDark = "rgb(0,0,0) 0px 0px 0px, rgba(0,0,0,.4) 0px 0px 2px, rgb(196, 49, 49) 0px 0px 20px, rgb(196, 49, 49) 0px 0px 10px, rgb(196, 49, 49) 0px 0px 10px, rgb(196, 49, 49) 0px 0px 10px, rgb(196, 49, 49) 0px 0px 10px, rgb(196, 49, 49) 0px 0px 10px, rgb(196, 49, 49) 0px 0px 10px";
  if(chatting == recentDonation){
  chatName.style.color = "#000";
  chatName.style.fontWeight = 900;
  chatName.style.textShadow = donationGlow;
  }
    if(chatting == topDonation){
      chatName.style.color = "#000";
      chatName.style.fontWeight = 900;
      chatName.style.textShadow = wickedGlow;
      TweenMax.to(chatName, 2, {
        textShadow:wickedDark, ease: Power3.easeIn, repeat: 1, yoyo: true
      });
    }
  
	chat.appendChild(chatLine);

  var currentHeight = $('#chat-wrapper').prop('scrollHeight');
    $('#chat-wrapper').animate({ scrollTop: currentHeight }, 1000);
	
}

function chatNotice(information, noticeFadeDelay, level, additionalClasses) {
  var scrolledToBottom = true;
  if((($('#chat-wrapper').prop('scrollHeight') - $('#chat-wrapper').innerHeight()) - $('#chat-wrapper').scrollTop()) > 100) {
    scrolledToBottom = false;
  }
	var ele = document.createElement('div');
	
	ele.className = 'chat-line chat-notice';
	ele.innerHTML = information;
	
	if(additionalClasses !== undefined) {
		if(Array.isArray(additionalClasses)) {
			additionalClasses = additionalClasses.join(' ');
		}
		ele.className += ' ' + additionalClasses;
	}
	
	if(typeof level == 'number' && level != 0) {
		ele.dataset.level = level;
	}
	
	chat.appendChild(ele);
    var currentHeight = $('#chat-wrapper').prop('scrollHeight');
  if(scrolledToBottom){
    $('#chat-wrapper').scrollTop(currentHeight);
  }
	
	if(typeof noticeFadeDelay == 'number') {
		setTimeout(function() {
				ele.dataset.faded = '';
			}, noticeFadeDelay || 500);
	}
	
	return ele;
}

var recentTimeouts = {};

function timeout(channel, username) {
	if(!doTimeouts) return false;
	if(!recentTimeouts.hasOwnProperty(channel)) {
		recentTimeouts[channel] = {};
	}
	if(!recentTimeouts[channel].hasOwnProperty(username) || recentTimeouts[channel][username] + 1000*10 < +new Date) {
		recentTimeouts[channel][username] = +new Date;
		chatNotice(capitalize(username) + ' was timed-out in ' + capitalize(dehash(channel)), 1000, 1, 'chat-delete-timeout')
	};
	var toHide = document.querySelectorAll('.chat-line[data-channel="' + channel + '"][data-username="' + username + '"]:not(.chat-timedout) .chat-message');
	for(var i in toHide) {
		var h = toHide[i];
		if(typeof h == 'object') {
			h.innerText = '<Message deleted>';
			h.parentElement.className += ' chat-timedout';
		}
	}
}
function clearChat(channel) {
	if(!doChatClears) return false;
	var toHide = document.querySelectorAll('.chat-line[data-channel="' + channel + '"]');
	for(var i in toHide) {
		var h = toHide[i];
		if(typeof h == 'object') {
			h.className += ' chat-cleared';
		}
	}
	chatNotice('Chat was cleared in ' + capitalize(dehash(channel)), 1000, 1, 'chat-delete-clear')
}
function hosting(channel, target, viewers, unhost) {
	if(!showHosting) return false;
	if(viewers == '-') viewers = 0;
	var chan = dehash(channel);
	chan = capitalize(chan);
	if(!unhost) {
		var targ = capitalize(target);
		chatNotice(chan + ' is now hosting ' + targ + ' for ' + viewers + ' viewer' + (viewers !== 1 ? 's' : '') + '.', null, null, 'chat-hosting-yes');
	}
	else {
		chatNotice(chan + ' is no longer hosting.', null, null, 'chat-hosting-no');
	}
}

clrClient.on("chat", handleChat);
clrClient.on("action", handleChat);
clrClient.addListener('timeout', timeout);
clrClient.addListener('clearchat', clearChat);

var joinAccounced = [];

clrClient.on("connecting", function (address, port) {
  if(!Meteor.user()) {
		if(showConnectionNotices) chatNotice('Connecting', 1000, -4, 'chat-connection-good-connecting');
  }
	});
clrClient.on("connected", function (address, port) {
    if(!Meteor.user()) {
		if(showConnectionNotices) chatNotice('Connected as guest - log in to chat!', 1000, -2, 'chat-connection-good-connected');
		joinAccounced = [];
      }
	});
clrClient.on("disconnected", function (reason) {
  if(!Meteor.user()) {
		if(showConnectionNotices) chatNotice('Disconnected: ' + (reason || ''), 3000, 2, 'chat-connection-bad-disconnected');
    }
	});
clrClient.on("reconnect", function () {
  if(!Meteor.user()) {
		if(showConnectionNotices) chatNotice('Reconnected', 1000, 'chat-connection-good-reconnect');
  }
	});

clrClient.addListener('crash', function () {
		chatNotice('Crashed', 10000, 4, 'chat-crash');
	});

  $.when.apply({}, asyncCalls).always(function() {
    bttvEmotes.emoteCodeList = _.pluck(bttvEmotes.emotes, 'code');
    clrClient.connect();
    $('#chat-wrapper').scrollbar({
      "onUpdate": function(y){
        
      }
    });
  });
}

anonymousClient = function() {
  var channels = ['drako_gaming'], // Channels to initially join
	fadeDelay = 5000, // Set to false to disable chat fade
	showChannel = true, // Show repespective channels if the channels is longer than 1
	useColor = false, // Use chatters' colors or to inherit
	showBadges = true, // Show chatters' badges
	showEmotes = true, // Show emotes in the chat
	doTimeouts = true, // Hide the messages of people who are timed-out
	doChatClears = true, // Hide the chat from an entire channel
	showHosting = true, // Show when the channel is hosting or not
	showConnectionNotices = true; // Show messages like "Connected" and "Disconnected"

var chat = document.getElementById('chat'),
	defaultColors = ['rgb(255, 255, 255)'],
	randomColorsChosen = {},
	clientOptions = {
			options: {
					debug: true
				},
    connection: {
        random: "chat",
        reconnect: true
    },
    identity: {
    },
			channels: channels
		}
client = new irc.client(clientOptions);

function badges(chan, user) {
	
	function createBadge(name) {
		var badge = document.createElement('div');
		badge.className = 'chat-badge-' + name;
		return badge;
	}
	
	var chatBadges = document.createElement('span');
	chatBadges.className = 'chat-badges';
	
		if(user.username == chan) {
			chatBadges.appendChild(createBadge('broadcaster'));
		}
		if(user['user-type']) {
			chatBadges.appendChild(createBadge(user['user-type']));
		}
    if(user.subscriber) {
			chatBadges.appendChild(createBadge('subscriber'));
		}
	 
	return chatBadges;
}

function handleChat(channel, user, message, self) {
  var currentUser = 'noCurrentUser';
  if(Meteor.user()){
    currentUser = Meteor.user().name;
  }
  var scrolledToBottom = true;
  if((($('#chat-wrapper').prop('scrollHeight') - $('#chat-wrapper').innerHeight()) - $('#chat-wrapper').scrollTop()) > 100) {
    scrolledToBottom = false;
  }
  var messageTime = moment().format("h:mm");
  var hideTime = ReactiveLocalStorage("timestampHide");
  var chatting = user.username;
  var userColor = Chatcolor.findOne({name: chatting});
  var userGlow = Chatglow.findOne({name: chatting});
  var recentDonation = Donations.findOne({type: 'recent'}).userName;
  var topDonation = Donations.findOne({type: 'top'}).userName;
  var chan = dehash(channel),
      name = user.username,
      chatLine = document.createElement('div'),
      chatTime = document.createElement('span'),
      chatChannel = document.createElement('span'),
      chatName = document.createElement('span'),
      chatColon = document.createElement('span'),
      chatMessage = document.createElement('span');
  var color = '#FFF';
  if(useColor){
    color = user.color ? user.color : '#FFF';
  } else {
	 color = userColor ? userColor.color : '#FFF';
  }
	if(color === null) {
		if(!randomColorsChosen.hasOwnProperty(chan)) {
			randomColorsChosen[chan] = {};
		}
		if(randomColorsChosen[chan].hasOwnProperty(name)) {
			color = randomColorsChosen[chan][name];
		}
		else {
			color = defaultColors[Math.floor(Math.random()*defaultColors.length)];
			randomColorsChosen[chan][name] = color;
		}
	}
  
  	var glow = userGlow ? userGlow.glow : 'none';
	
	chatLine.className = 'chat-line';
	chatLine.dataset.username = name;
	chatLine.dataset.channel = channel;
	
	if(user['message-type'] == 'action') {
		chatLine.className += ' chat-action';
	}
  if(hideTime){
    chatTime.className = 'chat-time hide-time';
  } else {
    chatTime.className = 'chat-time';
  }
	
  chatTime.innerHTML = '<small>' + messageTime + '</small>';
  
	chatChannel.className = 'chat-channel';
	chatChannel.innerHTML = chan;
	
	chatName.className = 'chat-name';
	chatName.style.color = color;
  if(!ReactiveLocalStorage('glowHide')) {
  chatName.style.textShadow = glow;
    if(glow != 'none'){
      chatName.style.color = '#FFF';
    }
  }
	chatName.innerHTML = user['display-name'] || name;
  chatName.dataset.toggle = "context";
  chatName.dataset.target = "#chat-context-menu";
  chatName.dataset.tooltip = "tooltip";
  chatName.dataset.placement = "top";
  var thisName = user['display-name'] || name;
  chatName.title = thisName;
  if(chatting == recentDonation) {
    chatName.title = thisName + ' - Most Recent Donation Glow (donate any amount to steal)';
  }
  if(chatting == topDonation) {
    var donationAmount = parseFloat(Donations.findOne({type: 'top'}).amount) + .01;
   chatName.title = thisName + ' - Top Donation Glow ($' + donationAmount + ' to steal)';
  }
	
	chatColon.className = 'chat-colon';
	
	chatMessage.className = 'chat-message';
	chatMessage.style.color = color;
  var formattedMessage = formatEmotes(message, user.emotes, channel);
  var processedMessage = processFragments(formattedMessage);
	chatMessage.innerHTML = processedMessage;
	chatLine.appendChild(chatTime);
	if(client.opts.channels.length > 1 && showChannel) chatLine.appendChild(chatChannel);
	if(showBadges) chatLine.appendChild(badges(chan, user));
	chatLine.appendChild(chatName);
	chatLine.appendChild(chatColon);
	chatLine.appendChild(chatMessage);
  
  if(!ReactiveLocalStorage('glowHide')) {
  var donationGlow = "rgb(242, 255, 0) 0px 0px 4px, rgb(103, 206, 9) 0px 0px 20px, rgb(103, 206, 9) 0px 0px 10px, rgb(103, 206, 9) 0px 0px 10px, rgb(103, 206, 9) 0px 0px 10px, rgb(103, 206, 9) 0px 0px 10px, rgb(103, 206, 9) 0px 0px 10px, rgb(103, 206, 9) 0px 0px 10px";
  var over9000 = "rgba(255, 255, 255, .4) 0px 0px 4px, rgb(212, 0, 0) 0px 0px 10px, rgb(212, 0, 0) 0px 0px 10px, rgb(212, 0, 0) 0px 0px 10px, rgb(212, 0, 0) 0px 0px 10px, rgb(212, 0, 0) 0px 0px 10px, rgb(212, 0, 0) 0px 0px 10px, rgb(212, 0, 0) 0px 0px 10px";
  var glow1 = "rgba(255, 255, 255, .4) 0px 0px 4px, rgba(212, 0, 0, 1) 0px 0px 10px, rgba(212, 0, 0, 1) 0px 0px 10px, rgba(212, 0, 0, 1) 0px 0px 10px, rgba(212, 0, 0, 1) 0px 0px 10px, rgba(212, 0, 0, 1) 0px 0px 10px, rgba(212, 0, 0, 1) 0px 0px 10px, rgba(212, 0, 0, 1) 0px 0px 10px";
  var glow0 = "rgba(255, 255, 255, .4) 0px 0px 4px, rgba(212, 0, 0, .3) 0px 0px 10px, rgba(212, 0, 0, .3) 0px 0px 10px, rgba(212, 0, 0, .3) 0px 0px 10px, rgba(212, 0, 0, .3) 0px 0px 10px, rgba(212, 0, 0, .3) 0px 0px 10px, rgba(212, 0, 0, .3) 0px 0px 10px, rgba(212, 0, 0, .3) 0px 0px 10px";
  var hslGlowA = "rgb(242, 255, 0) 0px 0px 4px, hsla(0, 60%, 48%, 1) 0px 0px 20px, hsla(0, 60%, 48%, 1) 0px 0px 10px, hsla(0, 60%, 48%, 1) 0px 0px 10px, hsla(0, 60%, 48%, 1) 0px 0px 10px, hsla(0, 60%, 48%, 1) 0px 0px 10px, hsla(0, 60%, 48%, 1) 0px 0px 10px, hsla(0, 60%, 48%, 1) 0px 0px 10px";
  var hslGlowB = "rgb(242, 255, 0) 0px 0px 4px, hsla(360, 60%, 48%, 1) 0px 0px 20px, hsla(360, 60%, 48%, 1) 0px 0px 10px, hsla(360, 60%, 48%, 1) 0px 0px 10px, hsla(360, 60%, 48%, 1) 0px 0px 10px, hsla(360, 60%, 48%, 1) 0px 0px 10px, hsla(360, 60%, 48%, 1) 0px 0px 10px, hsla(360, 60%, 48%, 1) 0px 0px 10px";
  var wickedGlowStart = "rgba(196, 49, 49, 1) 0px 0px 0px, rgba(196, 49, 49, 1) 0px 0px 20px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px";
  var wickedGlow = "rgb(0,0,0) 0px 0px 0px, rgb(242, 255, 0) 0px 0px 4px, rgba(196, 49, 49, 1) 0px 0px 20px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px, rgba(196, 49, 49, 1) 0px 0px 10px";
  var wickedGlowRev = "rgb(196, 49, 49) 0px 0px 4px, rgb(196, 49, 49) 0px 0px 20px, rgb(196, 49, 49) 0px 0px 10px, rgb(196, 49, 49) 0px 0px 10px, rgb(242, 255, 0) 0px 0px 10px, rgb(242, 255, 0) 0px 0px 10px, rgb(242, 255, 0) 0px 0px 10px, rgb(242, 255, 0) 0px 0px 10px";
  var wickedDark = "rgb(0,0,0) 0px 0px 0px, rgba(0,0,0,.4) 0px 0px 2px, rgb(196, 49, 49) 0px 0px 20px, rgb(196, 49, 49) 0px 0px 10px, rgb(196, 49, 49) 0px 0px 10px, rgb(196, 49, 49) 0px 0px 10px, rgb(196, 49, 49) 0px 0px 10px, rgb(196, 49, 49) 0px 0px 10px, rgb(196, 49, 49) 0px 0px 10px";
  if(chatting == recentDonation){
  chatName.style.color = "#000";
  chatName.style.fontWeight = 900;
  chatName.style.textShadow = donationGlow;
  }
    if(chatting == topDonation){
      chatName.style.color = "#000";
      chatName.style.fontWeight = 900;
      chatName.style.textShadow = wickedGlow;
      TweenMax.to(chatName, 2, {
        textShadow:wickedDark, ease: Power3.easeIn, repeat: 1, yoyo: true
      });
    }
  }
  if(chatting != currentUser) {
  var wordsToHighlight = JSON.parse(ReactiveLocalStorage('highlightChat'));
  
  var hC = wordsToHighlight.join('|');
      hC = hC.replace(/([^\x00-\x7F]+)/g, function(x){return toUnicode(x, 1);});
  var regex = new RegExp('\\b(' + hC + ')(\\W*[^a-zA-Z]|\\b)', 'gi');
  var testMessage = message.replace(/([^\x00-\x7F]+)/g, function(x){return 'UC' + toUnicode(x);})
    if(regex.test(testMessage)){
      chatLine.className = 'chat-line highlight';
    }
    if (message.toLowerCase().contains(currentUser)) {
      chatLine.className = 'chat-line highlight';
    }
  }
	chat.appendChild(chatLine);

  var currentHeight = $('#chat-wrapper').prop('scrollHeight');
  if(scrolledToBottom){
    $('#chat-wrapper').scrollTop(currentHeight);
  } else {
    var moreChat = $('#morechat');
    TweenMax.to(moreChat, 1, { autoAlpha: 1, display: 'block', ease: 'easeIn', onComplete: function(){
      TweenMax.to(moreChat, 1.5, { autoAlpha: 0, display: 'none', delay: 2, ease: 'easeOut'})
    }});
  }
  if(chatting == "thetamax") {
    if(message.contains('kappaCannon')) {
      kappaCannon();
    }
  }
  if(chatting == "drako_gaming") {
    if(message.contains('kappaCannon')) {
      kappaCannon();
    }
  }
	
	if(typeof fadeDelay == 'number') {
		setTimeout(function() {
				chatLine.dataset.faded = '';
			}, fadeDelay);
	}
	
	if(chat.children.length > 150) {
		var oldMessages = [].slice.call(chat.children).slice(0, 10);
		for(var i in oldMessages) oldMessages[i].remove();
	}
  var currentUsers = Session.get('chatUsers') || [];
      currentUsers.push(chatting);
      Session.set('chatUsers', _.uniq(currentUsers));
}

function chatNotice(information, noticeFadeDelay, level, additionalClasses) {
  var scrolledToBottom = true;
  if((($('#chat-wrapper').prop('scrollHeight') - $('#chat-wrapper').innerHeight()) - $('#chat-wrapper').scrollTop()) > 100) {
    scrolledToBottom = false;
  }
	var ele = document.createElement('div');
	
	ele.className = 'chat-line chat-notice';
	ele.innerHTML = information;
	
	if(additionalClasses !== undefined) {
		if(Array.isArray(additionalClasses)) {
			additionalClasses = additionalClasses.join(' ');
		}
		ele.className += ' ' + additionalClasses;
	}
	
	if(typeof level == 'number' && level != 0) {
		ele.dataset.level = level;
	}
	
	chat.appendChild(ele);
    var currentHeight = $('#chat-wrapper').prop('scrollHeight');
  if(scrolledToBottom){
    $('#chat-wrapper').scrollTop(currentHeight);
  }
	
	if(typeof noticeFadeDelay == 'number') {
		setTimeout(function() {
				ele.dataset.faded = '';
			}, noticeFadeDelay || 500);
	}
	
	return ele;
}

var recentTimeouts = {};

function timeout(channel, username) {
	if(!doTimeouts) return false;
	if(!recentTimeouts.hasOwnProperty(channel)) {
		recentTimeouts[channel] = {};
	}
	if(!recentTimeouts[channel].hasOwnProperty(username) || recentTimeouts[channel][username] + 1000*10 < +new Date) {
		recentTimeouts[channel][username] = +new Date;
		chatNotice(capitalize(username) + ' was timed-out in ' + capitalize(dehash(channel)), 1000, 1, 'chat-delete-timeout')
	};
	var toHide = document.querySelectorAll('.chat-line[data-channel="' + channel + '"][data-username="' + username + '"]:not(.chat-timedout) .chat-message');
	for(var i in toHide) {
		var h = toHide[i];
		if(typeof h == 'object') {
			h.innerText = '<Message deleted>';
			h.parentElement.className += ' chat-timedout';
		}
	}
}
function clearChat(channel) {
	if(!doChatClears) return false;
	var toHide = document.querySelectorAll('.chat-line[data-channel="' + channel + '"]');
	for(var i in toHide) {
		var h = toHide[i];
		if(typeof h == 'object') {
			h.className += ' chat-cleared';
		}
	}
	chatNotice('Chat was cleared in ' + capitalize(dehash(channel)), 1000, 1, 'chat-delete-clear')
}
function hosting(channel, target, viewers, unhost) {
	if(!showHosting) return false;
	if(viewers == '-') viewers = 0;
	var chan = dehash(channel);
	chan = capitalize(chan);
	if(!unhost) {
		var targ = capitalize(target);
		chatNotice(chan + ' is now hosting ' + targ + ' for ' + viewers + ' viewer' + (viewers !== 1 ? 's' : '') + '.', null, null, 'chat-hosting-yes');
	}
	else {
		chatNotice(chan + ' is no longer hosting.', null, null, 'chat-hosting-no');
	}
}

client.on("chat", handleChat);
client.on("action", handleChat);
client.addListener('timeout', timeout);
client.addListener('clearchat', clearChat);
client.addListener('hosting', hosting);
client.addListener('unhost', function(channel, viewers) { hosting(channel, null, viewers, true) });

var joinAccounced = [];

client.on("connecting", function (address, port) {
  if(!Meteor.user()) {
		if(showConnectionNotices) chatNotice('Connecting', 1000, -4, 'chat-connection-good-connecting');
  }
	});
  client.on("connected", function (address, port) {
    if(!Meteor.user()) {
		if(showConnectionNotices) chatNotice('Connected as guest - log in to chat!', 1000, -2, 'chat-connection-good-connected');
		joinAccounced = [];
      }
	});
client.on("disconnected", function (reason) {
  if(!Meteor.user()) {
		if(showConnectionNotices) chatNotice('Disconnected: ' + (reason || ''), 3000, 2, 'chat-connection-bad-disconnected');
    }
	});
client.on("reconnect", function () {
  if(!Meteor.user()) {
		if(showConnectionNotices) chatNotice('Reconnected', 1000, 'chat-connection-good-reconnect');
  }
	});

client.addListener('crash', function () {
		chatNotice('Crashed', 10000, 4, 'chat-crash');
	});

  $.when.apply({}, asyncCalls).always(function() {
    bttvEmotes.emoteCodeList = _.pluck(bttvEmotes.emotes, 'code');
    client.connect();
    $('#chat-wrapper').scrollbar({
      "onUpdate": function(y){
        
      }
    });
    
    $('#chat').on('dblclick', '.chat-name', function(e){
      e.preventDefault();
      var userToTarget = $(e.target).html();
      var chatInput = $('#messageInput');
      var currentText = chatInput.val();
      if(currentText == ''){
        chatInput.val(userToTarget + ', ');
      } else {
        chatInput.val(currentText + ' ' + userToTarget + ' ');
      }
      chatInput.focus();
      TweenMax.to('#chatSettingsSlideWrapper', .2, {x: -38, ease:'Linear'});
      $('#chatSettingsSlideWrapper').addClass('shifted');
    })
  });
}

authenticatedClient = {
  init: function() {

    $('body').contextmenu({
      selector: '.chat-name',
      target:'#context-menu', 
      before: function(e,context) {
        console.log(context);
        var contextUser = $(e.target).text();
        $('#context-menu').find('.dropdown-header').text(contextUser);
        $('#context-menu li>a').attr('data-target', contextUser);
      },
      onItem: function(context,e) {
        var contextTarget = $(e.target).data('target');
        var theCmd = $(e.target).data('cmd');
        if(theCmd == 'timeout'){
          var duration = $(e.target).data('length');
          handleTimeout(contextTarget, duration);
        } else {
          handleCmd(theCmd, contextTarget);
        }
      }
    });
    
    $.ui.autocomplete.filter = function (array, term) {
    var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
    return $.grep(array, function (value) {
        return matcher.test(value.label || value.value || value);
    });
};

    function split(val) {
    return val.split(/@\s*/);
}
    
    
    function extractLast(term) {
    return split(term).pop();
}

    $("#messageInput")
    // don't navigate away from the field on tab when selecting an item
      .bind("keydown", function(event) {
      if (event.keyCode === $.ui.keyCode.TAB && $(this).data("autocomplete").menu.active) {
        event.preventDefault();
        event.stopPropagation();
      }
    }).autocomplete({
      position: {my: 'left bottom', at: 'left top'},
      minLength: 0,
      source: function(request, response) {
        var term = request.term,
            results = [];
        if (term.indexOf("@") >= 0) {
          term = extractLast(request.term);
          if (term.length >= 0) {
            results = $.ui.autocomplete.filter(
              availableTags(), term);
          }
        }
        response(results.slice(0, 5));
      },
      autoFocus: true,
      focus: function() {
        // prevent value inserted on focus
        return false;
      },
      select: function(event, ui) {
        event.preventDefault();
        event.stopPropagation();
        var thisOne = this;
        var toConvert = ui.item.value;
        $.get("https://api.twitch.tv/kraken/users/" + toConvert, function( data ) {
          var terms = split(thisOne.value);
          // remove the current input
          terms.pop();
          // add the selected item
          var converted = data.display_name;

          terms.push(converted);
          // add placeholder to get the comma-and-space at the end
          terms.push("");
          thisOne.value = terms.join("") + ' ';
        });
      },
      open: function( event, ui ) {
        Session.set('acOpen', true);
      },
      close: function( event, ui ) { 
        Session.set('acOpen', false);
      }
    });

  var channels = ['drako_gaming'], // Channels to initially join
	showConnectionNotices = true; // Show messages like "Connected" and "Disconnected"

var chatUser = Meteor.user().profile.display_name;
var chatToken = Meteor.user().services.twitch.accessToken;

var chat = document.getElementById('chat'),
	clientOptions = {
			options: {
					debug: true
				},
    connection: {
        random: "chat",
        reconnect: true
    },
    identity: {
        username: chatUser,
        password: 'oauth:' + chatToken
    },
			channels: channels
		},
    whisperClientOptions = {
			options: {
					debug: false
				},
    connection: {
        random: "group",
        reconnect: true
    },
    identity: {
        username: chatUser,
        password: 'oauth:' + chatToken
    },
			channels: channels
		}
activeClient = new irc.client(clientOptions);
whisperClient = new irc.client(whisperClientOptions);

function dehash(channel) {
	return channel.replace(/^#/, '');
}

function capitalize(n) {
	return n[0].toUpperCase() +  n.substr(1);
}

function htmlEntities(html) { // Custom HTML entity encoder using an array
	function it(HTML) {
		return HTML.map(function(n, i, arr) { // Iterate
				if(n.length == 1) { // Avoid actual HTML
					return n.replace(/[\u00A0-\u9999<>\&]/gim, function(i) { // Replace all special characters (Brute force!)
						   return '&#' + i.charCodeAt(0) + ';'; // Replace with HTML entities
						});
				}
				return n;
			});
	}
	var isArray = Array.isArray(html); // Make sure it's an array
	if(!isArray) { // If not
		html = html.split(''); // Make it an array
	}
	html = it(html); // Do it!
	if(!isArray) html = html.join(''); // Join back if it wasn't an array
	return html; // Return the stuff
}

// Find occurences of a string
function getIndicesOf(searchStr, str, caseSensitive) { // http://stackoverflow.com/a/3410557
	var startIndex = 0, searchStrLen = searchStr.length;
	var index, indices = [];
	if(!caseSensitive) {
		str = str.toLowerCase();
		searchStr = searchStr.toLowerCase();
	}
	while((index = str.indexOf(searchStr, startIndex)) > -1) {
		indices.push(index);
		startIndex = index + searchStrLen;
	}
	return indices;
}

function chatNotice(information, noticeFadeDelay, level, additionalClasses) {
	var ele = document.createElement('div');
	
	ele.className = 'chat-line chat-notice';
	ele.innerHTML = information;
	
	if(additionalClasses !== undefined) {
		if(Array.isArray(additionalClasses)) {
			additionalClasses = additionalClasses.join(' ');
		}
		ele.className += ' ' + additionalClasses;
	}
	
	if(typeof level == 'number' && level != 0) {
		ele.dataset.level = level;
	}
	
	chat.appendChild(ele);
	
	if(typeof noticeFadeDelay == 'number') {
		setTimeout(function() {
				ele.dataset.faded = '';
			}, noticeFadeDelay || 500);
	}
	
	return ele;
}
  
function handleWhisper(username, message) {
    console.log('whisper');
  var channel = 'drako_gaming';
  var chatting = username;
  var chan = dehash(channel),
      name = username,
      chatLine = document.createElement('div'),
      chatName = document.createElement('span'),
      chatColon = document.createElement('span'),
      chatMessage = document.createElement('span');

	var color = '#FFF';
  var glow = 'none';
	
	chatLine.className = 'chat-line';
	chatLine.dataset.username = name;
	
	chatName.className = 'chat-name';
	chatName.style.color = '#FFF';
	chatName.innerHTML = name + ' ► ' + Meteor.user().profile.display_name;
  chatMessage.innerHTML = message;
	
	chatColon.className = 'chat-colon';
	
	chatMessage.className = 'chat-message';
	
	chatLine.appendChild(chatName);
	chatLine.appendChild(chatColon);
	chatLine.appendChild(chatMessage);
	chatLine.style.backgroundColor = '#352645';
	chat.appendChild(chatLine);
	
	if(typeof fadeDelay == 'number') {
		setTimeout(function() {
				chatLine.dataset.faded = '';
			}, fadeDelay);
	}
	
	if(chat.children.length > 150) {
		var oldMessages = [].slice.call(chat.children).slice(0, 10);
		for(var i in oldMessages) oldMessages[i].remove();
	}
  var currentHeight = $('#chat').height();
  if(scrolledToBottom) {
  $('.scroll-content').animate({scrollTop: currentHeight});
  }
}  

var joinAccounced = [];

    whisperClient.on("whisper", handleWhisper);
    activeClient.on("connecting", function () {
      if(showConnectionNotices) chatNotice('Connecting...', 1000, -3, 'chat-connection-good-logon');
    });
    activeClient.on("logon", function () {
      if(showConnectionNotices) chatNotice('Authenticating: ' + chatUser, 1000, -3, 'chat-connection-good-logon');
    });
    activeClient.addListener('connectfail', function () {
      if(showConnectionNotices) chatNotice('Could not connect ' + chatUser, 1000, 3, 'chat-connection-bad-fail');
    });
    activeClient.on("connected", function (address, port) {
      if(showConnectionNotices) chatNotice(chatUser + ' Connected!', 1000, -2, 'chat-connection-good-connected');
      joinAccounced = [];
    });
    activeClient.on("disconnected", function (reason) {
      if(showConnectionNotices) chatNotice('Disconnected: ' + (reason || ''), 3000, 2, 'chat-connection-bad-disconnected');
    });
    activeClient.on("reconnect", function () {
      if(showConnectionNotices) chatNotice('Attempting Reconnect in 10 seconds...', 1000, 'chat-connection-good-reconnect');
    });

    activeClient.addListener('crash', function () {
      chatNotice('Crashed', 10000, 4, 'chat-crash');
    });

    activeClient.on('notice', function(channel, msgid, message){
      chatNotice(message, 1000, -4, 'chat-crash');
    });

    whisperClient.on('notice', function(channel, msgid, message){
      chatNotice(message, 1000, -4, 'chat-crash');
    });


	activeClient.connect();
  whisperClient.connect();

},
  handleWhisper: function handleWhisper(username, message) {
  var scrolledToBottom = true;
  if((($('#chat-wrapper').prop('scrollHeight') - $('#chat-wrapper').innerHeight()) - $('#chat-wrapper').scrollTop()) > 5) {
    scrolledToBottom = false;
  }
  var chat = document.getElementById('chat')
    console.log('whisper');
  var channel = 'drako_gaming';
  var chatting = username;
  var chan = dehash(channel),
      name = username,
      chatLine = document.createElement('div'),
      chatName = document.createElement('span'),
      chatColon = document.createElement('span'),
      chatMessage = document.createElement('span');

	var color = '#FFF';
  var glow = 'none';
	
	chatLine.className = 'chat-line';
	chatLine.dataset.username = name;
	
	chatName.className = 'chat-name';
	chatName.style.color = '#FFF';
	chatName.innerHTML = Meteor.user().profile.display_name + ' ► ' + name;
  chatMessage.innerHTML = message;
	
	chatColon.className = 'chat-colon';
	
	chatMessage.className = 'chat-message';
	
	chatLine.appendChild(chatName);
	chatLine.appendChild(chatColon);
	chatLine.appendChild(chatMessage);
	chatLine.style.backgroundColor = '#352645';
  var beforeScroll = $('#chat-wrapper').scrollTop();
	chat.appendChild(chatLine);
	
	if(typeof fadeDelay == 'number') {
		setTimeout(function() {
				chatLine.dataset.faded = '';
			}, fadeDelay);
	}
	
	if(chat.children.length > 150) {
		var oldMessages = [].slice.call(chat.children).slice(0, 10);
		for(var i in oldMessages) oldMessages[i].remove();
	}
    
  var currentHeight = $('#chat').height();
    if(scrolledToBottom) {
  $('#chat-wrapper').animate({scrollTop: currentHeight});
    }
}
}

Template.clrchat.onRendered(function() {
var target = this.find('#anonymous-blocker');
    TweenMax.to(target, .250, {opacity:0, onComplete:clrChatClient, delay: .250});
});

Template.customchat.onRendered(function() {
var target = this.find('#anonymous-blocker');
    TweenMax.to(target, .250, {opacity:0, onComplete:anonymousClient, delay: .250});
});


Template.authenticatedchat.onRendered(function() {
  var target = this.find('#authenticated-blocker');
    TweenMax.to(target, .250, {opacity:0, onComplete:authenticatedClient.init, delay: .250});
});

Template.anonymouschat.onRendered(function() {

});

Template.authenticatedchat.events({
  'input #messageInput': function (event, template) {
    if(event.currentTarget.value != ''){
      TweenMax.to('#chatSettingsSlideWrapper', .2, {x: -38, ease:'Linear'});
      $('#chatSettingsSlideWrapper').addClass('shifted');
    } else {
      TweenMax.to('#chatSettingsSlideWrapper', .2, {x: 0, ease:'Linear'});
      $('#chatSettingsSlideWrapper').removeClass('shifted');
    }
  },
  'keydown textarea': function(event) {
    var thisOne = event.currentTarget;
    if(!Session.get('acOpen')){
      if (event.keyCode == 13) {
        var chatInput = $('#messageInput');
        var chatMessage = chatInput.val();
        if(chatMessage) {
          addToHistory(_history, chatMessage);
          ReactiveLocalStorage('history', JSON.stringify(_history));
          ReactiveLocalStorage('historySet', JSON.stringify(_historySet));
          _histpos = _history.length;  
          if(nthWord(chatMessage, 1) == '/w'){
            var userToWhisper = nthWord(chatMessage, 2);
            var whisperContent = chatMessage.replace(/^([^ ]+ ){2}/, '');
            whisperClient.whisper(userToWhisper, whisperContent);
            authenticatedClient.handleWhisper(userToWhisper, whisperContent);
          } else if(nthWord(chatMessage, 1) == '/me') {
            var actionContent = chatMessage.replace(/^([^ ]+ ){1}/, '');
            activeClient.action('drako_gaming', actionContent);
          } else {
            activeClient.say('drako_gaming', chatMessage);
          }
          chatInput.val('');
          TweenMax.to('#chatSettingsSlideWrapper', .2, {x: 0, ease:'Linear'});
          $('#chatSettingsSlideWrapper').removeClass('shifted');
        }
        event.stopPropagation();
        return false;
      }
      // Clear command-line on Escape key.
      if (event.keyCode == 27) {
        thisOne.value = '';
        event.stopPropagation();
        event.preventDefault();
      }

      if (_history.length && (event.keyCode == 38 || event.keyCode == 40)) {
        if (_history[_histpos]) {
          _history[_histpos] = thisOne.value;
        }
        else {
          _histtemp = thisOne.value;
        }

        if (event.keyCode == 38) {
          // Up arrow key.
          _histpos--;
          if (_histpos < 0) {
            _histpos = 0;
          }
        }
        else if (event.keyCode == 40) {
          // Down arrow key.
          _histpos++;
          if (_histpos > _history.length) {
            _histpos = _history.length;
          }
        }

        thisOne.value = _history[_histpos] ? _history[_histpos] : _histtemp;

        // Move cursor to end of input.
        thisOne.value = thisOne.value;
      }
    }
  },
  'click #sendActiveButton': function(event) {
      var chatInput = $('#messageInput');
      var chatMessage = chatInput.val();
      if(chatMessage) {
        addToHistory(_history, chatMessage);
        ReactiveLocalStorage('history', JSON.stringify(_history));
        ReactiveLocalStorage('historySet', JSON.stringify(_historySet));
        _histpos = _history.length;
        if(nthWord(chatMessage, 1) == '/w'){
          var userToWhisper = nthWord(chatMessage, 2);
          var whisperContent = chatMessage.replace(/^([^ ]+ ){2}/, '');
          whisperClient.whisper(userToWhisper, whisperContent);
          authenticatedClient.handleWhisper(userToWhisper, whisperContent);
        } else if(nthWord(chatMessage, 1) == '/me') {
          var actionContent = chatMessage.replace(/^([^ ]+ ){1}/, '');
          activeClient.action('drako_gaming', actionContent);
        } else {
          activeClient.say('drako_gaming', chatMessage);
        }
        chatInput.val('');
        TweenMax.to('#chatSettingsSlideWrapper', .2, {x: 0, ease:'Linear'});
      $('#chatSettingsSlideWrapper').removeClass('shifted');
      }
      return false;
  },
    'click #emoteButtonWrapper': function(event) {
    var wrapper = $('#emoteBoxWrapper');
      if(wrapper.hasClass('open')){
        TweenMax.to(wrapper, .5, { autoAlpha: 0, display: 'none'});
        wrapper.removeClass('open');
      } else {
        TweenMax.to(wrapper, .5, { autoAlpha: 1, display: 'block'});
        wrapper.addClass('open');
      }
    },
  'click #chatSettingsActiveButton': function(event) {
    var wrapper = $('#settingsBoxWrapper');
      if(wrapper.hasClass('open')){
        TweenMax.to(wrapper, .2, { autoAlpha: 0, display: 'none'});
        wrapper.removeClass('open');
      } else {
        TweenMax.to(wrapper, .2, { autoAlpha: 1, display: 'block'});
        wrapper.addClass('open');
      }
    }
});

Template.emoteItem.events({
  'click': function(event) {
    var emoteCode = this.keyword;
    var chatInput = $('#messageInput');
      var currentText = chatInput.val();
      if(currentText == ''){
        chatInput.val(emoteCode + ' ');
      } else {
        chatInput.val(currentText + ' ' + emoteCode);
      }
      chatInput.focus();
    TweenMax.to('#chatSettingsSlideWrapper', .2, {x: -38, ease:'Linear'});
      $('#chatSettingsSlideWrapper').addClass('shifted');
    }
  });

Template.emoteBox.helpers({
  emotes: function() {
    return Emotes.find({approved: true});
  }
});

Template.settingsBox.events({
  'change input[type="checkbox"]': function (event, template) {
    var type = event.currentTarget.id;
    if(event.currentTarget.checked){
      ReactiveLocalStorage(type, true);
    } else {
      ReactiveLocalStorage(type, false);
    }
  },
  'change textarea': function(event) {
    if(!event.currentTarget.value) {
      ReactiveLocalStorage.removeItem('highlightChat');
    } else {
      var list = JSON.stringify(event.currentTarget.value.split(' '));
      ReactiveLocalStorage('highlightChat', list);
    }
  },
  'click #theaterMode': function(event){
    var wrapper = $('#settingsBoxWrapper');
      if(wrapper.hasClass('open')){
        TweenMax.to(wrapper, .2, { autoAlpha: 0, display: 'none'});
        wrapper.removeClass('open');
      } else {
        TweenMax.to(wrapper, .2, { autoAlpha: 1, display: 'block'});
        wrapper.addClass('open');
      }
    if(Session.get('theaterMode')){
      TweenMax.to('.vEmbed', .5, {opacity: 0, onComplete: disableTheater});
      $(event.target).text('Theater Mode [off]');
    }
    else {
      TweenMax.to('.underVid', .5, {display: 'none', autoAlpha: 0});
      TweenMax.to('.vEmbed', .5, {opacity: 0, onComplete: enableTheater});
      $(event.target).text('Theater Mode [on]');
    }
  }
});

Template.settingsBox.helpers({
  getValue: function(){
    if(ReactiveLocalStorage('highlightChat')) {
      var list = JSON.parse(ReactiveLocalStorage('highlightChat')).join(' ');
      return list;
      } else {
        return '';
      }
  },
  checked: function(thisBox) {
    if(ReactiveLocalStorage(thisBox)) {
      if(thisBox == 'timestampHide'){
        $('span.chat-time').addClass('hide-time');
      } 
      return 'checked';
    } else 
      if(thisBox == 'timestampHide'){
        $('span.chat-time').removeClass('hide-time');
        var currentHeight = $('#chat-wrapper').prop('scrollHeight');
        $('#chat-wrapper').scrollTop(currentHeight);
      }
    return '';
  }
});