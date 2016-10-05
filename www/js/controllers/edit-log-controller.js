/*
* CONTENTS
*
* edit log controller
*    variables
*    setup datepickers
*    show loader
*    populate hours dropdown
*    populate minutes dropdown
*    calculate duration
*    get log data
*    function: generate form date
*    process the edit log form
*      validate form
*      submit edit log form
*/

/*
	> edit log controller
*/

	angular.module('app').controller('EditLogController', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$filter', '$localStorage', '$rootScope', '$$currentTimeAsString', '$$api', '$$form', '$$shout', 
	function ($scope, $stateParams, $state, $http, $ionicLoading, $filter, $localStorage, $rootScope, $$currentTimeAsString, $$api, $$form, $$shout) {

		/*
			>> variables
		*/

			$scope.formData = {};
			$scope.logLoaded = false;

		/*
			>> setup datepickers
		*/

			var $datepickerInput = $('#editLog .datepicker').pickadate({
				container: '.datepicker-container',
				clear: false,
				onSet: function(context) {
					// add date to scope in correct format
					$scope.formData.date_of_log = $filter('date')(context.select, 'yyyy-MM-dd');

					// add current time
					$scope.formData.date_of_log = $scope.formData.date_of_log + ' ' + $$currentTimeAsString();
				}
			});


		/*
			>> show loader
		*/

			$ionicLoading.show();


		/*
			>> populate hours dropdown
		*/

			$scope.hours = $$form.hours.get();


		/*
			>> populate minutes dropdown
		*/

			$scope.minutes = $$form.minutes.get();

		/*
			>> calculate duration
			   .. in an integer of minutes based on the hours and minutes dropdowns
		*/

			$scope.calculateDuration = function(hours, minutes) {
			
				// // set minutes to 0 if hours == 24
				if (hours === 24) {
					$scope.formData.minutes = 0;
					minutes = 0;
				}

				// get total minutes integer & update form
				$scope.formData.duration = $filter('minutesFromHoursAndMinutes')(hours, minutes);

			}

		/*
			>> get log data
		*/

			// get log id
			$scope.logId = $state.params.id;

			// get log from api
			$$api.logs.getLog($scope.logId).success(function (result) {
				
				// set datepicker date
				var picker = $datepickerInput.pickadate('picker');
				var dateShort = result.data.date_of_log.substring(0,10)
				picker.set('select', dateShort, { format: 'yyyy-mm-dd' } );

				// add to scope
				$scope.formData = result.data;

				// preselect the correct hours and minutes based on duration (in raw minutes)
				var hoursAndMinutes = $filter('hoursAndMinutesAsObject')($scope.formData.duration);
				var hours = hoursAndMinutes.hours;
				var minutes = hoursAndMinutes.minutes;

				// get position of hour in $scope.hours array
				var hourPosition = $scope.hours.map(function(x) {return x.value; }).indexOf(hours);

				// set the value of formData.hours to that item
				$scope.formData.hours = $scope.hours[hourPosition];

				// get position of minute in $scope.minutes array
				var minutePosition = $scope.minutes.map(function(x) {return x.value; }).indexOf(minutes);

				// set the value of formData.minutes to that item
				$scope.formData.minutes = $scope.minutes[minutePosition];

				// log data has finished loading
				$scope.logLoaded = true;

				// hide loader
				$ionicLoading.hide();

			}).error(function (result, error) {
				
				// process connection error
				$$form.processConnectionError(result, error);

			});


		/*
			>> function: generate form date
		*/
		
			// generate a date in the format 2017-08-30 and add to hidden date field
			$scope.generateFormDate = function() {
				var formDate = $filter('date')($scope.formData.dateRaw, 'yyyy-MM-dd');
				$scope.formData.date_of_log = formDate;
			}

		/*
			>> process the edit log form
		*/

			$scope.formSubmitted = false;
			$scope.processForm = function(form) {

				// >>> validate form

				// variable to show that form was submitted
				$scope.formSubmitted = true;

				// form is valid
				if (form.$valid) {

					// log form data
					console.log('$scope.formData: ', $scope.formData);

					// show loader
					$ionicLoading.show();

					// >>> submit edit log form
					$$api.logs.edit($scope.formData.id, $.param($scope.formData)).success(function (result) {

						// create log successful
						if (result.success) {

							// hide loader
							$ionicLoading.hide();

							// go back to view logs
							$state.go('tabs.view-logs');

							// shout success
							$$shout('Log saved succesfully!');

						}

						// create log unsuccessful
						else {

							$$shout('Edit log unsuccessful');

						}

					}).error(function(data, error) {

						// process connection error
						$$form.processConnectionError(data, error);

					});
				}
				// form is invalid
				else {
					
				}

			};

	}])