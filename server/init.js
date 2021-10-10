Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/.uploads/tmp',
    uploadDir: process.env.PWD + '/.uploads/',
    checkCreateDirectories: true,
    getFileName: function(fileInfo, formData) { return Random.id(6) + '-' + fileInfo.name; },
    finished: function(fileInfo, formFields) {
      // perform a disk operation
    },
    cacheTime: 100,
    mimeTypes: {
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "gif": "image/gif"
    }
  })
});

Meteor.startup(function () {
  MeteorSettings.setDefaults({
    AWSAccessKeyId: process.env.AWSKEYID,
    AWSSecretAccessKey: process.env.AWSACCESSKEY
  });
});

 Meteor.startup(function () {
   var emailAcc = process.env.EMAILACC;
   var emailPass = process.env.EMAILPASS;
   var emailServer = process.env.EMAILSERVER;
   var emailServerPort = process.env.EMAILPORT;
    process.env.MAIL_URL = 'smtp://' + emailAcc + ':' + emailPass + '@' + emailServer + ':' + emailServerPort;
    Tempinv._ensureIndex({ "userId": 1});
    Buffs._ensureIndex({ "userId": 1});
    RaffleEntries._ensureIndex({ "userId": 1, "raffleId" : 1});
    Buffs._ensureIndex({ "buffId": 1});
    Items._ensureIndex({ "slug": 1 });
    Chatcolor._ensureIndex({ "name": 1 });
    Chatglow._ensureIndex({ "name": 1 });
    Meteor.users._ensureIndex({ "name": 1});
    SyncedCron.config({
    // Log job run details to console
    log: true,

    // Use a custom logger function (defaults to Meteor's logging package)
    logger: null,

    // Name of collection to use for synchronisation and logging
    collectionName: 'cronHistory',

    // Default to using localTime
    utc: false,

    /*
      TTL in seconds for history records in collection to expire
      NOTE: Unset to remove expiry but ensure you remove the index from
      mongo by hand

      ALSO: SyncedCron can't use the `_ensureIndex` command to modify
      the TTL index. The best way to modify the default value of
      `collectionTTL` is to remove the index by hand (in the mongo shell
      run `db.cronHistory.dropIndex({startedAt: 1})`) and re-run your
      project. SyncedCron will recreate the index with the updated TTL.
    */
    collectionTTL: 192800
  });
    SyncedCron.start();
    hostMode_status = 'off';
   if (!Emotes.find().count()) {
     Emotes.upsert({keyword: 'drakoH'}, {$set: {image: 'http://static-cdn.jtvnw.net/emoticons/v1/54996/2.0', approved: true, type: 'channel', sortOrder: 0, createdAt: new Date()}});
     Emotes.upsert({keyword: 'drakoTrip'}, {$set: { image: 'http://static-cdn.jtvnw.net/emoticons/v1/54691/2.0', approved: true, type: 'channel', sortOrder: 1, createdAt: new Date()}});
     Emotes.upsert({keyword: 'drakoMower'}, {$set: { image: 'http://static-cdn.jtvnw.net/emoticons/v1/32760/2.0', approved: true, type: 'channel', sortOrder: 2, createdAt: new Date()}});
     Emotes.upsert({keyword: 'drakoDed'}, {$set: { image: 'http://static-cdn.jtvnw.net/emoticons/v1/30156/2.0', approved: true, type: 'channel', sortOrder: 3, createdAt: new Date()}});
     Emotes.upsert({keyword: 'drakoPalm'}, {$set: { image: 'http://static-cdn.jtvnw.net/emoticons/v1/16777/2.0', approved: true, type: 'channel', sortOrder: 4, createdAt: new Date()}});
     Emotes.upsert({keyword: 'drakoAxe'}, {$set: { image: 'http://static-cdn.jtvnw.net/emoticons/v1/17051/2.0', approved: true, type: 'channel', sortOrder: 5, createdAt: new Date()}});
     Emotes.upsert({keyword: 'drakoCool'}, {$set: { image: 'http://static-cdn.jtvnw.net/emoticons/v1/19802/2.0', approved: true, type: 'channel', sortOrder: 6, createdAt: new Date()}});
     Emotes.upsert({keyword: 'drakoChest'}, {$set: { image: 'http://static-cdn.jtvnw.net/emoticons/v1/25818/2.0', approved: true, type: 'channel', sortOrder: 7, createdAt: new Date()}});
     Emotes.upsert({keyword: 'drakoGasp'}, {$set: { image: 'http://cdn.betterttv.net/emote/5589cf7e33879a376a1bc2e5/2x', approved: true, type: 'bttv', sortOrder: 8, createdAt: new Date()}});
     Emotes.upsert({keyword: 'drakoSad'}, {$set: { image: 'http://cdn.betterttv.net/emote/563d2eb955dee26813aebfc3/2x', approved: true, type: 'bttv', sortOrder: 9, createdAt: new Date()}});
     Emotes.upsert({keyword: 'drakoSassy'}, {$set: { image: 'http://cdn.betterttv.net/emote/5589cfd833879a376a1bc2e7/2x', approved: true, type: 'bttv', sortOrder: 10, createdAt: new Date()}});
     Emotes.upsert({keyword: 'drakoT'}, {$set: { image: 'http://cdn.betterttv.net/emote/562446a23f1298b32bd38777/2x', approved: true, type: 'bttv', sortOrder: 11, createdAt: new Date()}});
     Emotes.upsert({keyword: 'drakoBoy'}, {$set: { image: 'http://cdn.betterttv.net/emote/55865cb633879a376a1bc0c0/2x', approved: true, type: 'bttv', sortOrder: 12, createdAt: new Date()}});
   }
 });
  
    Meteor.publish("inventory", function () {
        if (this.userId) {
      return Tempinv.find({userId: this.userId});
            } else {
          this.ready();
  }
  });
  
  Meteor.publish("activeBuffs", function () {
        if (this.userId) {
      return Buffs.find({userId: this.userId});
            } else {
          this.ready();
  }
  });

  Meteor.publish("emotes", function () {
      return Emotes.find({});
  });

  Meteor.publish("userData", function () {
      return Meteor.users.find({_id: this.userId}, {fields: {exp: 1, currency: 1, subbed: 1, name: 1, display_name: 1, isAdmin: 1, isMod: 1, level: 1, rank: 1, path: 1, services: 1, badges: 1, activeBuffs: 1, settings: 1}});
  });

