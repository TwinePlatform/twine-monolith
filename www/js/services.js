/*
* CONTENTS
*
* services
*    options
*    constants
*    api
*      url
*      logs
*        delete
*        get logs
*        get log
*        edit log
*        new log
*      user
*        login
*        save user
*        register user
*        total hours
*      genders
*        get genders
*      regions
*        get regions
*      organisations
*        get organisations
*        summary
*    current time as string
*    click preventer
*      show
*      hide
*    form utilities
*      hours
*        get hours
*      minutes
*        get minutes
*      years
*        get years
*      process connection error
*    shout
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
	*/

		.factory('$$api', function($http, $$options, $$constants) {

			var $$api = {

				/*
					>>> url
					  generates an api url e.g. 'user' returns 'http://powertochangeadmindev.stage2.reason.digital/api/v1/user'
		              the environment can be set in $$options above
				*/

					url: function(url) {
						return $$constants.apiBaseUrl[$$options.environment] + url;
					},

				/*
					>>> logs
				*/

					logs: {

						/*
							>>>> delete
						*/

							delete: function(id) {
								return $http({
									method: 'DELETE',
								  	url: $$api.url('logs/' + id)
								});
							},

						/*
							>>>> get logs
						*/

							getLogs: function(userId) {
								return $http({
									method: 'GET',
									url: $$api.url('logs/user/' + userId)
								});
							},

						/*
							>>>> get log
						*/

							getLog: function(logId) {
								return $http({
									method: 'GET',
									url: $$api.url('logs/' + logId)
								});
							},

						/*
							>>>> edit log
						*/

							edit: function(logId, data) {
								return $http({
									method: 'PUT',
									url: $$api.url('logs/' + logId),
									data: data,
									headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
								});
							},

						/*
							>>>> new log
						*/

							new: function(data) {
								return $http({
									method: 'POST',
									url: $$api.url('logs'),
									data: data,
									headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
								});
							},

					},

				/*
					>>> user
				*/

					user: {

						/*
							>>>> login
						*/

							login: function(data) {
								return $http({
									method: 'POST',
									url: $$api.url('users/login'),
									data: data,
									headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
								});
							},

						/*
							>>>> save user
						*/

							save: function(userId, data) {
								return $http({
									method: 'PUT',
									url: $$api.url('users/' + userId),
									data: data,
									headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
								});
							},

						/*
							>>>> register user
						*/

							register: function(data) {
								return $http({
									method: 'POST',
									url: $$api.url('users'),
									data: data,
									headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
								});
							},

						/*
							>>>> total hours
						*/

							totalHours: function(userId, days) {
								// if days have been specified, grab last x days
								if (days) {
									var url = $$api.url('logs/user/' + userId + '/total/days/' + days)
								}
								// else just grab overall total hours
								else {
									var url = $$api.url('logs/user/' + userId + '/total')
								}
								return $http({
									method: 'GET',
									url: url
								});
							},

					},

				/*
					>>> genders
				*/

					genders: {

						/*
							>>>> get genders
						*/

							get: function() {
								return $http({
									method: 'GET',
									url: $$api.url('genders')
								});
							}

					},

				/*
					>>> regions
				*/

					regions: {

						/*
							>>>> get regions
						*/

							get: function() {
								return $http({
									method: 'GET',
									url: $$api.url('regions')
								});
							}

					},

				/*
					>>> organisations
				*/

					organisations: {

						/*
							>>>> get organisations
						*/

							get: function(regionId) {
								return $http({
									method: 'GET',
									url: $$api.url('regions/' + regionId + '/organisations')
								});
							},

						/*
							>>>> summary
						*/

							summary: function(organisationId) {
								return $http({
									method: 'GET',
									url: $$api.url('organisations/' + organisationId + '/summary')
								})
							} 

					},

			}

			return $$api;

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

		.factory('$$form', function($ionicLoading, $$options, $$constants, $$shout) {

			return {

				/*
					>>> hours
				*/

					hours: {

						/*
							>>>> get hours
						*/

							get: function() {
								var hours = [];
								var lowestHour = 0,
									highestHour = 24;
								while(lowestHour <= highestHour) {
									hours.push({ value: lowestHour, name: lowestHour + ' hours' });
									lowestHour++;
								}

								return hours;
							}

					},

				/*
					>>> minutes
				*/

					minutes: {

						/*
							>>>> get minutes
						*/

							get: function() {
								var minutes = [];
								var lowestMinute = 0,
									highestMinute = 55;
								while(lowestMinute <= highestMinute) {
									minutes.push({ value: lowestMinute, name: lowestMinute + ' minutes' });
									lowestMinute += 5;
								}

								return minutes;
							}

					},

				/*
					>>> years
				*/

					years: {

						/*
							>>>> get years
						*/

							get: function() {
								var years = [];

								var highestYear = new Date().getFullYear(),
									lowestYear = highestYear - 110;

								while(highestYear >= lowestYear) {
									years.push(highestYear--);
								}

								return years;
							}

					},

				/*
					>>> process connection error
				*/

					processConnectionError: function(data, error) {

						// hide loader
						$ionicLoading.hide();

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
