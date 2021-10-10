var streamEventHandler;
var thePath;
Template.streamEvents.created = function() {

thePath = function(e) {
  $('#eventsBottomRight').queue(function(next){
    $(this).append('<div class="path">' + e.user + ' has chosen the path of the ' + e.chosenPath + '</div>');
    TweenMax.from('.path', 2, {y: 20, opacity: 0, ease:Expo.easeOut});
    TweenMax.to('.path', 2, {y: 20, opacity: 0, delay: 6, ease:Expo.easeOut, onComplete: function(){
      $('#eventsBottomRight').empty();
      next();
    }});
  });
}
  
streamEventHandler = function(e) {
  switch(e.type) {
         case 'path':
         console.log(e.user + ' has chosen the path of the ' + e.chosenPath);
         thePath(e);
         break;
         case 'test':
         console.log('Damn it feels good to be a gangsta');
         break;
         }
}
em.addListener('streamEvent', function(data) {
    streamEventHandler(data);
  }); 
}