//////////////////////////////////////////////
// HELPERS
//////////////////////////////////////////////

Template.userbettingtab.helpers({
    betrounds: function () {
      return Rounds.find({staged: true}, {sort: {createdAt: -1}, limit: 1});
    },
     completeRound: function () {
      return Rounds.find({hasResults: true}, {sort: {createdAt: -1}, limit: 1}, {fields: {results: 1, challenge: 1}});
    },
     winneR: function (){
       var winnersList = this.results;
       var sortedWinners = _.sortBy(winnersList, 'wonAmount').reverse();
       return sortedWinners;
     },
     hasBet: function () {
       if(_.contains(this.gamblers, Meteor.userId())) {
         return true;
       } else {
         return false;
       }
     }     
  });

//////////////////////////////////////////////
// EVENTS
//////////////////////////////////////////////

  Template.userbettingtab.events({
  "click #placeBet": function (event) {
    // This function is called when the new task form is submitted
    $('.ueWarning').remove();
    if($('div.theOptions input:radio:checked').length > 0) {
    var $selectedOption = $("div.theOptions input[type='radio']:checked").val();
    var $betAmount = parseInt($('body').find('input#betAmount').val());
    Meteor.call("placeBet", this._id, $selectedOption, $betAmount, function(error){
      if (error && error.error === "exceeds-balance") {
    // show a nice error message
    $('div.placeBet').append('<br><span class="ueWarning" style="color: red; font-size:10px; font-weight:bolder;">Oops! You don\'t have that many scales!</span>');
  } else if (error && error.error === "negative-bet") {
    // show a nice error message
    $('div.placeBet').append('<br><span class="ueWarning" style="color: red; font-size:10px; font-weight:bolder;">Oops! You can\'t bet negative scales!</span>');
  } else if (error && error.error === "betIsNaN") {
    // show a nice error message
    $('div.placeBet').append('<br><span class="ueWarning" style="color: red; font-size:10px; font-weight:bolder;">Oops! Your bet must be a number!</span>');
  } else {
      playSound('coins');
      currencyCue('down', $betAmount);
    }
    });
      $("div.theOptions input[type='radio']").not(':checked').attr('disabled',true);
    } else {
    $('div.theOptions').append('<span class="ueWarning" style="color: red; font-weight:bolder;">Oops! You forgot to select an option.</span>');
  }
 },
    "keypress input": function (event) {
    if (event.charCode === 0 || /\d/.test(String.fromCharCode(event.charCode))) {
      console.log('typed number');
      return true;
    } else {
      console.log('typed character');
      event.stopPropagation();
      return false;
    }
  }
});