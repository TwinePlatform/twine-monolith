/*
* CONTENTS
*
* register controller
*   if user has access token, log straight in
*   store the form data
*   populate year of birth dropdown (current year going down to (current year - 110))
*   populate gender dropdown
*   populate region dropdown
*   populate organisation dropdown
*   process the form
*    validate form
*    submit sanitised form data
*/

/*
	> register controller
*/

	angular.module('app').controller('RegisterController', ['$scope', '$stateParams', '$http', '$state', '$ionicPopup', '$ionicLoading', '$localStorage',
	function ($scope, $stateParams, $http, $state, $ionicPopup, $ionicLoading, $localStorage) {

		/*
			>> if user has access token, log straight in
		*/

			if ($localStorage.user && $localStorage.user.api_token !== '') {
				console.log('access token found, log straight in');
				$state.go('tabs.dashboard');
			}

		/*
			>> store the form data
		*/

			$scope.formData = {};

		/*
			>> populate year of birth dropdown (current year going down to (current year - 110))
		*/

			$scope.years = [];
			var highestYear = new Date().getFullYear(),
				lowestYear = highestYear - 110;
			while(highestYear >= lowestYear) {
				$scope.years.push(highestYear--);
			}

		/*
			>> populate gender dropdown
		*/

			$scope.genders = ['Male', 'Female', 'Trans male', 'Trans female', 'Other', 'Non-binary', 'Rather not say'];

		/*
			>> populate region dropdown
		*/

			// $scope.regions = ['East Midlands', 'East of England', 'London', 'North East', 'North West', 'South East', 'South West', 'West Midlands', 'Yorkshire and Humber'];

			$scope.regionsDisabled = true;
			$scope.regions = [];

			$http({
				method: 'GET',
				url: api('regions')
			}).success(function (result) {
				
				// loop through the results and push only required items to $scope.regions
				for (var i = 0, len = result.data.length; i < len; i++) {
					$scope.regions[i] = {id: result.data[i].id, name: result.data[i].name};
				}

				// enable regions select
				$scope.regionsDisabled = false;

			}).error(function (result, error) {
				
				// process connection error
				processConnectionError(result, error);

			});


		/*
			>> populate organisation dropdown
		*/

			$scope.organisationsDisabled = true;
			$scope.organisations = [];

			$scope.populateOrganisations = function() {

				// get selected region id
				$scope.regionId = $scope.formData.region.id;

				$http({
					method: 'GET',
					url: api('regions/' + $scope.regionId + '/organisations')
				}).success(function (result) {

					// loop through the results and push only required items to $scope.organisations
					for (var i = 0, len = result.data.length; i < len; i++) {
						$scope.organisations[i] = {id: result.data[i].id, name: result.data[i].name};
					}

					// enable organisation select 
					$scope.organisationsDisabled = false;

				}).error(function (result, error) {
					
					// process connection error
					processConnectionError(result, error);

				});
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

					// >>> submit sanitised form data
					$http({
						method: 'POST',
						url: api('users'),
						data: $.param($scope.formData),
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
					}).success(function(response) {

						console.log(response);

						// registration successful
						if (response.success) {

							// hide loader
							$ionicLoading.hide();

							// store user information
							$localStorage.user = response.data;

							// show success popup
							var alertPopup = $ionicPopup.alert({
							  	title: 'Registration successful!',
							  	template: 'Welcome to Power to Change, ' + response.data.name + '!',
							  	okText: 'Start logging time'
							});

							alertPopup.then(function(res) {
							  	$state.go('tabs.dashboard');
							});

						}

						// registration unsuccessful
						else {

							// hide loader
							$ionicLoading.hide();

							// show unsuccess popup
							var alertPopup = $ionicPopup.alert({
							  	title: 'Error',
							  	template: 'Registration unsuccessful: ' + response.message,
							  	okText: 'OK',
							  	okType: 'button-assertive',
							  	cssClass: 'error'
							});

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