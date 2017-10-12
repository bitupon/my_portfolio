(function() {// Avoid `console` errors in browsers that lack a console.
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});
    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
// Place any jQuery/helper plugins in here.

var s; 

$(function(){
	var windowHeight; 
	init(); 
	
	$( window ).resize(function() {
		init(); 
	});
	
	//$('[rel="popover"]').popover();
	
	$(window).scroll(function(e) {
        var winTop = $(window).scrollTop();
        var allSlides = $('.decades > .decade'); 
        
        $('#ScrollY').html(winTop);
		 
		activeSlide = Math.round(winTop / 1000)-1;
		
        if (activeSlide > -1) {
        	$('.bc-profile__nav li').removeClass('active').eq(activeSlide).addClass('active');
        }
    });
	
	$('.scroll-arrow').click( function () {
		$('html, body').animate({scrollTop: $('.decade2010').offset().top});
		$('.scroll-arrow').hide(); 
	}); 
	
	
	$('a[href^="#"]').on('click', function (e) {
	    e.preventDefault();
	    console.log(e); 
	    var target = this.hash;
	    var $target = $(target);
	    console.log($(this).attr('data-position')); 
	    $('html, body').stop().animate({
	        'scrollTop': $(this).attr('data-position')
	    }, 900, 'swing');
	});
	
	// $('.popover-markup.share-social>.trigger').popover({
	// 	html: true,
	// 	title: '',
	// 	content: function () {
	// 		return $(this).parent().find('.content').html();
	// 	},
	// 	placement: 'left'
	// });
	
	// $('.popover-markup>.trigger').popover({
	// 	html: true,
	// 	title: function () {
	// 		return $(this).parent().find('.title').html();
	// 	},
	// 	content: function () {
	// 		return $(this).parent().find('.content').html();
	// 	},
	// 	placement: 'right'
	// });
	
	function init() {
		
		if ($(window).width() < 950 || $('html').hasClass('lt-ie9') ) {
			if ( typeof s !== "undefined" && s) {
				s.destroy(); 
			}
			$('html').removeClass('js').addClass('no-js no-js-mode'); 
		} else {
			$('html').removeClass('no-js').removeClass('no-js-mode').addClass('js'); 
		}
		
		if ($('html').hasClass('no-js')) return; 
		
		windowHeight = $(window).height();
		
		$('.bc-profile .bc-profile__nav').remove();
		$('.bc-profile').append('<nav class="bc-profile__nav"><ul></ul></nav>');
		
		s = skrollr.init();
	
		//This is the main meat of the app 
		var YPos = 0;
		$('.decades > .decade').each( function (index, el) {
			YPos += 2000; 			
			$('.bc-profile .bc-profile__nav > ul').append('<li><a class="bc-profile__nav-item" data-position="'+YPos+'" href="#'+$(this).attr('id')+'"><span class="bc-profile__nav-title">'+$(this).data('nav')+'</span></a></li>'); 
		}); 
		
		var navOffset = ( windowHeight - $('.bc-profile__nav > ul').height() ) /2; 
		$('.bc-profile__nav > ul').css('top', navOffset); 

		$('.bc-profile__nav li').removeClass('active').eq(0).addClass('active');

		return;
	}
});
function test_script2(){
	console.log('test test')
}