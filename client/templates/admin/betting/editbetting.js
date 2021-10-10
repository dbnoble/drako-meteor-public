//////////////////////////////////////////////
// HELPERS
//////////////////////////////////////////////

Template.editbetting.helpers({
    betrounds: function () {
      return Rounds.find({staged: true}, {sort: {createdAt: -1}, limit: 1});
    },
     completeRound: function () {
      return Rounds.find({hasResults: true}, {sort: {createdAt: -1}, limit: 1});
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

  Template.editbetting.events({
  "click #submitNewRound": function (event) {
    // This function is called when the new task form is submitted
    var $options = [];
    var $challengeInput = $('body').find('#betQuestion');
    var $challenge = $challengeInput.val();
    var $optionValues = $('body').find('.betOption').each( function() {
      var betOption = {
        optionId : Random.id(),
        optionText : $(this).val(),
        optionBetCount : 0,
        optionPool : 0,
        optionBets : []
      };
      $options.push(betOption);
      $(this).val('');
    });
    
    // Clear form
    $challengeInput.val('');
    Meteor.call("insertRound", $challenge, $options);
    // Prevent default form submit
    return false;
  },
  "click #closeRound" : function () {
    var theRound = this._id;
    Meteor.call("closeRound", theRound);
  },
  "click #reopenRound" : function () {
    Rounds.update(this._id, {$set : {live: true}});
  },
  "click #awardWinners" : function () {
    var winningOption = $("div#selectWinner input[type='radio']:checked").val();
    Meteor.call("awardWinners", this._id, winningOption);
  }
});