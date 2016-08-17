/*
* CONTENTS
*
* register
*   store the form data
*   populate the projects dropdown
*   loop through the results and push only required items to $scope.projects
*   populate the year of birth dropdown (current year going down to (current year - 110))
*   process the form
* login
* dashboard
* log hours
* view logs
* settings
*/

angular.module('app.controllers', [])

// > register
.controller('RegisterController', ['$scope', '$stateParams', '$http', 
function ($scope, $stateParams, $http) {

	// >> store the form data
	$scope.formData = {};

	// >> populate the projects dropdown
	$scope.projects = [];
	$http({
		method: 'GET',
		url: 'http://powertochangeadmin.stage2.reason.digital/api/v1/projects'
	}).success(function (result) {
		console.log(result.data);
		$scope.projects = result.data;
		// >> loop through the results and push only required items to $scope.projects
		for (var i = 0, len = result.data.length; i < len; i++) {
			$scope.projects[i] = {id: result.data[i].id, name: result.data[i].name};
		}
	});

	// >> populate the year of birth dropdown (current year going down to (current year - 110))
	$scope.years = [];
	var highestYear = new Date().getFullYear(),
		lowestYear = highestYear - 110;
	while(highestYear >= lowestYear) {
		$scope.years.push(highestYear--);
	}

	// >> process the form
	$scope.processForm = function() {

		$http({
			method: 'POST',
			url: 'http://powertochangeadmin.stage2.reason.digital/api/v1/users',
			data: $.param($scope.formData),
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		}).success(function(data) {

			console.log(data);

			if (!data.success) {
				// if not successful, bind errors to error variables
				// $scope.errorName = data.errors.name;
				// $scope.errorSuperhero = data.errors.superheroAlias;
			}
			else {
				// if successful, bind success message to message
				$scope.message = data.message;
			}

		});

	};

}])

// > login
.controller('LoginController', ['$scope', '$stateParams',
function ($scope, $stateParams) {

}])

// > dashboard
.controller('DashboardController', ['$scope', '$stateParams',
function ($scope, $stateParams) {

}])
   
// > log hours
.controller('LogHoursController', ['$scope', '$stateParams',
function ($scope, $stateParams) {

}])
   
// > view logs
.controller('ViewLogsController', ['$scope', '$stateParams',
function ($scope, $stateParams) {

}])

// > settings
.controller('SettingsController', ['$scope', '$stateParams',
function ($scope, $stateParams) {

}])