/*
* CONTENTS
*
* log hours controller
*   get today's date
*/

/*
	> log hours controller
*/

	angular.module('app').controller('LogHoursController', ['$scope', '$stateParams',
	function ($scope, $stateParams) {

		/*
			>> get today's date
		*/
		
			$scope.today = new Date();

			console.log($scope.today);

	}])