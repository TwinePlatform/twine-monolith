/*
* CONTENTS
*
* edit log controller
*   setup datepickers
*   variables
*   show loader
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
			>> populate organisation dropdown
		*/

			$scope.organisations = [];
			$http({
				method: 'GET',
				url: api('regions/' + $localStorage.user.region_id + '/organisations')
			}).success(function (result) {
				// console.log(result.data);
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
			console.log($scope.logId);

			// get log from api
			$http({
				method: 'GET',
				url: api('logs/' + $scope.logId)
			}).success(function (result) {
				
				// set datepicker date
				var picker = $datepickerInput.pickadate('picker');
				var dateShort = result.data.date_of_log.substring(0,10)
				picker.set('select', dateShort, { format: 'yyyy-mm-dd' } );

				console.log(result);

				// add to scope
				$scope.formData = result.data;

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
					console.log('form valid');

					// show loader
					$ionicLoading.show();

					console.log($scope.formData);

					// >>> submit form
					$http({
						method: 'PUT',
						url: api('logs/' + $scope.formData.id),
						data: $.param($scope.formData),
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
					}).success(function(response) {

						console.log(response);

						// create log successful
						if (response.success) {

							console.log('edit log successful');

							// hide loader
							$ionicLoading.hide();

							// go back to view logs
							$state.go('tabs.view-logs');

							// shout success
							shout('Log saved succesfully!');

							// refresh dashboard
							// $rootScope.$broadcast('refreshDashboard');

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
					console.log('form invalid');
				}

			};


	}])