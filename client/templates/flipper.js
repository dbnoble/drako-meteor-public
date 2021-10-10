
//Template.flipper_front.famousEvents({ 'click': flipSurface });
//Template.flipper_back.famousEvents({ 'click #morse': flipSurface });

Template.flipper.events({
  'click .fa-cogs': function() {
  // var flippA = $(".cardWrapper").find(".card");
  //  TweenMax.to(flippA, 0.750, {rotationY:180, ease:Back.easeOut});
    $.slidebars.toggle('right');
  }
});

Template.flipper_front.rendered = function(){
  var wrapper = this.find('#emoteBoxWrapper');
  TweenMax.set(wrapper, { autoAlpha: 0, display: 'none'});
  var settingsWrapper = this.find('#settingsBoxWrapper');
  TweenMax.set(settingsWrapper, { autoAlpha: 0, display: 'none'});
}

Template.flipper_back.events({
  'click #flipBack': function() {
   // var flippA = $(".cardWrapper").find(".card");
   // TweenMax.to(flippA, 0.750, {rotationY:0, ease:Back.easeOut}); 
    $.slidebars.toggle('right');
  }
});

Template.flipper_front.helpers({
  activeEvents: function() {
  var livepolls = Polls.find({live: true}, {sort: {createdAt: -1}, limit: 1});
  var liverounds = Rounds.find({live: true}, {sort: {createdAt: -1}, limit: 1});
    if(livepolls.count) {
      return Polls.find({live: true}, {sort: {createdAt: -1}, limit: 1});;
    } else if (liverounds.count) {
      return Rounds.find({live: true}, {sort: {createdAt: -1}, limit: 1});
    }
}
});

 Template.flipper_front.helpers({
    betrounds: function () {
      return Rounds.find({staged: true}, {sort: {createdAt: -1}, limit: 1});
    }
  });

 Template.flipper_back.helpers({
    isAdmin: function () {
       if (Meteor.user().isAdmin) {
        return true;
      } else {
        return false;
      }
    }
  });


 Template.tabholder.helpers({
    isAdmin: function () {
       if (Meteor.user().isAdmin) {
        return true;
      } else {
        return false;
      }
    }
  });

 Template.admintab.helpers({
    isAdmin: function () {
       if (Meteor.user().isAdmin) {
        return true;
      } else {
        return false;
      }
    }
  });


 Template.admintabholder.helpers({
    isAdmin: function () {
       if (Meteor.user().isAdmin) {
        return true;
      } else {
        return false;
      }
    }
  });


