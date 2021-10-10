(function(){    
var whereAmI = process.env.WHEREAMI;
var twitchClientId = process.env.TWCLIENTID;
var twitchSecret = process.env.TWSECRET;
var twitchClientIdPersistent = process.env.TWCLIENTIDPERSIST;
var twitchSecretPersistent = process.env.TWSECRETPERSIST;
if (typeof(whereAmI) !== 'undefined') {
Meteor.users.update({name: 'thetamax'}, {$set: {isAdmin: true}});
//Development:      
ServiceConfiguration.configurations.upsert(
  { service: "twitch" },
  {
    $set: {
      clientId: twitchClientToken,
      loginStyle: "popup",
      secret: twitchSecret
    }
  }
);
  
  } else {
        //Production:
        ServiceConfiguration.configurations.upsert(
      { service: "twitch" },
      {
        $set: {
        clientId: twitchClientToken
        loginStyle: "popup",            
        secret: twitchSecret
        }
      }
    );
  }
 
       
      
            
})();

    Accounts.onCreateUser(function(options, user) {
      user.rank = 'Journeyman';
        if (user.services) {
            var service = _.keys(user.services)[0];
            var nameExist = user.services[service].name;
 
            if (service == 'twitch') {
              user.display_name = user.services.twitch.display_name;
              user.level = 1;
              user.name = user.services.twitch.name;
              user.profile = options.profile || {};
              user.profile.display_name= user.services.twitch.display_name;
              try {
                console.log('checking sub status');
                 var result = HTTP.call("GET", 'https://api.twitch.tv/kraken/channels/drako_gaming/subscriptions/' + user.name + '?oauth_token=' + twitchSecretPersistent + '&client_id=' + twitchClientIdPersistent);
                 user.subbed = true;
                 console.log(user.name + ' is a sub!');
                  } catch (e) {
                   user.subbed = false;
                   console.log(user.name + ' is not a sub :\'(');
                  }
         
            }
 
            if (!nameExist)
                return user;
 
            // see if any existing user has this email address, otherwise create new
            var existingUser = Meteor.users.findOne({'name': nameExist});
            if (!existingUser)
                return user;
 
            // precaution, these will exist from accounts-password if used
            if (!existingUser.services)
                existingUser.services = { resume: { loginTokens: [] }};
            if (!existingUser.services.resume)
                existingUser.services.resume = { loginTokens: [] };
 
            // copy accross new service info
            existingUser.services[service] = user.services[service];
            existingUser.profile = user.profile;
            existingUser.subbed = user.subbed;
            existingUser.display_name = user.display_name;
            // give starter bundle
            var theItem = 'suspicious-loot'
            var theUserId = existingUser._id;
            var goods = Items.findOne({slug: theItem});
            var itemSlug = theItem;
            var singleDetails = {
                userId: theUserId,
                title: goods.title,
                slug: goods.slug,
                description: goods.description,
                image: goods.image,
                type: goods.type,
                stacked: false,
                craftable: goods.craftable,
                essential: goods.essential,
                qty: 1,
                createdAt: new Date(), // current time
                origin: 'automatically given on create'
              };
              Tempinv.insert(singleDetails);
            // even worse hackery
            Meteor.users.remove({_id: existingUser._id}); // remove existing record
            return existingUser;                          // record is re-inserted
        }
    });

Hooks.onCreateUser = function (userId) {
  // give starter bundle
            var theItem = 'suspicious-loot';
            var goods = Items.findOne({slug: theItem});
            var itemSlug = theItem;
            var singleDetails = {
                userId: userId,
                title: goods.title,
                slug: goods.slug,
                description: goods.description,
                image: goods.image,
                type: goods.type,
                stacked: false,
                craftable: goods.craftable,
                essential: goods.essential,
                qty: 1,
                createdAt: new Date(), // current time
                origin: 'automatically given on create'
              };
              Tempinv.insert(singleDetails);
}
