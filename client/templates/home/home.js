Template.home.helpers({
    stream: function () {
      return Stream.findOne({channel: 'drako_gaming'});
    }
});

Template.home.onRendered(function() {
   Meteor.setTimeout(function(){
    $('.homeContainer').parent().css('background-color', 'rgb(15,15,15)');
    var total = 70 ;
    var w = $(".homeContainer").width();
    var h = $(".homeContainer").height();
 
    for (i=0; i<total; i++){ 
      $(".homeContainer").append('<div class="dot"></div>');
      TweenMax.set($(".dot")[i],{x:R(w),y:R(h),opacity:0,force3D:"auto"});
      animm($(".dot")[i]);
    } 
    
    function animm(elm){ 
      TweenMax.to(elm,(R(20)*5)+5,
                  {bezier:{values:[{x:R(w),y:R(h)},{x:R(w),y:R(h)}]},opacity:R(1),scale:R(1)+0.5,
                   onComplete:function(){TweenMax.delayedCall(R(2),animm,[elm])}
                  });
    };

    function R(max) {return Math.random()*max}
     }, 5);
});