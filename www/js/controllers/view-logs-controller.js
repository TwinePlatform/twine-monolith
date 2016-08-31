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

	angular.module('app').controller('ViewLogsController', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$localStorage', '$rootScope', 
	function ($scope, $stateParams, $state, $http, $ionicLoading, $localStorage, $rootScope) {

		/*
			>> populate logs
		*/

			console.log($localStorage.user.id);

			$http({
				method: 'GET',
				url: api('logs/user/' + $localStorage.user.id)
			}).success(function (result) {
				
				console.log(result);

				// update logs in view
				$scope.logs = result.data.logs;

				// if no logs
				if (result.data.logs.length == 0) {
					$scope.noLogs = true;
				}

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

					// refresh dashboard
					// $rootScope.$broadcast('refreshDashboard');

				}).error(function (result, error) {
					
					// hide loader
					$ionicLoading.hide();

					// process connection error
					processConnectionError(result, error);

				});

			}


	}])