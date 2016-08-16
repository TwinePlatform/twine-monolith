angular.module('app.controllers', [])

.controller('registerCtrl', ['$scope', '$stateParams', '$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http) {

	// somewhere to store the form data
	$scope.formData = {};

	// populate the projects dropdown
	$scope.projects = [];
	$http({
		method: 'GET',
		url: 'http://powertochangeadmin.stage2.reason.digital/api/v1/projects'
	}).success(function (result) {
		console.log(result.data);
		$scope.projects = result.data;
		// loop through the results and push only required items to $scope.projects
		for (var i = 0, len = result.data.length; i < len; i++) {
			$scope.projects[i] = {id: result.data[i].id, name: result.data[i].name};
		}
	});

	// populate the year of birth dropdown (current year going down to (current year - 110))
	$scope.years = [];
	var highestYear = new Date().getFullYear(),
		lowestYear = highestYear - 110;
	while(highestYear >= lowestYear) {
		$scope.years.push(highestYear--);
	}

	// process the form
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
				$scope.errorName = data.errors.name;
				$scope.errorSuperhero = data.errors.superheroAlias;
			}
			else {
				// if successful, bind success message to message
				$scope.message = data.message;
			}

		});

	};

}])

.controller('dashboardCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('dashboardLogHoursCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('logHoursCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('editLogCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('viewLogsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
      
.controller('settingsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('loginCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('termsConditionsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
 