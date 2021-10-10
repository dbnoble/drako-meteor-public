/* Template.preshow.uihooks({
  ".inventory-item": {
    container: "#inventory",
    insert: function(node, next, tpl) {
      console.log("Inserting an item.");
      $(node).addClass('ss-active-child');
      $(node).insertBefore(next);
       $("#inventory").trigger("ss-rearrange");
       TweenMax.from($(node), 0.25, 
                   {scale:0.2, opacity:0, delay:0.5, ease:Elastic.easeOut});
    },
    remove: function(node, tpl) {
      console.log("Removing an item.");
      TweenMax.to($(node), 1, 
                   {scale:2, opacity:0, onComplete: function() {
                     $(node).remove();
                   }, ease:Expo.easeOut});
    }
  }
}); */

function loadSound () {
  createjs.Sound.registerSound("thunder.mp3", 'thunder');
  createjs.Sound.registerSound("coinjingle.mp3", 'coins');
  createjs.Sound.registerSound("deepcover-short.mp3", 'deepCover');
  createjs.Sound.registerSound("drink.mp3", 'drink');
}

currencyCue = function(direction, amount) {
  if (direction == 'up') {
    $('#currencyChange').append('<span class="currencyUp">'+amount+'</span>');
           TweenMax.to($('.currencyUp'), 2, 
                   {top: '100px', opacity:0, onComplete: function(){
                     $('.currencyDown').remove();
                   }, ease:Sine.easeOut});
  } else {
    $('#currencyChange').append('<span class="currencyDown">'+amount+'</span>');
           TweenMax.to($('.currencyDown'), 2, 
                   {top: '100px', opacity:0, onComplete: function(){
                     $('.currencyDown').remove();
                   }, ease:Sine.easeOut});
  }
}

