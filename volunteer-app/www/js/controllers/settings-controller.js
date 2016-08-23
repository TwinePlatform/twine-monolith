/*
* CONTENTS
*
* settings controller
*   populate organisation dropdown
*    loop through the results and push only required items to $scope.organisations
*/

/* 
	> settings controller
*/

	angular.module('app').controller('SettingsController', ['$scope', '$stateParams', '$http',
	function ($scope, $stateParams, $http) {

		/*
			>> populate organisation dropdown
		*/

			$scope.organisations = [];
			$http({
				method: 'GET',
				url: 'http://powertochangeadmin.stage2.reason.digital/api/v1/projects'
			}).success(function (result) {
				console.log(result.data);
				$scope.organisations = result.data;
				// >>> loop through the results and push only required items to $scope.organisations
				for (var i = 0, len = result.data.length; i < len; i++) {
					$scope.organisations[i] = {id: result.data[i].id, name: result.data[i].name};
				}
			}).error(function (result, error) {
				
				// process connection error
				$scope.processConnectionError(result, error);

			});

	}])