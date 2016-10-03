/*
* CONTENTS
*
* filters
*   hours and minutes as string
*   hours and minutes as object
*/

/*
	> filters
*/

angular.module('app.filters', [])

	/*
		>> hours and minutes as string
		   e.g. "215" returns "3 hrs and 35 min"
	*/

		.filter('hoursAndMinutesAsString', function(hoursAndMinutesAsObjectFilter) {
			return function(value){

				var hoursAndMinutesAsObject = hoursAndMinutesAsObjectFilter(value);
				var hours = hoursAndMinutesAsObject.hours;
				var hoursUnit = hours > 1 ? 'hrs' : 'hr';
				var minutes = hoursAndMinutesAsObject.minutes;
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
		})

	/*
		>> hours and minutes as object
		   e.g. "215" returns { hours: 3, minutes: 35 }
	*/

		.filter('hoursAndMinutesAsObject', function() {
			return function(minutesRaw) {

				var hours = Math.floor( minutesRaw / 60);          
			    var minutes = minutesRaw % 60;
			    return { hours: hours, minutes: minutes};

			}
		})

	/*
		>> minutes from hours and minutes
	*/

		.filter('minutesFromHoursAndMinutes', function() {
			return function(hours, minutes) {
				return (hours * 60) + minutes;
			}
		})



