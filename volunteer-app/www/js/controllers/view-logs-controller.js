/*
* CONTENTS
*
* view logs controller
*    populate logs
*    edit log
*    delete log
*    delete log offline
*    beforeEnter
*    leave
*/

/*
	> view logs controller
*/

	angular.module('app.controllers').controller('ViewLogsController', function (
		$scope, $stateParams, $state, $http, $ionicLoading, $localStorage, $rootScope, $ionicPopup, 
		$$api, $$utilities, $$shout, $$offline
	) {

		/*
			>> populate logs
		*/

			$scope.populateLogs = function() {

				// if offline mode, get and display $localStorage logs
				if ($rootScope.offlineMode) {

					// update logs in view
					$scope.logs = $$offline.getLogs();

					console.log('$scope.logs: ', $scope.logs);

				}

				// else get logs from api
				else {
					$$api.logs.getLogs($localStorage.user.id).success(function (result) {

						// update logs in view
						$scope.logs = result.data.logs;

						// if no logs
						if (result.data.logs.length == 0) {
							$scope.noLogs = true;
						}

					}).error(function (result, error) {
						
						// enable offline mode
						$$offline.enable();

						// update logs in view
						$scope.logs = $$offline.getLogs();

						// process connection error
						$$utilities.processConnectionError(result, error);

					});
				}

			}


		/*
			>> edit log
		*/
		
			$scope.edit = function(log) {

				// if offline mode, edit local log
				if ($rootScope.offlineMode) {

					$state.go('tabs.edit-log-offline', {
						offline_id: log.offline_id
					});

				}
				// else edit via api 
				else {

					$state.go('tabs.edit-log', {
						id: log.id
					});

				}

			}


		/*
			>> delete log
		*/
		
			$scope.delete = function(log) {

				// confirm deletion popup
				$ionicPopup.show({
					template: 'Are you sure you want to delete this log?',
					title: 'Delete log',
					scope: $scope,
					buttons: [
						{
							text: 'No'
						},
						{
						  	text: '<b>Yes</b>',
						  	type: 'button-positive',
						  	onTap: function(e) {
						    	
						  		// show loader
						  		$ionicLoading.show();

						  		// if offline mode, delete locally
						  		if ($scope.offlineMode) {

						  			// delete log offline
						  			$scope.deleteLogOffline({ id: log.offline_id, idKey: 'offline_id' }, true, 'Log deleted offline.');

						  		}
						  		// else delete via api 
						  		else {

							  		// get id of log
							  		var id = log.id;

							  		// call api delete log method
							  		$$api.logs.delete(id).success(function (result) {
							  			
							  			// hide loader
							  			$ionicLoading.hide();

							  			// delete locally 
										$scope.deleteLogOffline({ id: log.id, idKey: 'id' });

							  			// remove from model & view
							  			var index = $scope.logs.indexOf(log);
							  			$scope.logs.splice(index, 1);

							  			// shout log deleted
							  			$$shout('Log deleted');

							  		}).error(function (result, error) {
							  			
							  			// enable offline mode
							  			$$offline.enable();

							  			// delete log offline
							  			$scope.deleteLogOffline({ id: id, idKey: 'id'}, true, 'Log deleted offline.');

							  			// make it look deleted & needing to push
							  			log.deleted_at = $$utilities.getCurrentDateAndTimeAsString();
							  			log.needs_pushing = true;

							  			// process connection error
							  			$$utilities.processConnectionError(result, error);

							  		});

						  		}


							}
						}
					]
				});

			}

		/*
			>> delete log offline
		*/

			$scope.deleteLogOffline = function(idObject, needs_pushing, message) {

				// hide loader
				$ionicLoading.hide();

				if (needs_pushing === undefined) {
					needs_pushing = false;
				}

				// delete log
				$$offline.deleteLog(idObject, needs_pushing);

				// shout message
				if (message !== undefined) {
					$$shout(message);
				}

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
				if (!$rootScope.offlineMode) {
					$('.view-logs .list .item').remove();
				}

			})


	})