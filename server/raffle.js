Meteor.methods({
  
////////////////////////////////////////////
// RAFFLE: USER
////////////////////////////////////////////
  
  enterRaffle: function (raffleID, ticketCost, theEntry) {
    if (Meteor.user().banned) {
      throw new Meteor.Error("banned");
    }
    if (!Meteor.user().exp) {
      throw new Meteor.Error("banned");
    }
    // Make sure the user is logged in before inserting a task
    var theEntrant = Meteor.user().name;
    console.log(theEntrant + ' registered an entry to the raffle ' + raffleID);
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    if (Meteor.user().currency < ticketCost) {
      throw new Meteor.Error("Ticket cost exceeds available balance");
      } else if (Meteor.user().currency - ticketCost < 0){
      throw new Meteor.Error("Ticket cost exceeds available balance");
    } else if (ticketCost < 1){
      throw new Meteor.Error("Ticket cost cannot be less than 0");
    } else if (isNaN(ticketCost)){
      throw new Meteor.Error("Entry is not of the proper type");
    } else {
      var thisEntrant = Meteor.userId();
      var chargeTicket = ticketCost - (ticketCost*2);
      Meteor.users.update({_id: thisEntrant}, {$inc: {currency: chargeTicket}});
      Raffles.update({_id: raffleID}, {$inc : {'raffleEntries': 1}});
      RaffleEntries.insert({
        raffleId: raffleID,
        userId: thisEntrant,
        userName: theEntry.entrantDisplayName,
        paid: ticketCost,
        createdAt: new Date()
      });
      }
    },
  ////////////////////////////////////////////
// RAFFLE: ADMIN
////////////////////////////////////////////
  
  //BEGIN AWARD WINNERS
  insertRaffle: function($prizeText, $entryCost) {
    if (! Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
      Raffles.insert({
        prize: $prizeText,
        cost: $entryCost,
        entries: [],
        raffleEntries: 0,
        staged: true,
        live: true,
        hasResults: false,
        results: [],
        createdAt: new Date() // current time
      });
    }
    client.say('drako_gaming', 'Raffle is now open! Prize: ' + $prizeText + ' | Cost per entry: ' + $entryCost + ' scales. Could this be your lucky day?');
  },
  closeRaffle: function(theRaffle) {
    if (! Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
    Raffles.update(theRaffle, {$set : {live: false}});
      console.log('Raffle entry period has been closed');
      client.say('drako_gaming', 'The entry period for the raffle has now closed, good luck!');
    }
  },
  pickWinners: function (raffleID, winnerCount) {
      if (! Meteor.user().isAdmin ) {
      throw new Meteor.Error("not-authorized");
    } else {
    var winnersList = [];
    //var raffleArr = RaffleEntries.find({raffleId: raffleID}).fetch();
    //var raffle = raffleArr[0];
    //var selectedWinners = _.sample(raffle, winnerCount);
    var selectedWinners = _.flatten(_.sample(RaffleEntries.find({raffleId: raffleID}).fetch(), 1))
    Raffles.update({_id: raffleID}, {$set: {staged: false, hasResults: true}});
    var winners = selectedWinners;
        for (var i=winners.length-1; i>=0; i--) {
         var theDisplayName = winners[i].userName;
         var theEntryId = winners[i]._id
         var winRecord = {
           displayName: theDisplayName,
           ticketId: theEntryId
         };
          Raffles.update({_id: raffleID}, {$push: {results: winRecord}});
          winnersList.push(winRecord);
    }
      var sortedWinners = winnersList;
      client.say('drako_gaming', 'drakoChest drakoChest drakoChest And the winner is... ' + sortedWinners[0].displayName + '! Thanks for playing!');
  }
}
  //END AWARD WINNERS
  ///////////////////
  });
