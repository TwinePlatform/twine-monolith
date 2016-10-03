/*
* CONTENTS
*
* services
*   options
*   constants
*   api
*   current time as string
*   click preventer
*    show
*    hide
*   form utilities
*    process connection error
*   shout
*/

/*
	> services
*/

	angular.module('app.services', [])

	/*
		>> options
	*/

		.value('$$options', {
			environment: 'dev'	// dev | stage
		})

	/*
		>> constants
	*/

		.constant('$$constants', {
			apiBaseUrl: {
				dev:   'http://powertochangeadmindev.stage2.reason.digital/api/v1/',
				stage: 'http://powertochangeadmin.stage2.reason.digital/api/v1/'
			}
		})


	/*
		>> api
		   generates an api url e.g. 'user' returns 'http://powertochangeadmindev.stage2.reason.digital/api/v1/user'
		   the environment can be set in $$options above
	*/

		.factory('$$api', function($$options, $$constants) {
			return function(url) {
				return $$constants.apiBaseUrl[$$options.environment] + url;
			}
		})


	/*
		>> current time as string
	*/

		.value('$$currentTimeAsString', function() {
			var timeDate = new Date;
			var seconds = timeDate.getSeconds().toString();
			var minutes = timeDate.getMinutes().toString();
			var hour = timeDate.getHours().toString();

			// add zero padding
			if (seconds.length === 1) {
				seconds = '0' + seconds;
			}
			if (minutes.length === 1) {
				minutes = '0' + minutes;
			}
			if (hour.length === 1) {
				hour = '0' + hour;
			}

			var time = hour + ':' + minutes + ':' + seconds;
			return time;
		})


	/*
		>> click preventer

		   sometimes in cordova apps, a click (or tap) will fire twice, which means you will sometimes activate or
		   focus an element that you didn't want to. e.g. you tap Close on a popup, then the text input right
		   beneath where you tapped gets focussed after the popup closes. this service prevents that second 'ghost'
		   tap from activating anything
	*/

		.factory('$$clickPreventer', function() {

			return {

				/*
					>>> show
				*/

					show: function() {
						$('.click-preventer').removeClass('ng-hide');
					},

				/*
					>>> hide
				*/

					hide: function() {
						setTimeout(function(){
							$('.click-preventer').addClass('ng-hide');
						}, 300);
					}

			}

		})


	/*
		>> form utilities
	*/

		.factory('$$form', function($$options, $$constants, $$shout) {

			return {

				/*
					>>> process connection error
				*/

					processConnectionError: function(data, error) {

						console.log(error);

						// no internet connection
						if (error === 0) {
							$$shout('Could not connect. Please check your internet connection & try again.', 3000);
						}
						// resource not found
						else if (error === 404) {
							$$shout('Could not connect. Please check your internet connection & try again.', 3000);
						}
						// other error
						else {
							$$shout('Could not connect. Please check your internet connection & try again.', 3000);
						}

					}

			}

		})


	/*
		>> shout
		   show a quick, non-intrusive popup message to the user
			e.g. $$shout('<p>Hello!</p>', 1500);
	*/

		.factory('$$shout', function($$options, $$constants) {
			return function(content, pause) {

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
		})







		/*.factory('BlankFactory', [function(){

		}])

		.service('BlankService', [function(){

		}])*/