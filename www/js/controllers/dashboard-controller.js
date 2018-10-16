/*
* CONTENTS
*
* dashboard controller
*    get a link to $localStorage
*    refresh dashboard
*      update overall total hours
*      update last 7 days hours
*      update last 30 days hours
*      update today's total hours
*      update organisation summary
*    on enter view
*    on leave view
*/

/*
	> dashboard controller
*/

	angular.module('app.controllers').controller('DashboardController', function (
		$scope, $localStorage, $rootScope, $$api, $$utilities, $$offline
	) {

		/*
			>> get a link to $localStorage
		*/

			$scope.$storage = $localStorage;

		/*
			>> refresh dashboard
		*/

			$scope.refreshDashboard = function() {

				/*
					>>> update overall total hours
				*/

					$scope.totalHours = -1;

					// if offline mode, get offline total hours
					if ($rootScope.offlineMode) {

						$scope.totalHours = $$offline.totalHours($localStorage.user.organisation.id);

					}
					// else get total hours from api
					else {

						$$api.user.totalHours($localStorage.user.id).success(function (result) {
							
							$scope.totalHours = result.data.total;

						}).error(function (result, error) {
							
							// process connection error
							$$utilities.processConnectionError(result, error);

						});

					}


				/* 
					>>> update last 7 days hours
				*/

					$scope.last7DaysHours = -1;

					$$api.user.totalHours($localStorage.user.id, 7).success(function (result) {
						
						$scope.last7DaysHours = result.data.total;

					}).error(function (result, error) {
						
						// process connection error
						$$utilities.processConnectionError(result, error);

					});

				/*
					>>> update last 30 days hours
				*/

					$scope.last30DaysHours = -1;

					$$api.user.totalHours($localStorage.user.id, 30).success(function (result) {
						
						$scope.last30DaysHours = result.data.total;

					}).error(function (result, error) {
						
						// process connection error
						$$utilities.processConnectionError(result, error);

					});

				/*
					>>> update today's total hours
				*/

					$scope.todaysTotalHours = -1;

					$$api.user.totalHoursForDay($localStorage.user.id, new Date()).success(function (result) {
						$scope.todaysTotalHours = result.data.total;
					}).error(function (result, error) {
						// process connection error
						$$utilities.processConnectionError(result, error);
					});


				/*
					>>> update organisation summary
				*/

					$$api.organisations.summary().success(function (result) {

						const { days, hours, minutes, seconds } = result.data.volunteeredTime;

						$scope.totalUsers = result.data.volunteers;
						$scope.totalVolunteeredMinutes =
							((days || 0) * 24 * 60) +
							((hours || 0) * 60) +
							(minutes || 0) +
							((seconds || 0) / 60);

					}).error(function (result, error) {
						
						// process connection error
						$$utilities.processConnectionError(result, error);

					});

			}


		/*
			>> on enter view
			   - fired every time view entered
		*/

			$scope.$on('$ionicView.enter', function() {

				// update total hours
				$scope.refreshDashboard();

			})


		/*
			>> on leave view
			   - fired every time view left
		*/

			$scope.$on('$ionicView.leave', function() {

				$scope.totalHours = -1;

			})


	})
