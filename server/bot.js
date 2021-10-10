function sayChallenge(msg){
      client.say('drako_gaming', msg);
}

throttledChallenge = _.throttle(sayChallenge, 60000, { trailing: false });

function sayThrottle(msg){
      client.say('drako_gaming', msg);
}

throttledSay = _.throttle(sayThrottle, 5000, { trailing: false });

function hostMode(channel, target){
  var result = HTTP.get("https://api.twitch.tv/kraken/streams/" + target + "?client_id=" + process.env.BOTCLIENTID);
  var results = result.data;
  hostMode_status = 'on';
    if(results.stream !== null && results.stream !== undefined) {
      
      var channelResult = HTTP.get("https://api.twitch.tv/kraken/channels/" + target + "?client_id=" + process.env.BOTCLIENTID);
      var channelResults = channelResult.data;
      var targetName = channelResults.display_name;
      client.say(channel, 'Drako is now hosting ' + targetName + '. Feel free to enjoy the show from here, or hop over to their channel at http://twitch.tv/' + targetName + ' to join in with their chat!');
      var livestreamTitle = targetName + ': ' + results.stream.channel.status;
      var livestreamViewers = results.stream.viewers;
      var livestreamStarted = results.stream.created_at;
      var livestreamGame = results.stream.game;
      var livestreamFollows = results.stream.channel.followers;
      var livestreamViews = results.stream.channel.views;
      Hosts.update({target: target}, {$set: {
        target: target,
        displayName: targetName,
        streamURL: 'http://twitch.tv/' + target + '/embed',
        streamLink: 'http://twitch.tv/' + target,
        live: true, 
        viewers: livestreamViewers, 
        title: livestreamTitle, 
        game: livestreamGame, 
        started: livestreamStarted, 
        views: livestreamViews, 
        follows: livestreamFollows,
        createdAt: new Date() // current time
      }}, {upsert: true});
    } else {
    }
}

throttledHostMode = _.throttle(hostMode, 5000, { trailing: false });

irc = Meteor.npmRequire('twitch-irc');

var clientOptions = {
    options: {
        debug: true,
        debugIgnore: ['ping', 'chat', 'action']
    },
    identity: {
        username: process.env.BOTUSERNAME,
        password: 'oauth:' + process.env.BOTCHATAUTHTOKEN
    },
    channels: ['drako_gaming']
}
client = new irc.client(clientOptions);
if (!('contains' in String.prototype)) {
  String.prototype.contains = function(str, startIndex) {
    return ''.indexOf.call(this, str, startIndex) !== -1;
  };
}

client.connect();

client.addListener('chat', Meteor.bindEnvironment(function (channel, user, message) {
  if(message.contains('!checkIn') && user.username == ('thetamax' || 'drako_gaming')) {
      throttledSay('Main server connected');
   }
  if(message.contains('!cc') && user.username == 'thetamax') {
    client.color(channel, 'Coral');
    client.say(channel, ':D');
  }
}));

client.addListener('hosting', Meteor.bindEnvironment(function (channel, target, viewers) {
  throttledHostMode(channel, target);
  console.log('Drako is now hosting ' + target);
}));

client.addListener('unhost', Meteor.bindEnvironment(function (channel, viewers) {
  Hosts.remove({});
  console.log('Drako is no longer hosting.');
}));
