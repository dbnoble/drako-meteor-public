//////////////////////////////////////////////
// HELPERS
//////////////////////////////////////////////

Template.scorecard.helpers({
  avatar: function() {
      return '/addItemPlaceholder.png';
  }
});

Template.badges.helpers({
  badges: function() {
  return Meteor.user().badges;
}
});

//////////////////////////////////////////////
// EVENTS
//////////////////////////////////////////////
Template.profiletabholder.helpers({
  gridInit: function(){
    Meteor.setTimeout(function() {
      mkDrag('.inventory-item');
    }, 250);
  }
});

Template.profiletabnav.events({
  'click #doIt': function() {
    Meteor.setTimeout(function() {
      mkDrag('.inventory-item');
      $('.scrollbar-macosx').not('.scrollbar-chat').scrollbar();
    }, 250);
  }
});

Template.settingstab.helpers({
  getHostMode: function() {
    if(!Meteor.user()) {
      return 'checked';
    } else {
      var currentMode = Meteor.user().settings;
      if(currentMode && (currentMode.hostMode == 'enabled')){
        return 'checked';
      } else {
        return '';
      }
    }
  }
});

Template.settingstab.events({
  'click #hostModeCheckBox': function() {
    var currentSetting = $('#hostModeCheckBox').is(':checked');
    Meteor.call('setHostMode', currentSetting);
  }
});
