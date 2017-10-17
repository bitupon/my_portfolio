$(function(){
	function initEvents(){
		$('.bc-profile__nav .bc-profile__nav-item').on('click',function(e){
			e.preventDefault();
			$('.bc-profile__nav .bc-profile__nav-item').removeClass('active');
			$(this).addClass('active')

			console.log($($(this).attr('href')).position().top);
			$('.bc-profile').animate({
				scrollTop: $($(this).attr('href')).position().top
			}, 500);
			return false;

		});


		$(window).scroll(function(e) {
			var curScrollPos = $(window).scrollTop();
			var allSlides = $('.decades > .decade'); 
			
		//	$('#ScrollY').html(winTop);
			
			activeSlide = Math.round(winTop / 1000)-1;
			
			if (activeSlide > -1) {
				$('.bc-profile__nav li').removeClass('active').eq(activeSlide).addClass('active');
			}
		});
	}


	$(document).ready(function(){
		initEvents();
	})
}())