Template.setColor.events({
  "click #saveColor" : function () {
     var chosenHue = parseInt($('#slidey').val());
     
     Meteor.call('saveColor', chosenHue, function(error, result){
      if(!error){
       console.log('Color saved!');
      } else {
        console.log('Something went wrong...');
      }
     });
     Meteor.setTimeout(function(){ Modal.hide('setColor') }, 250);
  }
});