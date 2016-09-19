/*
* CONTENTS
*
* edit log controller
*   setup datepickers
*   variables
*   show loader
*   populate hours dropdown
*   populate minutes dropdown
*   populate organisation dropdown
*    loop through the results and push only required items to $scope.organisations
*   get log data
*   function: generate form date
*   process the form
*    validate form
*    submit form
*/

/*
	> edit log controller
*/

	angular.module('app').controller('EditLogController', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$filter', '$localStorage', '$rootScope', 
	function ($scope, $stateParams, $state, $http, $ionicLoading, $filter, $localStorage, $rootScope) {

		/*
			>> setup datepickers
		*/

			var $datepickerInput = $('#editLog .datepicker').pickadate({
				container: '.datepicker-container',
				onSet: function(context) {
					// add date to scope in correct format
					$scope.formData.date_of_log = $filter('date')(context.select, 'yyyy-MM-dd');

					// add current time
					$scope.formData.date_of_log = $scope.formData.date_of_log + ' ' + getCurrentTime();
				}
			});

		/*
			>> variables
		*/

			$scope.formData = {};
			$scope.organisationsLoaded = false;
			$scope.logLoaded = false;

		/*
			>> show loader
		*/

			$ionicLoading.show();


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
		*/

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

				// get total minutes integer & update form
				$scope.formData.duration = getMinutes(hours, minutes);

			}

		/*
			>> populate organisation dropdown
		*/

			$scope.organisations = [];
			$http({
				method: 'GET',
				url: api('regions/' + $localStorage.user.region_id + '/organisations')
			}).success(function (result) {

				$scope.organisations = result.data;
				// >>> loop through the results and push only required items to $scope.organisations
				for (var i = 0, len = result.data.length; i < len; i++) {
					$scope.organisations[i] = {id: result.data[i].id, name: result.data[i].name};

					// when for loop complete
					if (i === len - 1) {

						setTimeout(function(){

							$scope.organisationsLoaded = true;

							// get user's organisation id
							var orgId = parseInt($localStorage.user.organisation_id);

							// get position of user's organsation in $scope.organisations array
							var organisationPosition = $scope.organisations.map(function(x) {return x.id; }).indexOf(orgId);

							// set the value of formData.organisation to that item
							$scope.formData.organisation = $scope.organisations[organisationPosition];

							// hide loader
							$ionicLoading.hide();

						}, 50);

					}
				}

			}).error(function (result, error) {
				
				// hide loader
				$ionicLoading.hide();

				// process connection error
				processConnectionError(result, error);

			});

		/*
			>> get log data
		*/

			// get log id
			$scope.logId = $state.params.id;

			// get log from api
			$http({
				method: 'GET',
				url: api('logs/' + $scope.logId)
			}).success(function (result) {
				
				// set datepicker date
				var picker = $datepickerInput.pickadate('picker');
				var dateShort = result.data.date_of_log.substring(0,10)
				picker.set('select', dateShort, { format: 'yyyy-mm-dd' } );

				// add to scope
				$scope.formData = result.data;

				// preselect the correct hours and minutes based on duration (in raw minutes)
				var hoursAndMinutes = getHoursAndMinutes($scope.formData.duration);
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
				
				// hide loader
				$ionicLoading.hide();

				// process connection error
				processConnectionError(result, error);

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
			>> process the form
		*/

			$scope.formSubmitted = false;
			$scope.processForm = function(form) {

				// >>> validate form

				// variable to show that form was submitted
				$scope.formSubmitted = true;

				// form is valid
				if (form.$valid) {

					// show loader
					$ionicLoading.show();

					// >>> submit form
					$http({
						method: 'PUT',
						url: api('logs/' + $scope.formData.id),
						data: $.param($scope.formData),
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
					}).success(function(response) {

						// create log successful
						if (response.success) {

							// hide loader
							$ionicLoading.hide();

							// go back to view logs
							$state.go('tabs.view-logs');

							// shout success
							shout('Log saved succesfully!');

						}

						// create log unsuccessful
						else {

							shout('Edit log unsuccessful');

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