Rounds = new Mongo.Collection("rounds");
Raffles = new Mongo.Collection("raffles");
Polls = new Mongo.Collection("polls");
Stream = new Mongo.Collection("stream");
Kappa = new Mongo.Collection("kappa");
Tempinv = new Mongo.Collection("tempinv");
Inv = new Mongo.Collection("inv");
Items = new Mongo.Collection("items");
ItemImages = new Mongo.Collection("itemimages");
Buffs = new Mongo.Collection("buffs");
Keychain = new Mongo.Collection("keychain");
Hosts = new Mongo.Collection("hosts");
RaffleEntries = new Mongo.Collection("raffleentries");
Chatcolor = new Mongo.Collection("chatcolor");
Chatglow = new Mongo.Collection("chatglow");
Donations = new Mongo.Collection("donations");
Emotes = new Mongo.Collection("emotes");
ChatUsers = new Mongo.Collection('chatusers');

em = new EventDDP('streamEvent');

if (Meteor.isClient) {
  function preloader() {
	if (document.images) {
		var img1 = new Image();
		var img2 = new Image();
		var img3 = new Image();

		img1.src = "https://s3.amazonaws.com/drakogaming/drakoOffline.png";
		img2.src = "https://s3.amazonaws.com/drakogaming/drakoOnline.png";
		img3.src = "https://s3.amazonaws.com/drakogaming/inventory/drakoDraws-bg.png";
	}
}
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			if (oldonload) {
				oldonload();
			}
			func();
		}
	}
}

  Meteor.startup(function () {
    addLoadEvent(preloader);
    Session.set('tmiReady', false);
    });

  checkCraftable = function() {
      $('#itemResult').empty();
      $('.craftButton').addClass('no-item-found');  
      var theItems = [];
      $('#crafting').children().each(function (i) {
        theItems.push($(this).data('item-handle'));
      });
      console.log('Found ' + theItems.toString());
      var item = crafty.craft(theItems);
      if(item.give) {
      var foundItemSlug = item.give[0];
      var foundItem = Items.findOne({slug: foundItemSlug});
      $('.craftButton').removeClass('no-item-found');  
      $('#itemResult').append('<div class="craft-result-item item-info" style="background-image:url(\'' + foundItem.image +'\');" title="<span class=\'ttItemName\'>' + foundItem.title +'</span>" data-content="<span class=\'ttItemDescription\'>' + foundItem.description +'<span>"></div>');
      console.log('You can craft ' + item.give[1] + 'x ' + item.give[0] + '!');
      } else {
        console.log('Nothing can be crafted with this combination');
    }
  }
  
  mkDrag = function(mkDraggable){
    Draggable.create(mkDraggable, {
  type:"x,y",
  throwProps:false,
  onDragStart:function(e) {
    var element = e.target;
    var $element = $(element);
    $element.addClass('dragging');
    this.origin = $element.parent();
  },
  onDragEnd:function(e) {
    var element = e.target;
    var $element = $(element);
      if (this.hitTest('.crafting', '100%')) {
       if($element.parent().hasClass('inventory') && ($('.crafting').children().length < 6)){
         $('.crafting').append($element);
         checkCraftable();
       }
        //TweenMax.set(this.target, {clearProps:"x,y"});
      } else {
        if($element.parent().hasClass('crafting')){
          $('.inventory').append($element);
          checkCraftable();
        }
      }
    $element.removeClass('dragging');
    TweenMax.set(this.target, {x: 0, y: 0});
  }
});
  }
  
    throttleMe = function() {
  $('#inventory').shapeshift({
                       minColumns: 6,
                       align: "left",
                       colWidth: 65,
                       paddingX: 7,
                       paddingY: 7,
                       gutterX: 0,
                       gutterY: 14
                     });
}
  
  throttleMe2 = function() {
    $("#inventory").trigger("ss-rearrange");
  }
throttledReset = _.debounce(throttleMe, 100);  
throttledRearrange = _.debounce(throttleMe2, 50);
  
toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "500",
  "hideDuration": "1000",
  "timeOut": "7000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}
  
  Leaders = new Mongo.Collection('leaders');
  var spastic = false;

  Accounts.ui.config({
    requestPermissions: {
        twitch: ['user_read', 'chat_login', 'user_subscriptions']
    }
});
  Meteor.subscribe('leaderBoard');
  Meteor.subscribe("userData");
  Meteor.subscribe("betrounds");
  Meteor.subscribe("rafflerounds");
  Meteor.subscribe("stream");
  Meteor.subscribe("poll");
  Meteor.subscribe("kappa");
  Meteor.subscribe("inventory");
  Meteor.subscribe("shopItems");
  Meteor.subscribe("availableItems");
  Meteor.subscribe("activeBuffs");
  Meteor.subscribe("hostMode");
  Meteor.subscribe("Rentries");
  Meteor.subscribe("donations");
  Meteor.subscribe('emotes');
  Meteor.subscribe("chatColor");
  Meteor.subscribe("chatGlow");
  Meteor.subscribe("chatUsers");
  
AccessToken = new Meteor.Collection("currentUserAccessToken");
Meteor.subscribe("currentUserAccessToken");

