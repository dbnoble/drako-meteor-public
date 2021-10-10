currSetColor = '';
currSetGlow = '';

$(function()
{
    $(document).on('click', '.btn-add-betOption', function(e)
    {
        e.preventDefault();

        var controlForm = $('.controls form:first'),
            currentbetentry = $(this).parents('.bet-cloner:first'),
            newbetentry = $(currentbetentry.clone()).insertAfter('.bet-entry:last');

        newbetentry.find('input').val('');
        controlForm.find('.bet-entry:not(:last) .btn-add-betOption')
            .removeClass('btn-add-betOption').addClass('btn-remove-betOption')
            .removeClass('btn-add').addClass('btn-remove')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');
    }).on('click', '.btn-remove-betOption', function(e)
    {
		$(this).parents('.bet-entry:first').remove();

		e.preventDefault();
		return false;
	});
});

$(function()
{
    $(document).on('click', '.btn-add-pollOption', function(e)
    {
        e.preventDefault();

        var controlForm = $('#adminPollTab .controls form:first'),
            currentpollentry = $(this).parents('.poll-cloner:first'),
            newpollentry = $(currentpollentry.clone()).insertAfter('.poll-entry:last');

        newpollentry.find('input').val('');
        controlForm.find('.poll-entry:not(:last) .btn-add-pollOption')
            .removeClass('btn-add-pollOption').addClass('btn-remove-pollOption')
            .removeClass('btn-add').addClass('btn-remove')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');
    }).on('click', '.btn-remove-pollOption', function(e)
    {
		$(this).parents('.poll-entry:first').remove();

		e.preventDefault();
		return false;
	});
});
  
$(function()
{

$('body').popover({
  container: '.sb-right',
  selector: '.item-info',
  viewport: '#inventoryTab',
  html: true,
  delay: { "show": 500, "hide": 100 },
  trigger: 'hover',
  placement: 'bottom'
});
  
$(document).popover({
  container: 'body',
  animation: true,
  selector: '.buff-item',
  html: true,
  delay: { "show": 500, "hide": 100 },
  trigger: 'hover',
  placement: 'bottom'
});
  
$('body').tooltip({
  container: 'body',
  animation: true,
  selector: '.chat-name',
  html: true,
  placement: 'top'
});
  
  
    $(document).on("change mousemove", "#slidey", function() {
      currSetColor = $(this).val();
      $('#color-preview').css({'color':'hsla(' + currSetColor + ', 88%, 60%)'});
    });
  
  $(document).on("change mousemove", "#glowslidey", function() {
      currSetGlow = $(this).val();
      $('#glow-preview').css({'text-shadow':'rgb(0,0,0) 0px 0px 4px,hsla(' + currSetGlow + ', 75%, 85%, 1) 0px 0px 4px, hsla(' + currSetGlow + ',60%,50%,1) 0px 0px 10px, hsla(' + currSetGlow + ', 60%, 50%, 1) 0px 0px 10px, hsla(' + currSetGlow + ', 60%, 50%, 1) 0px 0px 10px'});
    });

  
$('.scrollbar-macosx').not('.scrollbar-chat').scrollbar();

  
var abcedfg = 'zz';
  
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','//connect.facebook.net/en_US/fbevents.js');

fbq('init', '556076674508711');
fbq('track', "PageView");

  
});