Template.setGlow.events({
  "click #saveGlow" : function () {
     var chosenHue = parseInt($('#glowslidey').val());
     
     Meteor.call('saveGlow', chosenHue, function(error, result){
      if(!error){
       console.log('Glow saved!');
      } else {
        console.log('Something went wrong...');
      }
     });
     Meteor.setTimeout(function(){ Modal.hide('setGlow') }, 250);
  }
});