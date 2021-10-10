Meteor.methods({
   // Drako Draws
    reqDrawing: function(message) {
    check([message], [String]);
    this.unblock();
    if (! Meteor.user() ) {
      throw new Meteor.Error("not-authorized");
    } else {
      theUser = Meteor.user().display_name;
      var text = message;
      if(message == 'defaultResponse'){
        text = 'the first thing that comes to mind when you think of me.';
      }
      Email.send({
      to: 'drakostreaming@gmail.com',
      from: 'drakowebsite@gmail.com',
      subject: theUser + ' wants you to draw something!',
      text: 'Dear Drako,\n\nPlease draw ' + text + '\n\nSincerely,\n\n' + theUser
    });
      return 'success';
    }
  },
  saveColor: function(chosenHue) {
    check([chosenHue], [Number]);
    this.unblock();
    if (! Meteor.user() ) {
      throw new Meteor.Error("not-authorized");
    } else {
      theUser = Meteor.user().name;
      chosenHue = chosenHue.toString();
      var colorToSave = 'hsla(' + chosenHue + ', 88%, 60%, 1)';
      Chatcolor.upsert({name: theUser}, {$set: {color: colorToSave}});
      return 'success';
    }
  },
  saveGlow: function(chosenHue) {
    check([chosenHue], [Number]);
    this.unblock();
    if (! Meteor.user() ) {
      throw new Meteor.Error("not-authorized");
    } else {
      theUser = Meteor.user().name;
      chosenHue = chosenHue.toString();
      var currentTime = new Date();
      var expireTime = 14;
      var rightMeow = moment(currentTime).add(expireTime, 'days').toISOString();
      var glowToSave = 'rgb(0,0,0) 0px 0px 4px,hsla(' + chosenHue + ', 75%, 85%, 1) 0px 0px 4px, hsla(' + chosenHue + ',60%,50%,1) 0px 0px 10px, hsla(' + chosenHue + ', 60%, 50%, 1) 0px 0px 10px, hsla(' + chosenHue + ', 60%, 50%, 1) 0px 0px 10px';
      Chatglow.upsert({name: theUser}, {$set: {glow: glowToSave, expires: new Date(rightMeow)}});
      return 'success';
    }
  },
  
  
  // PROFILE SETTINGS
  
  setHostMode: function(set) {
    var passed = 'disabled';
    if (set){
      passed = 'enabled'
    } else {
      passed= 'disabled'
    }
    Meteor.users.update({_id: this.userId}, {$set: {settings: {hostMode: passed}}});
  },
    manualHost: function(streamURL, target, targetName, streamTitle, streamLink, streamViewers) {
       if (! Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
      var livestreamTitle = streamTitle;
      Hosts.update({target: target}, {$set: {
        target: target,
        streamLink: streamLink,
        displayName: targetName,
        streamURL: streamURL,
        live: true, 
        viewers: streamViewers, 
        title: livestreamTitle, 
        createdAt: new Date() // current time
      }}, {upsert: true});
    }
  },
  manualUnhost: function() {
     if (! Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
    Hosts.remove({});
    }
  },
////////////////////////////////////////////
// BETTING: USER
////////////////////////////////////////////
  
  placeBet: function (roundID, selectedOption, betAmount) {
    if (Meteor.user().banned) {
      throw new Meteor.Error("banned");
    }
    if (!Meteor.user().exp) {
      throw new Meteor.Error("banned");
    }
    // Make sure the user is logged in before inserting a task
    var ipAddress = this.connection.clientAddress;
    var betMaker = Meteor.user().name;
    var gamblerById = Meteor.userId();
    var gamblerByName = Meteor.user().name;
    var gamblerByDisplayName = Meteor.user().display_name;
    var theBet = {
      wagerId: Random.id(),
      gamblerId: gamblerById,
      gamblerName: gamblerByName,
      gamblerDisplayName: gamblerByDisplayName,
      wager: betAmount,
      createdAt: new Date()
    }; 
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    if (Meteor.user().currency < betAmount) {
      throw new Meteor.Error("exceeds-balance");
    } else if (betAmount < 1){
      throw new Meteor.Error("negative-bet");
    } else if (isNaN(betAmount)){
      throw new Meteor.Error("betIsNaN");
    } else {
      var thisRound = Rounds.findOne({_id: roundID}, {fields: {gamblers: 1, live: 1}});
      if(!thisRound.live) {
        console.log('ALERT: ' + betMaker + ' tried placed a bet: ' + betAmount + ' on round ' + roundID + ' from IP ' + ipAddress + ' after the betting period closed');
        throw new Meteor.Error("bet-rejected");
      }
      if(_.contains(thisRound.gamblers, Meteor.userId())) {
         throw new Meteor.Error("already-bet");
       } else {
      var thisGambler = Meteor.userId();
      var negBet = betAmount - (betAmount*2);
      Meteor.users.update({_id: thisGambler}, {$inc: {currency: negBet}});
      console.log(betMaker + ' placed a bet: ' + betAmount + ' on round ' + roundID + ' from IP ' + ipAddress);
      Rounds.update({_id: roundID, 'options.optionId': selectedOption}, {$inc : {'roundPool': betAmount, 'options.$.optionPool': betAmount, 'options.$.optionBetCount' : 1}, $push: {'options.$.optionBets': theBet, 'gamblers': thisGambler}});
      }
    }
   },
////////////////////////////////////////////
// ADMIN FUNCTIONS
////////////////////////////////////////////
  
  //Give user currency
  giveCurrency: function(theUser, amount) {
    if (! Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
      Meteor.users.update({name: theUser}, {$inc: {currency: amount}});
    }
  },
    //Take user currency
  takeCurrency: function(theUser, amount) {
    if (! Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
      var subtract = amount - (amount*2);
      Meteor.users.update({name: theUser}, {$inc: {currency: subtract}});
    }
  },
  
////////////////////////////////////////////
// BETTING: ADMIN
////////////////////////////////////////////
  
  //BEGIN AWARD WINNERS
  insertRound: function($challenge, $options) {
    if (! Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
      Rounds.insert({
        text: 'Get your bets in!',
        challenge: $challenge,
        options: $options,
        gamblers: [],
        roundBets: 0,
        roundPool: 0,
        staged: true,
        live: true,
        hasResults: false,
        results: [],
        createdAt: new Date() // current time
      });
    }
    client.say('drako_gaming', '!betting is now open!');
  },
  closeRound: function(theRound) {
    if (! Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
    Rounds.update(theRound, {$set : {live: false}});
      console.log('Betting has been closed');
      client.say('drako_gaming', 'Betting is now closed, good luck to everyone who joined in this round!');
    }
  },
  awardWinners: function (roundID, optionID) {
      if (! Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
    var winnersList = [];
    var roundArr = Rounds.find({_id: roundID}).fetch();
    var round = roundArr[0];
    var winningOption = _.findWhere(round.options, {optionId: optionID});
    var theAnswer = winningOption.optionText;
    console.log('the answer was: ' + theAnswer);
    Rounds.update({_id: roundID, hasResults: false}, {$set: {staged: false, correctAnswer: theAnswer, hasResults: true}});
    var roundTotal = round.roundPool;
    var optionTotal = winningOption.optionPool;
    var optionCount = winningOption.optionBetCount;
    var winners = winningOption.optionBets;
        for (var i=winners.length-1; i>=0; i--) {
         var theUser = winners[i].gamblerId;
         var theUserName = winners[i].gamblerName;
         var theDisplayName = winners[i].gamblerDisplayName;
         var theWager = winners[i].wager;
         var wagerWeight = theWager / optionTotal;
         var winnings = Math.ceil(wagerWeight * roundTotal);
      Meteor.users.update({_id: theUser}, {$inc: {currency: winnings}});
         var winRecord = {
           name: theUserName,
           displayName: theDisplayName,
           wagered: theWager,
           wonAmount: winnings - theWager
         };
          Rounds.update({_id: roundID}, {$push: {results: winRecord}});
          winnersList.push(winRecord);
    }
      var sortedWinners = _.sortBy(winnersList, 'wonAmount').reverse();
      client.say('drako_gaming', 'drakoChest drakoChest drakoChest CHA-CHING! The winning option was: "' + theAnswer + '". Paid out a total of ' + roundTotal + ' scales to ' + optionCount + ' users. This round\'s big winner is ' + sortedWinners[0].displayName + ', pulling in ' + sortedWinners[0].wonAmount + ' scales! Stay tuned for the next round.');
  }
},
  //END AWARD WINNERS
  ///////////////////
  //BEGIN REVOKE ROUND
  revokeRound: function (roundID, optionID) {
      if (! Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    }
    var roundArr = Rounds.find({_id: roundID}).fetch();
    var round = roundArr[0];
    var winningOption = _.findWhere(round.options, {optionId: optionID});
    var theAnswer = 'ROUND REVOKED. REFUNDS ISSUED.';
    console.log('the answer was: ' + theAnswer);
    Rounds.update({_id: roundID}, {$set: {staged: false, correctAnswer: theAnswer, hasResults: true}});
    var roundTotal = round.roundPool;
    var optionTotal = winningOption.optionPool;
    var winners = winningOption.optionBets;
        for (var i=winners.length-1; i>=0; i--) {
         var theUser = winners[i].gamblerId;
         var theUserName = winners[i].gamblerName;
         var theWager = winners[i].wager;
        // var wagerWeight = theWager / optionTotal;
       //  var winnings = Math.ceil(wagerWeight * roundTotal);
      Meteor.users.update({_id: theUser}, {$inc: {currency: theWager}});
         var winRecord = {
           name: theUserName,
           wagered: theWager,
           wonAmount: theWager
         };
          Rounds.update({_id: roundID}, {$push: {results: winRecord}});
    }
},
  //END REVOKE ROUND
  
  //////////////////////
  // Polls
  /////////////////////
    placeVote: function (pollID, selectedOption) {
    this.unblock();
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
      if (Meteor.user().currency >= 5) {
    var thisVoter = Meteor.userId();
    Meteor.users.update({_id: thisVoter}, {$inc: {currency: -5}});
    Polls.update({_id: pollID, 'options.optionId': selectedOption}, {$inc : {'pollVotes': 1, 'options.$.optionVotes': 1}, $push: {'voters': thisVoter}});
        }
    },
  insertPoll: function($challenge, $options) {
    if (! Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
        Polls.insert({
        challenge: $challenge,
        options: $options,
        voters: [],
        pollVotes: 0,
        staged: true,
        live: true,
        hasResults: false,
        createdAt: new Date() // current time
      });
    }
  },
  closePoll: function(thePoll) {
    if (! Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
      Polls.update(thePoll, {$set : {live: false}});
    }
  },
  setPath: function(thePath) {
    if(thePath !== '') {
      Meteor.users.update({_id: this.userId}, {$set: {rank: 'Adept', path: thePath}});
      var uName = Meteor.user().display_name;
      em.emit('streamEvent', {
      type: 'path',
      user: uName,
      chosenPath: thePath 
    });
    } else {
      throw new Meteor.Error("path-already-set");
    }
  },
//////////////////////////////////////////////
// Item/Inventory Related
//////////////////////////////////////////////
craftItem: function(theItems, itemList) {
this.unblock();
console.log(theItems); 
var item = crafty.craft(theItems);
console.log(item);   
console.log(Meteor.user().name + 'is attempting to craft ' + item.give[0] + '!');
    var theItem = item.give[0];
    var theUser = Meteor.user();
    var theUserId = theUser._id;
    var theUserName = Meteor.user().name;
    var goods = Items.findOne({slug: theItem, craftable: true});
      if (!goods) {
      throw new Meteor.Error("item-cannot-be-crafted");
    } else {
    var itemSlug = goods.slug;
    // Throw Error if user cannot afford

      // User can afford, let's move on
      
      //Deliver the item
      if(goods.stacked) {
        var stackDetails = {
          title: goods.title,
          description: goods.description,
          modalSlug: goods.modalSlug,
          image: goods.image,
          type: goods.type,
          stacked: true,
          craftable: goods.craftable,
          essential: goods.essential,
          origin: 'crafted'
        };
        Tempinv.update({userId: theUserId, slug: itemSlug}, {$set: stackDetails, $inc: {qty: 1}}, {upsert: true});
        _.each(itemList, function(ingredient){
          if(ingredient.itemQty > 1){
          Tempinv.update({_id: ingredient.itemId}, {$inc: {qty: -1}});  
          } else {
          Tempinv.remove({userId: theUserId, _id: ingredient.itemId});
          }
        });
      } else {
        var singleDetails = {
          userId: theUserId,
          title: goods.title,
          slug: goods.slug,
          modalSlug: goods.modalSlug,
          description: goods.description,
          image: goods.image,
          type: goods.type,
          stacked: false,
          craftable: goods.craftable,
          essential: goods.essential,
          qty: 1,
          origin: 'crafted'
        }
        Tempinv.insert(singleDetails);
        _.each(itemList, function(ingredient){
          console.log(ingredient.itemQty + ' : ' + ingredient.itemId);
          if(ingredient.itemQty >= 2){
          Tempinv.update({_id: ingredient.itemId}, {$inc: {qty: -1}});  
          } else {
          Tempinv.remove({userId: theUserId, _id: ingredient.itemId});
          }
        });
        
      }
    }
  return 'crafting complete';
  },
    addInventory: function(theSlug, theClass, theQty) {
    if (! Meteor.user() ) {
      throw new Meteor.Error("not-authorized");
    } else {
        var thisUser = Meteor.userId();
        Tempinv.insert({
        userId: thisUser,
        slug: theSlug,
        itemClass: theClass,
        qty: theQty,
        createdAt: new Date() // current time
      });
    }
  },
  addNewItem: function(itemDetails) {
     if (! Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
      Items.insert(itemDetails);
    }
  },
  addItemImage: function(s3Url){
    ItemImages.insert({url: s3Url});
  },
  removeInventory: function() {
      var lastItem = Tempinv.findOne({userId: this.userId}, {sort: {createdAt: -1}});
      Tempinv.remove(lastItem._id);
  },
  giveEveryone: function(theItem) {
    this.unblock();
    if (!Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
        var allUsers = Meteor.users.find({subbed: {$exists: true}}).fetch();
        var theList = _.pluck(allUsers, '_id'); 
        for (i = 0; i < theList.length; i++) { 
          var theUserId = theList[i];
          var goods = Items.findOne({slug: theItem});
          var itemSlug = theItem;
      //Charge the user

      //Deliver the item
      if(goods.stacked) {
        var stackDetails = {
          title: goods.title,
          description: goods.description,
          image: goods.image,
          type: goods.type,
          stacked: true,
          craftable: goods.craftable,
          essential: goods.essential,
          createdAt: new Date(), // current time
          origin: 'given by admin'
        };
        Tempinv.update({userId: theUserId, slug: itemSlug}, {$set: stackDetails, $inc: {qty: 1}}, {upsert: true});
      } else {
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
          origin: 'given by admin'
        }
        Tempinv.insert(singleDetails);
      }
        }
      return 'items given';
    }
  },
  ///////
  giveItem: function(theItem, theUser) {
    this.unblock();
    if (! Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
    var thisUser = Meteor.users.findOne({name: theUser});
    var theUserId = thisUser._id;
    var theUserName = theUser;
    var goods = Items.findOne({slug: theItem});
    var itemSlug = theItem;
      //Charge the user
      
      //Deliver the item
      if(goods.stacked) {
        var stackDetails = {
          title: goods.title,
          modalSlug: goods.modalSlug,
          description: goods.description,
          image: goods.image,
          type: goods.type,
          stacked: true,
          craftable: goods.craftable,
          essential: goods.essential,
          createdAt: new Date(), // current time
          origin: 'given by admin'
        };
        Tempinv.update({userId: theUserId, slug: itemSlug}, {$set: stackDetails, $inc: {qty: 1}}, {upsert: true});
        return 'items given'
      } else {
        var singleDetails = {
          userId: theUserId,
          title: goods.title,
          slug: goods.slug,
          modalSlug: goods.modalSlug,
          description: goods.description,
          image: goods.image,
          type: goods.type,
          stacked: false,
          craftable: goods.craftable,
          essential: goods.essential,
          qty: 1,
          createdAt: new Date(), // current time
          origin: 'given by admin'
        }
        Tempinv.insert(singleDetails);
        return 'items given';
      }
    }
  },
  
  ///////
  purchaseItem: function(theItem) {
    this.unblock();
    var theUser = Meteor.user();
    var theUserId = theUser._id;
    var theUserName = Meteor.user().name;
    var goods = Items.findOne({_id: theItem, shopItem: true});
    var itemCost = parseInt(goods.shopPrice);
    var itemSlug = goods.slug;
    // Throw Error if user cannot afford
    if (!goods) {
      throw new Meteor.Error("item-not-for-sale");
    } else
      if(goods.limitedItem && (goods.available < 1)){
          throw new Meteor.Error("none-left");
        } else
    if(theUser.currency < itemCost) {
      throw new Meteor.Error("cannot-afford");
    } else {
      // User can afford, let's move on
      
      //Charge the user
      var charge = itemCost - (itemCost * 2);
     Meteor.users.update({_id: theUserId}, {$inc: {currency: charge}});
      
      //Deliver the item
      if(goods.stacked) {
        var stackDetails = {
          title: goods.title,
          modalSlug: goods.modalSlug,
          description: goods.description,
          image: goods.image,
          type: goods.type,
          stacked: true,
          craftable: goods.craftable,
          essential: goods.essential,
          createdAt: new Date(), // current time
          origin: 'purchased'
        };
        Tempinv.update({userId: theUserId, slug: itemSlug}, {$set: stackDetails, $inc: {qty: 1}}, {upsert: true});
        return 'transaction complete'
      } else {
        var singleDetails;
        if (goods.type == 'key') {
          singleDetails = {
            userId: theUserId,
            title: goods.title,
            slug: goods.slug,
            description: goods.description,
            image: goods.image,
            type: goods.type,
            stacked: false,
            craftable: goods.craftable,
            essential: goods.essential,
            isKey: true,
            game: goods.game,
            server: goods.server,
            pass: goods.pass,
            qty: 1,
            createdAt: new Date(), // current time
            origin: 'purchased'
          }
        } else {
          singleDetails = {
            userId: theUserId,
            title: goods.title,
            slug: goods.slug,
            modalSlug: goods.modalSlug,
            description: goods.description,
            image: goods.image,
            type: goods.type,
            stacked: false,
            craftable: goods.craftable,
            essential: goods.essential,
            qty: 1,
            createdAt: new Date(), // current time
            origin: 'purchased'
          }
        }
        Tempinv.insert(singleDetails);
        if(goods.limitedItem){
          Items.update({_id: theItem}, {$inc: {available: -1}});
        }
        return 'transaction complete';
      }
    }
  },
  consume: function(itemId) {
      Tempinv.remove({_id: itemId});
      return 'removed';
  },
  openBundle: function(theBundle, theBundleId) {
    this.unblock();
    var theUser = Meteor.user();
    var theUserId = theUser._id;
    var theUserName = Meteor.user().name;
    var thisBundle = Items.findOne({slug: theBundle, type: 'bundle'});
    Tempinv.remove({_id: theBundleId});
    _.each(thisBundle.bundledItems, function(theItem) {
    var goods = Items.findOne({_id: theItem});
    var itemSlug = goods.slug;
      //Deliver the item
      if(goods.stacked) {
        var stackDetails = {
          title: goods.title,
          description: goods.description,
          image: goods.image,
          type: goods.type,
          stacked: true,
          craftable: goods.craftable,
          essential: goods.essential,
          createdAt: new Date(), // current time
          origin: 'bundle'
        };
        Tempinv.update({userId: theUserId, slug: itemSlug}, {$set: stackDetails, $inc: {qty: 1}}, {upsert: true});
        return 'transaction complete'
      } else {
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
          origin: 'bundle'
        }
        Tempinv.insert(singleDetails);
        return 'transaction complete';
      }
   });
    return 'bundle opened';
  },
  makeAdmin: function(theUser){
    if (! Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
      Meteor.users.update({name: theUser}, {$set: {isAdmin: true}});
      console.log(theUser + ' is now an admin');
    }
  },
  useBuff: function(theBuff, isStacked) {
    this.unblock();
    var reqUser = this.userId;
    var thisBuff = Items.findOne({slug: theBuff});
    var buffExists = Buffs.findOne({userId: reqUser, slug: thisBuff.slug});
    if(buffExists) {
      throw new Meteor.Error("already-has-buff");
    } else {
      var currentTime = new Date();
      var expireTime = thisBuff.expires;
      var newBuffId = Random.id();
      var rightMeow = moment(currentTime).add(expireTime, 'hours').toISOString();
      if(isStacked) {
          Tempinv.update({userId: this.userId, slug: theBuff}, {$inc: {qty: -1}});
        } else {
          Tempinv.remove({userId: this.userId, slug: theBuff});
        }
      var buffDetails = {
        buffId: newBuffId,
        userId: this.userId,
        type: 'stat',
        slug: thisBuff.slug,
        title: thisBuff.title,
        description: thisBuff.description,
        image: thisBuff.image,
        stat: thisBuff.stat,
        bonus: thisBuff.bonus,
        createdAt: new Date(), // current time
        expires: new Date(rightMeow)
      };
      Buffs.insert(buffDetails);
        console.log('New buff id ' + newBuffId);
    }
    return 'buff applied';
  },
  clearExpiredBuffs: function(){
    this.unblock();
    if (!Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
      var existingBuffs = Buffs.find({}).fetch();
      var rightNow = Date.now();
     _.each(existingBuffs, function(buff){
       var getExpiration = new Date(buff.expires).getTime();
       if (getExpiration <= rightNow) {
       var removeID = buff._id;
       Buffs.remove({_id: removeID}, function(){
         console.log('removed buffID ' + buff.buffId);
       });   
       }
     });
      return true;
    }
  },
  fixBuffs: function(){
    this.unblock();
    if (!Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
      var existingBuffs = Buffs.find({}).fetch();
     _.each(existingBuffs, function(buff){
       var createdTime = buff.createdAt;
       var newExpire = moment(createdTime).add(48, 'hours').toISOString();
       var updateID = buff._id;
       Buffs.update({_id: updateID}, {$set: {expires: new Date(newExpire)}}, function(){
         console.log('fixed buffID ' + buff.buffId);
       });   
     });
      return true;
    }
  },
  lootCannon: function(theItem) {
    this.unblock();
    if (!Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
        var allUsers = Meteor.users.find({subbed: {$exists: true}}).fetch();
        var theList = _.pluck(allUsers, '_id'); 
          var goods = Items.findOne({slug: theItem});
          var itemSlug = theItem;
      //Charge the user

      //Deliver the item
      if(goods.stacked) {
        var stackDetails = {
          title: goods.title,
          description: goods.description,
          image: goods.image,
          type: goods.type,
          stacked: true,
          craftable: goods.craftable,
          essential: goods.essential,
          createdAt: new Date(), // current time
          origin: 'loot',
          loot: true
        };
          console.log('Stacked. ' + stackDetails + ' - ' + theList );
        var tehQuery = {'userId': {'$in': theList}};
        Tempinv.update(tehQuery, {$set: stackDetails, $inc: {qty: 1}}, {upsert: true, multi: true}, function(x, y){
          if(x){
            console.log(x); 
               } else {
                 console.log(y);
               }
        });
      } else {
        var created = new Date();
        var singleDetails = {
          title: goods.title,
          description: goods.description,
          image: goods.image,
          type: goods.type,
          stacked: false,
          craftable: goods.craftable,
          essential: goods.essential,
          qty: 1,
          origin: 'loot',
          loot: true
        }
        console.log('Single. ' + singleDetails + ' - ' + theList );
        //tehQuery = { userId: { $in: theList }, slug: itemSlug, createdAt: created};
        //Tempinv.update({ userId: { $in: theList }, slug: itemSlug, createdAt: created}, {$set: singleDetails}, {upsert: true, multi:true});
        }
        }
      return 'items given';
    },
  say: function(message) {
    if (!Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
    client.say('drako_gaming', message);
    }
    return 'message delivered!';
  },
  testEvent: function(){
    em.emit('streamEvent', {
      type: 'test'
    });
    return 'event triggered';
  },
    testPath: function(){
    em.emit('streamEvent', {
      type: 'path',
      user: 'ThetaMax',
      chosenPath: 'Shadow Hunter'
    });
    return 'event triggred';
  }
});
