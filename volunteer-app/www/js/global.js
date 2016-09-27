/*
* CONTENTS
*
* global variables & functions used throughout
*   api urls
*   api url generator
*   shout - show a quick, non-intrusive popup message to the user
*   process connection errors
*   sort by - sort an array of objects by object value
*   get current time - in string in format HH:MM:SS
*   get minutes - get minutes as an integer
*   get hours & minutes
*   get hours & minutes (as string)
*/

/*
	> global variables & functions used throughout
*/

	/*
		>> api urls
	*/

		var apiBaseUrl = 'http://powertochangeadmindev.stage2.reason.digital/api/v1/'; // dev
		// var apiBaseUrl = 'http://powertochangeadmin.stage2.reason.digital/api/v1/'; // stage

	/*
		>> api url generator
	*/

		var api = function(url) {
			return apiBaseUrl + url;
		}

	/*
		>> shout - show a quick, non-intrusive popup message to the user
		e.g. shout('<p>Hello!</p>', 1500);
	*/

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


	/*
		>> process connection errors
	*/

		var processConnectionError = function(data, error) {

			console.log(error);

			// no internet connection
			if (error === 0) {
				shout('Could not connect. Please check your internet connection & try again.', 3000);
			}
			// resource not found
			else if (error === 404) {
				shout('Could not connect. Please check your internet connection & try again.', 3000);
			}
			// other error
			else {
				shout('Could not connect. Please check your internet connection & try again.', 3000);
			}

		}


	/*
		>> sort by - sort an array of objects by object value
	*/

		var sortBy = function(field, reverse, primer){

		   var key = primer ? 
		       function(x) {return primer(x[field])} : 
		       function(x) {return x[field]};

		   reverse = !reverse ? 1 : -1;

		   return function (a, b) {
		       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
		     } 
		}


	/*
		>> get current time - in string in format HH:MM:SS
	*/

		var getCurrentTime = function() {

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
			
		}


	/*
		>> get minutes - get minutes as an integer
	*/

		var getMinutes = function(hours, minutes) {
			return (hours * 60) + minutes;
		}


	/*
		>> get hours & minutes
	*/

		var getHoursAndMinutes = function(minutesInteger) {
			var hours = Math.floor( minutesInteger / 60);          
		    var minutes = minutesInteger % 60;
		    return { hours: hours, minutes: minutes};
		}
		
	/*
		>> get hours & minutes (as string)
	*/

		var getHoursAndMinutesAsString = function(minutesInteger) {
			var hoursAndMinutesObject = getHoursAndMinutes(minutesInteger);
			var hours = hoursAndMinutesObject.hours;
			var hoursUnit = hours > 1 ? 'hrs' : 'hr';
			var minutes = hoursAndMinutesObject.minutes;
			var hoursAndMinutesString = '';
			// if there's more than 0 hours
			if (hours > 0) {
				hoursAndMinutesString += '<span class="hours">' + hours + ' <span class="unit">' + hoursUnit + '</span></span>';
				// if there are minutes as well, add a space at the end
				if (minutes > 0) {
					hoursAndMinutesString += ' ';
				}
			}
			// if there's more than 0 minutes
			if (minutes > 0) {
				hoursAndMinutesString += '<span class="minutes">' + minutes + ' <span class="unit">min</span></span>';
			}
			// if there are 0 hours or minutes
			if (hours === 0 && minutes === 0) {
				hoursAndMinutesString = '<span class="hours">' + hours + ' <span class="unit">hours</span></span>';
			}
			return hoursAndMinutesString;
		}
