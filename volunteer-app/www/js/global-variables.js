/*
	global variables & functions used throughout
*/

	// api urls
	var apiBaseUrl = 'http://powertochangeadmin.stage2.reason.digital/api/v1/';

	// api url generator
	var api = function(url) {
		return apiBaseUrl + url;
	}

	// shout - show a quick, non-intrusive popup message to the user
	// e.g. shout('<p>Hello!</p>', 1500);
	var shout = function(content, pause) {
		if (typeof pause == 'undefined') {pause = 1500}

		// remove any existing shout
		$('.shout').remove();

		// element variables				
		var randomNumber = Math.floor((Math.random() * 999) + 1);
		$('<div class="shout hidden shout-' + randomNumber + '"></div>').appendTo('body');
		$shout = $('.shout-' + randomNumber);
		$('<div class="shout-content"></div>').appendTo($('.shout-' + randomNumber));
		$shoutContent = $('.shout-' + randomNumber + ' .shout-content');

		// setup shout
		$('.shout-' + randomNumber).removeClass('hidden');
		$('.shout-' + randomNumber + ' .shout-content').css({
			transform: 'scale(2)',
			opacity: 0
		}).html(content);

		// show shout
		setTimeout(function(){
			$('.shout-' + randomNumber + ' .shout-content').css({
				opacity: 1,
				transform: 'scale(1)'
			});
		}, 300);

		// hide shout
		setTimeout(function(){
			$('.shout-' + randomNumber + ' .shout-content').css({
				opacity: 0,
				transform: 'scale(3)',			
			});
		}, 600 + pause);

		// fully hide shout
		setTimeout(function(){
			$('.shout-' + randomNumber).addClass('hidden');
		}, 600 + pause + 300);

	} 