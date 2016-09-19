/*
* CONTENTS
*
* view logs controller
*   populate logs
*   delete log
*   beforeEnter
*   leave
*/

/*
	> view logs controller
*/

	angular.module('app').controller('ViewLogsController', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$localStorage', '$rootScope', 
	function ($scope, $stateParams, $state, $http, $ionicLoading, $localStorage, $rootScope) {

		/*
			>> populate logs
		*/

			$scope.populateLogs = function() {

				// get logs from api
				$http({
					method: 'GET',
					url: api('logs/user/' + $localStorage.user.id)
				}).success(function (result) {
					
					// change duration into hours and minutes
					console.log('result: ', result);
					for (i = 0; i < result.data.logs.length; i++) {
						var duration = result.data.logs[i].duration;
						var hoursAndMinutes = getHoursAndMinutesAsString(duration);
						// add nice hours and minutes string to object
						result.data.logs[i].hoursAndMinutes = hoursAndMinutes;
					}

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

			}


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

		/*
			>> beforeEnter
			   - fired every time view entered
		*/

			$scope.$on('$ionicView.beforeEnter', function() {

				// populate logs
				$scope.populateLogs();

			})

		
		/*
			>> leave
			   - fired every time view is fully left
		*/

			$scope.$on('$ionicView.leave', function() {

				// clear logs
				$scope.logs = null;
				$('.view-logs .list .item').remove();

			})


	}])