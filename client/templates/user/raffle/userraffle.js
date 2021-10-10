//////////////////////////////////////////////
// HELPERS
//////////////////////////////////////////////

Template.userraffletab.helpers({
    rafflerounds: function () {
      return Raffles.find({staged: true}, {sort: {createdAt: -1}, limit: 1});
    },
     completeRaffles: function () {
      return Raffles.find({hasResults: true}, {sort: {createdAt: -1}, limit: 1}, {fields: {results: 1, prize: 1}});
    },
     raffleWinners: function (){
       var winnersList = this.results;
       return winnersList;
     },
     hasEntered: function () {
       if(_.contains(this.gamblers, Meteor.userId())) {
         return true;
       } else {
         return false;
       }
     },
  userEntries: function () {
    var thisRaffle = this._id;
    return RaffleEntries.find({raffleId: thisRaffle}).count();
  },
  enoughCurrency: function() {
    if(Meteor.user().currency >= this.cost) {
       return true;
       } else {
       return false;
       }
  }
  });

//////////////////////////////////////////////
// EVENTS
//////////////////////////////////////////////

  Template.userraffletab.events({
  "click #enterRaffle": function (event) {
    $('#enterRaffle').hide();
    $('#enteringRaffle').show();
    // This function is called when the new task form is submitted
    $('.ueWarning').remove();
    var $ticketCost = this.cost;
    var entrantById = Meteor.userId();
    var entrantByName = Meteor.user().name;
    var entrantByDisplayName = Meteor.user().display_name;
    var theEntry = {
      entryId: Random.id(),
      entrantId: entrantById,
      entrantName: entrantByName,
      entrantDisplayName: entrantByDisplayName,
      wager: $ticketCost,
      createdAt: new Date()
    }; 
    Meteor.call("enterRaffle", this._id, $ticketCost, theEntry, function(){
    });
    $('#enteringRaffle').hide();
      $('#enterRaffle').show().html('Enter Again');
      playSound('coins');
      currencyCue('down', $ticketCost);
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