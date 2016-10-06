/*
* CONTENTS
*
* new log controller
*    store the form data
*    setup datepickers
*    populate hours dropdown
*    populate minutes dropdown
*    calculate duration
*    populate user_id field
*    process the new log form
*      validate form
*      submit form
*    push to offline data
*/

/*
	> new log controller
*/

	angular.module('app.controllers').controller('NewLogController', ['$scope', '$stateParams', '$http', '$state', '$filter', '$ionicLoading', '$localStorage', '$rootScope', '$$api', '$$utilities', '$$shout', '$$offline', 
	function ($scope, $stateParams, $http, $state, $filter, $ionicLoading, $localStorage, $rootScope, $$api, $$utilities, $$shout, $$offline) {

		/*
			>> store the form data
		*/

			$scope.formData = {};


		/*
			>> setup datepickers
		*/

			$('#createLog .datepicker').pickadate({
				date: new Date(),
				container: '.datepicker-container',
				clear: false,
				onStart: function () {
					// set date to today initially
				    var date = new Date();
				    this.set('select', [date.getFullYear(), date.getMonth(), date.getDate()] )

				    // add date to scope in correct format
				    $scope.formData.date_of_log = $filter('date')(this.component.item.select.pick, 'yyyy-MM-dd');

				    // add current time
				    $scope.formData.date_of_log = $scope.formData.date_of_log + ' ' + $$utilities.getCurrentTimeAsString();
				},
				onSet: function(context) {
					// add date to scope in correct format
					$scope.formData.date_of_log = $filter('date')(context.select, 'yyyy-MM-dd');

					// add current time
					$scope.formData.date_of_log = $scope.formData.date_of_log + ' ' + $$utilities.getCurrentTimeAsString();
				}
			});


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

			$scope.formData.duration = 0;

			$scope.calculateDuration = function(hours, minutes) {
				
				// set minutes to 0 if hours == 24
				if (hours === 24) {
					$scope.formData.minutes = 0;
					minutes = 0;
				}

				// get total minutes integer & update form
				$scope.formData.duration = $filter('minutesFromHoursAndMinutes')(hours, minutes);

			}


		/*
			>> populate user_id field
		*/

			$scope.formData.user_id = $localStorage.user.id;


		/*
			>> process the new log form
		*/

			$scope.formSubmitted = false;
			$scope.processForm = function(form) {

				// >>> validate form

				// variable to show that form was submitted
				$scope.formSubmitted = true;

				// form is valid
				if (form.$valid) {

					// log sent form data
					console.log('$scope.formData: ', $scope.formData);

					// show loader
					$ionicLoading.show();

					// if offline mode active, push to offline data
					if ($rootScope.offlineMode) {

						// push to offline data, mark as 'needs_pushing'
						$scope.newLogOffline($scope.formData, true, 'Log saved offline.');

					}

					// not offline mode, submit the form
					else {

						// >>> submit form
						$$api.logs.new($.param($scope.formData)).success(function (result) {


							// hide loader
							$ionicLoading.hide();

							// create log successful
							if (result.success) {

								// push to offline data
								$scope.newLogOffline(result.data);

								$$shout('Log saved.');

							}

							// create log unsuccessful
							else {

								$$shout('Could not create log.');

							}

						}).error(function(data, error) {

							// enable offline mode
							$$offline.enable();

							// push to offline data and mark as 'needs_pushing'
							$scope.newLogOffline($scope.formData, true, 'Log saved offline.');

							// process connection error
							$$utilities.processConnectionError(data, error);

						});

					}
				}
				// form is invalid
				else {
					
				}

			};


		/*
			>> push to offline data
		*/

			$scope.newLogOffline = function(data, needs_pushing, message) {

				// hide loader
				$ionicLoading.hide();

				if (needs_pushing === undefined) {
					needs_pushing = false;
				}

				// push to offline data
				$$offline.newLog(data, needs_pushing);

				// shout message
				if (message !== undefined) {
					$$shout(message);
				}

				// go back to dashboard
				$state.go('tabs.dashboard');

			}
			

	}])