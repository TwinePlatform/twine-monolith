/*
* CONTENTS
*
* utilities service
*    setup localstorage
*    get years options
*    get hours options
*    get minutes options
*    get current time as string
*    get current date and time as string
*    get date - first of month
*    sql date to js date
*    js date to sql date
*    js date to sql date and time
*    process connection error
*    zero pad number
*/

/*
	> utilities service
	  - general utility functions
*/

	angular.module('app.services').factory('$$utilities', function(
		$localStorage, $ionicLoading, $filter, $rootScope, $state,
		$$shout, $$api
	) {

		var $$utilities = {

			/*
				>> setup localstorage
			*/

				setupLocalStorage: function() {

					// either enable or disable offline mode
					if ($localStorage.offlineMode) {
						$rootScope.offlineMode = true;
					}
					else {
						$rootScope.offlineMode = false;
						$localStorage.offlineMode = false;
					}

					// setup empty $localStorage array for offline data
					if (!$localStorage.offlineData && $localStorage.user) {
						$localStorage.offlineData = {
							user_id: $localStorage.user.id,
							logs: []
						}
					}

				},

			/*
				>> get years options
			*/

				getYearsOptions: function() {
					var years = [],
						minAge = 16,
						highestYear = (new Date().getFullYear()) - minAge,
						lowestYear = highestYear - (110 - minAge);
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
				>> get date - first of month
				   - gets the first date of the current month, e.g if it's 23rd December 2016, it'll return:
				   - new Date(2016,11,1);
			*/

				getDateFirstOfMonth: function() {
					var d = new Date(),
						currentMonth = d.getMonth(),
						currentYear = d.getFullYear(),
						dateFirstOfMonth = new Date(currentYear,currentMonth,1);
					return dateFirstOfMonth;
				},

			/*
				>> sql date to js date
				   - e.g. an input of 2016-11-25 13:12:01 will return new Date(2016,10,25,13,12,01)
			*/

				sqlDateToJSDate: function(sqlDate) {
					// split timestamp into [ Y, M, D, h, m, s ]
					var sqlDateArray = sqlDate.split(/[- :]/);

					// apply each elemetn to the date function
					var jsDate = new Date(Date.UTC(sqlDateArray[0], sqlDateArray[1]-1, sqlDateArray[2], sqlDateArray[3], sqlDateArray[4], sqlDateArray[5]));

					return jsDate;
				},

			/*
				>> js date to sql date
				   - e.g. an input of new Date(2016,10,25,13,12,01) will return 2016-11-25
			*/

				jsDateToSqlDate: function(jsDate) {

					var year = jsDate.getFullYear(),
						month = $$utilities.zeroPad(jsDate.getMonth() + 1, 2),
						day = $$utilities.zeroPad(jsDate.getDate(), 2),
						hours = $$utilities.zeroPad(jsDate.getHours(), 2),
						minutes = $$utilities.zeroPad(jsDate.getMinutes(), 2),
						seconds = $$utilities.zeroPad(jsDate.getSeconds(), 2);

					sqlDate = year + '-' + month + '-' + day;

					return sqlDate;
				},

			/*
				>> js date to sql date and time
				   - e.g. an input of new Date(2016,10,25,13,12,01) will return 2016-11-25 13:12:01
			*/

				jsDateToSqlDateAndTime: function(jsDate) {

					var year = jsDate.getFullYear(),
						month = $$utilities.zeroPad(jsDate.getMonth() + 1, 2),
						day = $$utilities.zeroPad(jsDate.getDate(), 2),
						hours = $$utilities.zeroPad(jsDate.getHours(), 2),
						minutes = $$utilities.zeroPad(jsDate.getMinutes(), 2),
						seconds = $$utilities.zeroPad(jsDate.getSeconds(), 2);

					sqlDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

					return sqlDateAndTime;
				},

			/*
				>> log out
			*/

				logOut: function(message) {
					$ionicLoading.hide();
					if (message) {
						$$shout(message);
					}
					delete $localStorage.user;
					delete $localStorage.offlineData;
					$$api.user.logout();
					$$api.token.clear();
					$state.go('login');
				},


			/*
				>> process connection error
			*/

				processConnectionError: function(result, error, message) {

					// hide loader
					$ionicLoading.hide();

					// if user does not exist, log user out
					if (error === 401) {
						$$utilities.logOut('Please log-in again');
					}
					else {

						// no internet connection
						if (error === 0) {
							$$shout('Could not connect. Please check your internet connection & try again.', 3000);
						}
						// resource not found
						else if (error === 404) {
							$$shout('Could not find what you were looking for', 3000);
						}
						// other error
						else {
							$$shout(message || 'Oops! Something went wrong.', 3000);
						}

					}

				},

			/*
				>> zero pad number
				   - adds leading zeroes to a number
			*/

				zeroPad: function(num, count) {
					var numZeropad = num + '';
					while(numZeropad.length < count) {
						numZeropad = "0" + numZeropad;
					}
					return numZeropad;
				}

		}

		return $$utilities;

	})
