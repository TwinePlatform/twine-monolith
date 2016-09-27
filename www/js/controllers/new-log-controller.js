/*
* CONTENTS
*
* new log controller
*   store the form data
*   setup datepickers
*   populate hours dropdown
*   populate minutes dropdown
*   calculate duration
*   populate user_id field
*   process the form
*    validate form
*    submit form
*/

/*
	> new log controller
*/

	angular.module('app').controller('NewLogController', ['$scope', '$stateParams', '$http', '$state', '$filter', '$ionicLoading', '$localStorage',  '$rootScope',  
	function ($scope, $stateParams, $http, $state, $filter, $ionicLoading, $localStorage, $rootScope) {

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
				    $scope.formData.date_of_log = $scope.formData.date_of_log + ' ' + getCurrentTime();
				},
				onSet: function(context) {
					// add date to scope in correct format
					$scope.formData.date_of_log = $filter('date')(context.select, 'yyyy-MM-dd');

					// add current time
					$scope.formData.date_of_log = $scope.formData.date_of_log + ' ' + getCurrentTime();
				}
			});


		/*
			>> populate hours dropdown
		*/

			$scope.hours = [];
			var lowestHour = 0,
				highestHour = 24;
			while(lowestHour <= highestHour) {
				$scope.hours.push({ value: lowestHour, name: lowestHour + ' hours' });
				lowestHour++;
			}


		/*
			>> populate minutes dropdown
		*/

			$scope.minutes = [];
			var lowestMinute = 0,
				highestMinute = 55;
			while(lowestMinute <= highestMinute) {
				$scope.minutes.push({ value: lowestMinute, name: lowestMinute + ' minutes' });
				lowestMinute += 5;
			}

		/*
			>> calculate duration
			   .. in an integer of minutes based on the hours and minutes dropdowns
		*/

			$scope.formData.duration = 0;

			$scope.calculateDuration = function() {
				
				var hours = 0,
					minutes = 0;
				
				// get hours from form
				if (angular.isDefined($scope.formData.hours) && $scope.formData.hours !== null) {
					hours = $scope.formData.hours.value;
				}

				// get minutes from form
				if (angular.isDefined($scope.formData.minutes) && $scope.formData.minutes !== null) {
					minutes = $scope.formData.minutes.value;
				}

				// set minutes to 0 if hours == 24
				if (hours === 24) {
					$scope.formData.minutes = 0;
				}

				// get total minutes integer & update form
				$scope.formData.duration = getMinutes(hours, minutes);

			}


		/*
			>> populate user_id field
		*/

			$scope.formData.user_id = $localStorage.user.id;


		/*
			>> process the form
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

					// >>> submit form
					$http({
						method: 'POST',
						url: api('logs'),
						data: $.param($scope.formData),
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
					}).success(function(response) {

						// create log successful
						if (response.success) {

							// hide loader
							$ionicLoading.hide();

							// shout success
							shout('Log saved succesfully!');

							// go back to dashboard
							$state.go('tabs.dashboard');

						}

						// create log unsuccessful
						else {

							shout('Could not create log.');

						}

					}).error(function(data, error) {

						// hide loader
						$ionicLoading.hide();

						// process connection error
						processConnectionError(data, error);

					});
				}
				// form is invalid
				else {
					
				}

			};
			

	}])