Meteor.publish('leaderBoard', function () {
  var self = this;
  var handle = Meteor.users.find({}, {sort: {currency: -1}, limit: 10}, {fields: {name: 1, currency: 1}}).observeChanges({
    added: function (id, fields) {
      var zfields = {};
      zfields.name = fields.name;
      zfields.currency = fields.currency;
      self.added('leaders', id, zfields);
    },
    changed: function (id, fields) {
      var zfields = {};
      zfields.currency = fields.currency;
      self.changed('leaders', id, zfields);
    },
    removed: function (id) {
      self.removed('leaders', id);
    }
  });

  self.ready();

  self.onStop(function () {
    handle.stop();
  });

});

    Meteor.publish('stream', function() {
  // Example of using a filter to publish only "online" users:
  return Stream.find({});
});
  
      Meteor.publish('hostMode', function() {
  // Example of using a filter to publish only "online" users:
  return Hosts.find({}, {sort: {createdAt: -1}, limit: 1});
});
  
      Meteor.publish('shopItems', function() {
  // Example of using a filter to publish only "online" users:
  return Items.find({shopItem: true}, {sort: {'gravity': 1}});
});

      Meteor.publish('chatColor', function() {
  // Example of using a filter to publish only "online" users:
  return Chatcolor.find({});
});

      Meteor.publish('chatGlow', function() {
  // Example of using a filter to publish only "online" users:
  return Chatglow.find({});
});

      Meteor.publish('donations', function() {
  // Example of using a filter to publish only "online" users:
  return Donations.find({});
});

      Meteor.publish('chatUsers', function() {
  // Example of using a filter to publish only "online" users:
  return ChatUsers.find({});
});
  
Meteor.publish('availableItems', function() {
  // Example of using a filter to publish only "online" users:
  if(this.userId) {
  return Items.find({});
     } else {
    this.ready();
  }
});
      
 Meteor.publish("betrounds", function () {
    return Rounds.find({}, {sort: {createdAt: -1}, limit: 1}, {fields: { options: {'$elemMatch': {optionBets: 0}}}});
  });
  
   Meteor.publish("rafflerounds", function () {
    return Raffles.find({}, {sort: {createdAt: -1}, limit: 1}, {fields: { prize: 1, cost: 1, raffleEntries: 1, staged: 1, live: 1, results: 1, hasResults: 1 }});
  });
  
   Meteor.publish("poll", function () {
    return Polls.find({}, {sort: {createdAt: -1}, limit: 1});
  });
  
    Meteor.publish("Rentries", function () {
        if (this.userId) {
        var currentRaffle = Raffles.findOne({ staged: true }, {sort: {createdAt: -1}, limit: 1});
          if (currentRaffle){
            var currentRaffleId = currentRaffle._id;
      return RaffleEntries.find({userId: this.userId, raffleId: currentRaffleId}, {fields: { raffleId: 1 }});
          } else {
            this.ready();
          }
            } else {
          this.ready();
  }
  });

