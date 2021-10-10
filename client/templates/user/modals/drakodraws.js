Template.drakoDraws.events({
  "click .waxStamp" : function () {
   var sendReq = function(){
     var theMessage = $('#drawSubmission').val();
     if(!theMessage) {
       theMessage = 'defaultResponse';
     }
     Meteor.call('reqDrawing', theMessage, function(error, result){
      if(!error){
       console.log('Request sent!');
      } else {
        console.log('Something went wrong...');
      }
     });
     Meteor.setTimeout(function(){ Modal.hide('drakoDraws') }, 250);
   }
    t1 = new TimelineMax({onComplete: function(){ sendReq() } });
    t1.to($('.waxStamp'), 1, {scale: 1.4, x: 77, y: -71, ease:Sine.easeInOut});
    t1.to($('.waxStamp'), 0.5, {scale: 1}, "-=0.25");
    t1.to($('.waxMark'), 0, {opacity: 1}, "-=0.25");
    t1.to($('.waxStamp'), 1, {scale:2, opacity:0, ease:Expo.easeOut});
  }
});