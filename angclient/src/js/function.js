$(document).ready(function() {

	/* MAIN MENU */
	$('#main-menu > li:has(ul.sub-menu)').addClass('parent');
	$('ul.sub-menu > li:has(ul.sub-menu) > a').addClass('parent');

	$('#menu-toggle').click(function() {
		$('#main-menu').slideToggle(300);
		return false;
	});

	$('#main-menu li').click(function() {
		if ($('#menu-toggle').css('display') !== 'none') {
			$('#main-menu').slideToggle(300);
			return false;
		}
	});

	$(window).resize(function() {
		if ($(window).width() > 760) {
			$('#main-menu').removeAttr('style');
		}
	});

});

function toggleMenu () {
	if ($('#menu-toggle').css('display') !== 'none') {
		$('#main-menu').slideToggle(300);
		//alert('visible');
		return false;
	}
	else {
		//alert('not visible');
	}
}