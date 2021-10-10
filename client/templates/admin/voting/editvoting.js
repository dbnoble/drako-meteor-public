//////////////////////////////////////////////
// HELPERS
//////////////////////////////////////////////

Template.editvoting.helpers({
    poll: function () {
      return Polls.find({live: true}, {sort: {createdAt: -1}, limit: 1});
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

Template.editvoting.events({
  "click #submitNewPoll": function (event) {
    // This function is called when the new task form is submitted
    var $options = [];
    var $challengeInput = $('body').find('#pollQuestion');
    var $challenge = $challengeInput.val();
    var $optionValues = $('body').find('input.voteOption').each( function() {
      var votingOptions = {
        optionId : Random.id(),
        optionText : $(this).val(),
        optionVotes : 0
      };
      $options.push(votingOptions);
      $(this).val('');
    });
    
    // Clear form
    $challengeInput.val('');
    
    Meteor.call('insertPoll', $challenge, $options);

    // Prevent default form submit
    return false;
  },
  "click #closeRound" : function () {
    var thePoll = this._id;
    Meteor.call('closePoll', thePoll);
  },
  "click #reopenRound" : function () {
    Polls.update(this._id, {$set : {live: true}});
  },
  "click #nothingNow" : function () {
    //var winningOption = $("div#selectWinner input[type='radio']:checked").val();
    //Meteor.call("awardWinners", this._id, winningOption);
  }
});