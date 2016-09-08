/*
* CONTENTS
*
* new log controller
*   store the form data
*   function: generate form date
*   get today's date for raw date field
*   populate organisation dropdown
*    loop through the results and push only required items to $scope.organisations
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
				onStart: function () {
					// set date to today initially
				    var date = new Date();
				    this.set('select', [date.getFullYear(), date.getMonth(), date.getDate()] )
				    console.log(this);

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
			>> populate organisation dropdown
		*/

			$scope.organisations = [];
			$http({
				method: 'GET',
				url: api('organisations')
			}).success(function (result) {
				// console.log(result.data);
				$scope.organisations = result.data;
				// >>> loop through the results and push only required items to $scope.organisations
				for (var i = 0, len = result.data.length; i < len; i++) {
					$scope.organisations[i] = {id: result.data[i].id, name: result.data[i].name};

					// when for loop complete
					if (i === len - 1) {

						// get user's organisation id
						var orgId = parseInt($localStorage.user.organisation_id);

						// get position of user's organsation in $scope.organisations array
						var organisationPosition = $scope.organisations.map(function(x) {return x.id; }).indexOf(orgId);

						// set the value of formData.organisation to that item
						$scope.formData.organisation = $scope.organisations[organisationPosition];

					}
				}

			}).error(function (result, error) {
				
				// process connection error
				processConnectionError(result, error);

			});

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
					console.log('form valid');

					// generate organisation_id before we submit form
					$scope.formData.organisation_id = $scope.formData.organisation.id;

					// show loader
					$ionicLoading.show();

					console.log('form data:');
					console.log($scope.formData);

					// >>> submit form
					$http({
						method: 'POST',
						url: api('logs'),
						data: $.param($scope.formData),
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
					}).success(function(response) {

						console.log(response);

						// create log successful
						if (response.success) {

							console.log('create log successful');

							// refresh dashboard
							// $rootScope.$broadcast('refreshDashboard');

							// hide loader
							$ionicLoading.hide();

							// shout success
							shout('Log saved succesfully!');

							// go back to dashboard
							$state.go('tabs.dashboard');

						}

						// create log unsuccessful
						else {

							console.log('create log unsuccessful');

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