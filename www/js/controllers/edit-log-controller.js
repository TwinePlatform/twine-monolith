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
*    display log data
*    get log data
*    function: generate form date
*    process the edit log form
*      validate form
*      submit edit log form
*/

/*
	> edit log controller
*/

	angular.module('app.controllers').controller('EditLogController', function (
		$scope, $stateParams, $state, $http, $ionicLoading, $filter, $localStorage, $rootScope, 
		$$api, $$utilities, $$shout, $$offline
	) {

		/*
			>> variables
		*/

			$scope.formData = {};
			$scope.logLoaded = false;

		/*
			>> setup datepickers
		*/

			var $datepickerInput = $('.editLog .datepicker').pickadate({
				min: $$utilities.getDateFirstOfMonth(),
				container: '.datepicker-container',
				clear: false,
				onSet: function(context) {
					// add date to scope in correct format
					$scope.formData.date_of_log = $filter('date')(context.select, 'yyyy-MM-dd');

					// add current time
					$scope.formData.date_of_log = $scope.formData.date_of_log + ' ' + $$utilities.getCurrentTimeAsString();
				}
			});


		/*
			>> show loader
		*/

			$ionicLoading.show();


		/*
			>> populate hours dropdown
		*/

			$scope.hours = $$utilities.getHoursOptions();


		/*
			>> populate minutes dropdown
		*/

			$scope.minutes = $$utilities.getMinutesOptions();

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
			>> display log data
		*/

			$scope.displayLogData = function(result) {

				console.log('result: ', result);

				// set datepicker date
				var picker = $datepickerInput.pickadate('picker');
				var dateShort = result.data.date_of_log.substring(0,10);
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

				// get the offline_id for this log from $localStorage
				var offlineLog =  $.grep($localStorage.offlineData.logs, function(e){ return e.id === $scope.formData.id; });
				$scope.formData.offline_id = offlineLog[0].offline_id;

				// log data has finished loading
				$scope.logLoaded = true;

				// hide loader
				$ionicLoading.hide();

			}


		/*
			>> get log data
		*/

			// if offline mode, edit offline log
			if ($rootScope.offlineMode) {

				var result = $$offline.getLog($state.params.offline_id);

				setTimeout(function(){
					$scope.displayLogData(result);
				}, 100);

			}

			// else get log from api
			else {

				// get log id
				$scope.logId = $state.params.id;

				// get log from api
				$$api.logs.getLog($scope.logId).success(function (result) {
					
					$scope.displayLogData(result);

				}).error(function (result, error) {
					
					// couldn't connect, send back to view logs and enable offline mode
					$state.go('tabs.view-logs');

					// process connection error
					$$utilities.processConnectionError(result, error);

				});

			}


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

					console.log('$scope.formData: ', $scope.formData);

					// show loader
					$ionicLoading.show();

					// if no internet connection, switch to offline mode
					if (!navigator.onLine) {
						$$offline.enable();
					}

					// if offline mode, save to offline data and marks as needs_pushing
					if ($rootScope.offlineMode) {

						// save offline
						$$offline.edit({ id: $scope.formData.offline_id, idKey: 'offline_id' }, $scope.formData, true);

						// hide loader
						$ionicLoading.hide();

						// go back to view logs
						$state.go('tabs.view-logs');

						// shout success
						$$shout('Log saved locally!');

					}

					// else save to api
					else {

						// >>> submit edit log form
						$$api.logs.edit($scope.formData.id, $.param($scope.formData)).success(function (result) {

							// create log successful
							if (result.success) {

								// hide loader
								$ionicLoading.hide();

								// save offline
								$$offline.edit({ id: $scope.formData.id, idKey: 'id' }, result.data);

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

							$$shout('Could not edit log. Please try again in offline mode.');

							// enable offline mode
							$$offline.enable();

							// go back to view logs
							$state.go('tabs.view-logs');

							// process connection error
							$$utilities.processConnectionError(data, error);

						});

					}

				}
				// form is invalid
				else {
					console.log('form invalid!!');
				}

			};

	})