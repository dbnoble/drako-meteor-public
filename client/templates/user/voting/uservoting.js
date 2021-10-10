//////////////////////////////////////////////
// HELPERS
//////////////////////////////////////////////

Template.uservotingtab.helpers({
    poll: function () {
      return Polls.find({}, {sort: {createdAt: -1}, limit: 1});
    },
     hasVoted: function () {
       if(_.contains(this.voters, Meteor.userId())) {
         return true;
       } else {
         return false;
       }
     },
     votePercent: function () {
     var mantooth = Polls.findOne({}, {sort: {createdAt: -1}, limit: 1});
     var totalVotes = mantooth.pollVotes;
     var pct = (this.optionVotes/totalVotes)*100;
     return Number(pct).toFixed(0);
   },
     votesToScales: function () {
      return (this.optionVotes * 5);
   }
  });

//////////////////////////////////////////////
// EVENTS
//////////////////////////////////////////////

  Template.uservotingtab.events({
  "click #placeVote": function (event) {
    // This function is called when the new task form is submitted
    $('.ueVoteWarning').remove();
    if($('div.voteOptions input:radio:checked').length > 0) {
    var $selectedOption = $("div.voteOptions input[type='radio']:checked").val();
    Meteor.call("placeVote", this._id, $selectedOption);
      $("div.voteOptions input[type='radio']").not(':checked').attr('disabled',true);
      $('#placeVote').stop().css('opacity', '0').html('Your Vote Was Processed!').animate({
        opacity: 1
    }, 500);
      setTimeout(function(){
        $("div.voteOptions input[type='radio']").not(':checked').attr('disabled',true);
      $('#placeVote').stop().css('opacity', '0').html('Vote Again').animate({ opacity: 1 }, 500); }, 1000);
    } else {
    $('div.voteOptions').append('<span class="ueVoteWarning" style="color: red; font-weight:bolder;">Oops! You forgot to select an option.</span>');
  }
 }
});
