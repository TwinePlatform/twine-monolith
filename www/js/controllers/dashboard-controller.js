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

					// get today's date in sql format yyyy-mm-dd
					var todaysDate = $$utilities.jsDateToSqlDate(new Date());

					$$api.user.totalHoursForDay($localStorage.user.id, todaysDate).success(function (result) {
						$scope.todaysTotalHours = result.data.duration;
					}).error(function (result, error) {
					});


				/*
					>>> update organisation summary
				*/

					$$api.organisations.summary($localStorage.user.organisation.id).success(function (result) {

						// we got what we wanted
						if (result.success) {
							$scope.totalUsers = result.data.totalUsers;
							$scope.totalVolunteeredMinutes = result.data.totalVolunteeredTime;
						}
						// we didn't
						else {
							$$shout("Couldn't retrieve organisation summary.");
						}

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
