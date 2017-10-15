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
	}


	$(document).ready(function(){
		initEvents();
	})
}())