Handlebars.registerHelper('isMod', function () {
  if(Meteor.user() && Meteor.user().isMod){
    return true;
    } else {
      return false;
    }
});
  
  Handlebars.registerHelper('currencySlug', function () {
    return streamerConfig.currencySlug;
});
  
  Handlebars.registerHelper('experienceSlug', function () {
    return streamerConfig.experienceSlug;
});
  
    Handlebars.registerHelper('levelData', function () {
    var currentXP = Meteor.user().exp;
    var i = 0;
    while(currentXP > 267*(i*(i - 1)/2)) {
      i++;      
    }
    var currentLevel = i-1;
    var currentLevelXP = 267*(currentLevel*(currentLevel - 1)/2);
    var nextLevel = currentLevel + 1;
    var nextLevelXP = 267*(nextLevel*(nextLevel - 1)/2);
    var difficulty = nextLevelXP - currentLevelXP;
    var overDiff = currentXP - currentLevelXP;
    var levelProgress = 100*(overDiff / difficulty);
    var shortProgress = Number(levelProgress).toFixed(2);
    var remainingProgress = difficulty - overDiff ;
    var data = {
      currentExp : currentXP,
      currentLev : currentLevel,
      nextLev : nextLevel,
      expFloor : currentLevelXP,
      expCeiling : nextLevelXP,
      expSpan : difficulty,
      expOver : overDiff,
      progress : {
        long : levelProgress,
        short : shortProgress
      },
      expToLevel: remainingProgress 
    };
    
    return data;
});
  
  
 Template.navigation.helpers({
    leaders: function () {
      return Leaders.find({}, {sort: {currency: -1}, limit: 10}, {fields: {name: 1, currency: 1}});
    },
   activeBuffs: function(){
     return Buffs.find({userId: Meteor.userId()});
   },
   buffCountDown: function(expires){
     if(moment && expires){
       moment.relativeTimeThreshold('h', 49);
       var countDown = moment(expires).from(TimeSync.serverTime(null, 1000));
        return countDown;
    } else {
        return expires;
    }
   }
  });
  
  Template.activeUserBuffs.helpers({
    buffCountDown: function(expires){
     if(moment && expires){
       moment.relativeTimeThreshold('h', 49);
        return moment(expires).from(TimeSync.serverTime(null, 1000));
    } else {
        return expires;
    }
   }
  });
  
   Template.preshow.helpers({
    inventory: function () {
     return Tempinv.find({userId: Meteor.userId()});
    }
  });
  
/*     Template.profiletabholder.helpers({
    inventory: function () {
      return Tempinv.find({}, {sort: {createdAt: -1}, limit: 1});
    }
  }); */
  
   Template.navigation.helpers({
    betrounds: function () {
      return Rounds.find({}, {sort: {createdAt: -1}, limit: 1});
    }
  });
  
     Template.mobilemain.helpers({
    doBG: function () {
      $('body').css('background-color', 'rgb(30, 30, 30)');
    }
  });
  
    Template.StrumTemplate.helpers({
    stream: function () {
      return Stream.findOne({channel: 'drako_gaming'});
    },
    hostMode: function(){
      return Hosts.find({}, {sort: {createdAt: -1}, limit: 1});
    },
    hostModeDisabled: function(){
      if(Meteor.user() && Meteor.user().settings.hostMode == 'disabled'){
        return true;
      } else {
        return false;
      }
    },
      flipInit: function() {
        setTimeout(function(){
      TweenMax.set(".cardWrapper", {perspective:5000});
      TweenMax.set(".card", {transformStyle:"preserve-3d"});
      TweenMax.set(".back", {rotationY:-180});
      TweenMax.set([".back", ".front"], {backfaceVisibility:"hidden"});
        console.log('flipInit');
        return true;
      }, 1000);
     }
  });
  
  Template.navigation.rendered = function(){
  this.find('#activeUserBuffs')._uihooks = {
      insertElement: function(node, next) {
        if(Session.get('loaded')) {
        console.log("New Active Buff");
        $(node).appendTo('#activeUserBuffs');
         TweenMax.from($(node), 1, 
                     {scale:0.1, opacity:0, delay: 0, onComplete: function() {
                       TweenMax.to($(node), 1, {opacity: 0.25, delay: 3, ease:Expo.easeOut});}, ease:Expo.easeOut});
        var $updatedItem = $(node);
          $updatedItem.sparkle({
            count: 12,
            speed: .5,
            direction: 'up',
            minSize: 4,
            maxSize: 7,
            overlap: 0,
            color: "#FFFFFF"
          });
            $updatedItem.off("mouseover.sparkle")
            $updatedItem.off("mouseout.sparkle")
            $updatedItem.off("focus.sparkle")
            $updatedItem.off("blur.sparkle")
            $updatedItem.addClass('sprkld');
          $updatedItem.trigger("start.sparkle");
          setTimeout(function () {
            $updatedItem.trigger("stop.sparkle")
          }, 5000);
        } else {
        console.log("Existing Buff");
        $(node).appendTo('#activeUserBuffs');
        TweenMax.to($(node), 0, {opacity: 0.25, delay: 0, ease:Expo.easeOut});
        Session.set('loaded', true);
        }
      },
      removeElement: function(node) {
        console.log("Buff Expired");
        $('*').popover('hide');
        TweenMax.to($(node), 1, 
                     {scale:1.5, opacity:0, onComplete: function() {
                       $(node).remove();
                     }, ease:Expo.easeOut});
      }
    };
  }
  Template.hostedStream.rendered = function(){
  this._uihooks = {
    insertElement: function(node, next) {
      $(node).insertAfter(next);
       TweenMax.from($(node), 1, 
                   {opacity:0, ease:Expo.easeOut});
    },
    removeElement: function(node) {
      TweenMax.to($(node), 1, 
                   {opacity:0, onComplete: function() {
                       $(node).remove();
                     }, ease:Expo.easeOut});
    }
  };
}
}

if (Meteor.isServer) {

}

