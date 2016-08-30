/*
* CONTENTS
*
* view logs controller
*   populate logs
*   delete log
*/

/*
	> view logs controller
*/

	angular.module('app').controller('ViewLogsController', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading',
	function ($scope, $stateParams, $state, $http, $ionicLoading) {

		/*
			>> populate logs
		*/

			$http({
				method: 'GET',
				url: api('logs')
			}).success(function (result) {
				
				// update logs in view
				$scope.logs = result.data;

			}).error(function (result, error) {
				
				// process connection error
				processConnectionError(result, error);

			});


		/*
			>> delete log
		*/
		
			$scope.delete = function(log) {

				// show loader
				$ionicLoading.show();

				// get id of log
				var id = log.id;

				// call api delete log method
				$http({
					method: 'DELETE',
					url: api('logs/' + id)
				}).success(function (result) {
					
					// hide loader
					$ionicLoading.hide();

					// remove from model & view
					var index = $scope.logs.indexOf(log);
					$scope.logs.splice(index, 1);

				}).error(function (result, error) {
					
					// hide loader
					$ionicLoading.hide();

					// process connection error
					processConnectionError(result, error);

				});

			}


	}])