function startEffect() {
  
  CustomText = function (game, x, y, text) {

    Phaser.Text.call(this, game, x, y, text, { font: "65px Arial", fill: "#ff0044", align: "center" });

    this.anchor.set(0.5);

};

CustomText.prototype = Object.create(Phaser.Text.prototype);
CustomText.prototype.constructor = CustomText;
  
var background;
var filter;
  var game = new Phaser.Game($(window).width(), $(window).height(), Phaser.WEBGL, 'effectWrap', { preload: preloadEffect, create: createEffect, update: updateEffect });
  playSound('drink');
  setTimeout(function() {
  playSound('deepCover');
  $('#effectWrap').fadeIn(5000);
  }, 4000);
  function preloadEffect() {
    game.load.script('filter', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/Marble.js');
}

function createEffect() {

	background = game.add.sprite(0, 0);
	background.width = $(window).width();
	background.height = $(window).height();

	filter = game.add.filter('Marble', $(window).width(), $(window).height());
	filter.alpha = 0.2;

	//	The following properties are available (shown at default values)

	//	filter.speed = 10.0;
	//	filter.intensity = 0.30;

	background.filters = [filter];
  
  var text = new CustomText(game, game.world.centerX, game.world.centerY, '');

    game.add.existing(text);

}

function updateEffect() {

	filter.update();

}
  setTimeout(function() {
var paths = '<option>Abyss Walker</option><option>Battle Saint</option><option>Blade Dancer</option><option>Dread Ranger</option><option>Doom Bringer</option><option>Hell Knight</option><option>Shadow Hunter</option><option>Light Bringer</option><option>Spell Singer<option>Field Valkyrie</option>';
  var rankUp = '<div><div style="text-align:center; display:flex; flex-direction:column;"><h1 class="rankup-element" style="font-weight: bolder; font-size:60px;margin-top:-90px;">There are many paths in life...</h1><h2 class="rankup-element" style="font-weight:bolder; font-size:45px;">you may walk but one.</h2><div class="rankup-element" style="max-width:475px; display:flex; align-self: center; width:100%;margin-top: 40px;"><select class="form-control input-lg path-select"><option value="">Choose your path...</option>' + paths + '</select> <button class="btn btn-lg btn-warning killEffect">I have chosen</button></div></div></div>';
  $('.effectBox').prepend(rankUp);
  TweenMax.staggerFrom($('body').find('.rankup-element'), 5, 
                   {scale:0.9, opacity:0, delay: 2, ease:Expo.easeOut}, 4);
  }, 4000);
}

playSound = function(soundID) {
  soundInstance = createjs.Sound.play(soundID);
  soundInstance.volume = 0.5;
};

Template.preshow.rendered = function(){
  $(document).mousemove(function(e) { 
            $('#currencyChange').offset({ top: e.pageY - 150, left: e.pageX - 200 }); 
        });
  loadSound();
  this.find('#inventory')._uihooks = {
    insertElement: function(node, next) {
      console.log("Inserting an item.");
      $(node).insertBefore(next);
      if($(node).data('item-origin') == 'crafted') {console.log('A crafted item is being inserted');}
       TweenMax.from($(node), 1, 
                   {scale:2, opacity:0, delay: 0.250, onComplete: function(){
                     mkDrag($(node));
                   }, ease:Expo.easeOut});
      if ($(node).data('item-origin') == 'loot') {
        toastr["info"]("Check your inventory to see what you've found.", "You found some loot!");
      }
      setTimeout(function(){
      var $updatedItem = $(node);
        $updatedItem.sparkle({
          count: 12,
          speed: .5,
          direction: 'up',
          minSize: 4,
          maxSize: 7,
          overlap: 5,
          color: "#FFFFFF"
        });
          $updatedItem.off("mouseover.sparkle")
          $updatedItem.off("mouseout.sparkle")
          $updatedItem.off("focus.sparkle")
          $updatedItem.off("blur.sparkle")
          $updatedItem.addClass('sprkld');
        $updatedItem.trigger("start.sparkle");
        setTimeout(function () {
          $updatedItem.removeClass('sprkld');
          $updatedItem.trigger("stop.sparkle")
        }, 5000); }, 500);
    },
    removeElement: function(node) {
      var $updatedItem = $(node);
      console.log("Removing an item.");
      $('*').popover('hide');
      $(node).removeClass('item-info');
      TweenMax.to($(node), 1, 
                   {scale:2, opacity:0, onStart: function(){
                     setTimeout(function(){
                     $($updatedItem).animate({width:0}, 250, function(){$(node).remove();});
                     }, 250);
                   }, onComplete: function() {
                     
                   }, ease:Expo.easeOut});
    }
  };
    this.find('#crafting')._uihooks = {
      removeElement: function(node) {
          console.log("Removing an item.");
          $('*').popover('hide');
          $(node).remove();
          checkCraftable();
        }
    }
}
Template.shopItem.rendered = function(){
 $('.scrollbar-macosx').not('.scrollbar-chat').scrollbar();
}

Template.store.helpers({
  shopItems: function() {
    return Items.find({shopItem: true});
  }
});

Template.shopItem.helpers({
  isAvailable: function() {
  if (this.available > 0) {
  return true;
  } else { 
    return false; }
  },
  availability: function() {
    if(this.limitedItem){
  var left = this.available;
  var total = this.quota;
  return ' ' + left + '/' + total + ' left.';
  } else {
    return '';
  }},
  canAfford: function() {
  if (Meteor.user().currency >= this.shopPrice) {
  return ' purchase-item';
  } else { 
    return ' cannot-afford'; }
  },
  hasReq: function(levelReq) {
    var req = this.levelReq || 0;
    if (Meteor.user().exp < levelReq) {
      return ' needReq';
    } else {
      return '';
    }
  },
  subReq: function() {
    if (!Meteor.user().subbed) {
      return false;
    } else {
      return true;
    }
  },
  canBuy: function(levelReq) {
    var req = this.levelReq || 0;
    if (Meteor.user().exp < levelReq) {
      return 'disabled';
    } else {
      return '';
    }
  }
});

Template.inventoryItem.helpers({
  isAccessKey: function(){
    if(this.type == 'key'){
      return true;
    } else {
      return false;
    }
  }
});

Template.shopItem.events({
  "click .purchase-item" : function () {
    if(Meteor.user().exp < this.levelReq) {
      console.log('Not high enough level');
    }
    else {
      var tehSlug = this.slug;
      var isStacked = this.stacked;
      var tehPrice = this.shopPrice;
      Meteor.call('purchaseItem', this._id, function() {
        playSound('coins');
        currencyCue('down', tehPrice);
        if(isStacked) {
         var $updatedItem = $('[data-item-handle="'+tehSlug+'"]');
          if (!$updatedItem.hasClass('sprkld')) {
          $updatedItem.sparkle({
            count: 12,
            speed: .5,
            direction: 'up',
            minSize: 4,
            maxSize: 7,
            overlap: 5,
            color: "#FFFFFF"
          });
            $updatedItem.off("mouseover.sparkle")
            $updatedItem.off("mouseout.sparkle")
            $updatedItem.off("focus.sparkle")
            $updatedItem.off("blur.sparkle")
            $updatedItem.addClass('sprkld');
          }
          $updatedItem.trigger("start.sparkle");
          setTimeout(function () {
            $updatedItem.trigger("stop.sparkle")
            $updatedItem.removeClass('sprkld');
          }, 5000);
        }
      });
    }
  }
});

  Template.preshow.events({
  "mousedown .inventory-item" : function (e) {
    $(e.target).popover('hide');
  },
  "dblclick [data-item-type='test']" : function () {
    var theItemId = this._id;
    Meteor.call('consume', theItemId, function(){
      startEffect();
    })
  },
  "dblclick [data-item-type='userSubmission']" : function () {
    var theItemId = this._id;
    var modalSlug = this.modalSlug;
    Meteor.call('consume', theItemId, function(){
      Meteor.setTimeout(function() {
      Modal.show(modalSlug);
      }, 250);
    })
  },
  "dblclick [data-item-type='buff']" : function (e) {
    var theBuff = this.slug;
    var isStacked = false;
    if (this.qty > 1) {
      isStacked = true;
    }
    Meteor.call('useBuff', theBuff, isStacked)
  },
  "dblclick [data-item-type='bundle']" : function (e) {
    var theBundleId = this._id;
    var theBundle = this.slug;
    Meteor.call('openBundle', theBundle, theBundleId, function(){
      console.log('bundle opened');
    })
  },
  "click .craftButton:not(.no-item-found)" : function () {
  var theItems = [];
  var itemList = [];
      $('#crafting').children().each(function (i) {
        theItems.push($(this).data('item-handle'));
        var qtY = $(this).attr('data-item-qty');
        var itemData = {
          itemId: $(this).data('item-id'),
          itemQty: qtY
        }
        itemList.push(itemData);
      });
    
    Meteor.call('craftItem', theItems, itemList, function(){
    checkCraftable();  
    });
  }
});

  Template.store.events({
  "click .inventory-item" : function () {
    $(e.target).popover('hide');
  }
});

  Template.effectWrapper.events({
  "click .killEffect" : function () {
    var thePath = $('.path-select').val();
    if (thePath !== '') { 
      Meteor.call('setPath', thePath, function(){
        $('#effectWrap').fadeOut(5000);
        var theCount = 0;
        var fadeMusic = setInterval(function() {
          if (theCount < 5000) {
          soundInstance.volume = soundInstance.volume - ((soundInstance.volume*1000) / (60 * 4000));
          theCount++;
          } else {
            createjs.Sound.stop('deepCover');
            soundInstance.volume = 0.5;
            clearInterval(fadeMusic);
            $('#effectWrap').empty();
            theCount = 0;
          }
        }, 1);
      });
    }
  }
});