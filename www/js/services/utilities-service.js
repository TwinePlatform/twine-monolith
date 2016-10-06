/*
* CONTENTS
*
* utilities service
*    get years options
*    get hours options
*    get minutes options
*    get current time as string
*    get current date and time as string
*    process connection error
*/

/*
	> utilities service
	  - general utility functions
*/

	angular.module('app.services').factory('$$utilities', function($ionicLoading, $filter, $$shout) {

		return {

			/*
				>> get years options
			*/

				getYearsOptions: function() {
					years = [];
					var highestYear = new Date().getFullYear(),
						lowestYear = highestYear - 110;
					while(highestYear >= lowestYear) {
						years.push(highestYear--);
					}
					return years;
				},

			/*
				>> get hours options
			*/

				getHoursOptions: function() {
					var hours = [];
					var lowestHour = 0,
						highestHour = 24;
					while(lowestHour <= highestHour) {
						hours.push({ value: lowestHour, name: lowestHour + ' hours' });
						lowestHour++;
					}

					return hours;
				},

			/*
				>> get minutes options
			*/

				getMinutesOptions: function() {
					var minutes = [];
					var lowestMinute = 0,
						highestMinute = 55;
					while(lowestMinute <= highestMinute) {
						minutes.push({ value: lowestMinute, name: lowestMinute + ' minutes' });
						lowestMinute += 5;
					}

					return minutes;
				},

			/*
				>> get current time as string
				   - in format HH:MM:SS
			*/

				getCurrentTimeAsString: function() {
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
				},

			/*
				>> get current date and time as string
				   - in format YYYY-MM-DD HH:MM:SS
			*/

				getCurrentDateAndTimeAsString: function() {
					var date = new Date();
					return $filter('date')(date, 'yyyy-MM-dd HH:mm:ss');
				},

			/*
				>> process connection error
			*/

				processConnectionError: function(data, error) {

					// hide loader
					$ionicLoading.hide();

					// no internet connection
					if (error === 0) {
						// $$shout('Could not connect. Please check your internet connection & try again.', 3000);
					}
					// resource not found
					else if (error === 404) {
						// $$shout('Could not connect. Please check your internet connection & try again.', 3000);
					}
					// other error
					else {
						// $$shout('Could not connect. Please check your internet connection & try again.', 3000);
					}

				}

		}

	})