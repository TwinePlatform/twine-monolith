/*
* CONTENTS
*
* log hours controller
*   store the form data
*   function: generate form date
*   get today's date for raw date field
*   populate organisation dropdown
*    loop through the results and push only required items to $scope.organisations
*   process the form
*    validate form
*    submit form
*   process connection error
*/

/*
	> log hours controller
*/

	angular.module('app').controller('LogHoursController', ['$scope', '$stateParams', '$http', '$filter', '$ionicLoading', 
	function ($scope, $stateParams, $http, $filter, $ionicLoading) {

		/*
			>> store the form data
		*/

			$scope.formData = {};


		/*
			>> function: generate form date
		*/
		
			// generate a date in the format 2017-08-30 and add to hidden date field
			$scope.generateFormDate = function() {
				var formDate = $filter('date')($scope.formData.dateRaw, 'yyyy-MM-dd');
				$scope.formData.date = formDate;
			}


		/*
			>> get today's date for raw date field
		*/
		
			// get today's date
			$scope.today = new Date();

			// set the raw date field to today
			$scope.formData.dateRaw = $scope.today;

			// generate the form date
			$scope.generateFormDate();


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
				}
			}).error(function (result, error) {
				
				// process connection error
				$scope.processConnectionError(result, error);

			});

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

					// console.log($scope.formData);
					// console.log($.param($scope.formData));

					// show loader
					$ionicLoading.show();

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

							setTimeout(function(){

								// hide loader
								$ionicLoading.hide();

								// shout success
								shout('Log saved succesfully!');

							}, 200);

						}

						// create log unsuccessful
						else {

							console.log('create log unsuccessful');

						}

					}).error(function(data, error) {

						// process connection error
						$scope.processConnectionError(data, error);

					});
				}
				// form is invalid
				else {
					console.log('form invalid');
				}

			};

		/*
			>> process connection error
		*/

			$scope.processConnectionError = function(data, error) {

				// no internet connection
				if (error === 0) {
					$scope.connectionError = 'Could not connect. Please check your internet connection & try again.';
				}
				// resource not found
				else if (error === 404) {
					$scope.connectionError = 'Error: the requested resource was not found.';
				}
				// other error
				else {
					$scope.connectionError = 'Could not connect. Please try again later. Error code: ' + error;
				}

			}

	}])