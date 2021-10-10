//////////////////////////////////////////////
// HELPERS
//////////////////////////////////////////////

Template.editraffle.helpers({
    rafflerounds: function () {
      return Raffles.find({staged: true}, {sort: {createdAt: -1}, limit: 1});
    },
     completeRaffle: function () {
      return Raffles.find({hasResults: true}, {sort: {createdAt: -1}, limit: 1});
    },
     isLive: function () {
       if(this.live) {
         return true;
       } else {
         return false;
       }
     }
  });

//////////////////////////////////////////////
// EVENTS
//////////////////////////////////////////////

  Template.editraffle.events({
  "click #submitNewRaffle": function (event) {
    // This function is called when the new task form is submitted
    var $prizeInput = $('body').find('#rafflePrize');
    var $prize = $prizeInput.val();
    var $raffleCostInput = $('body').find('#raffleCost');
    var $cost = $raffleCostInput.val();
    
    // Clear form
    $prizeInput.val('');
    Meteor.call("insertRaffle", $prize, $cost);
    // Prevent default form submit
    return false;
  },
  "click #closeRaffle" : function () {
    var theRaffle = this._id;
    Meteor.call("closeRaffle", theRaffle);
  },
  "click #reopenRaffle" : function () {
    Rounds.update(this._id, {$set : {live: true}});
  },
  "click #awardRaffle" : function () {
    Meteor.call("pickWinners", this._id, 1);
  }
});