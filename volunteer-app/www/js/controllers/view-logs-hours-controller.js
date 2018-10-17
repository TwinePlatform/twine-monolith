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

	angular.module('app.controllers').controller('ViewLogsHoursController', function (
		$scope, $stateParams, $state, $http, $ionicLoading, $localStorage, $rootScope, $ionicPopup, $timeout,
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

				}

				// else get logs from api
				else {

					if ($rootScope.isAdmin) {

						$$api.logs.getAdminLogs($rootScope.currentUser.id).success(function (result) {

                            // update logs in view
                            $scope.logs = result.data;

                            if (result.data.length == 0) {
                                $scope.noLogs = true;
                            }

                            $$offline.saveLogs(result.data);

                        }).error(function (result, error) {

                            // if user does not exist, log user out
                            if (error === 404) {
                                $$utilities.logOut('This user account no longer exists.');
                            }
                            else {

                                // enable offline mode
                                $$offline.enable();

                                // update logs in view
                                $scope.logs = $$offline.getLogs();

                                // process connection error
                                $$utilities.processConnectionError(result, error);

                            }

                        });

					} else {

                        $$api.logs.getLogs().success(function (result) {

                            // update logs in view
                            $scope.logs = result.data;

                            // loop through each log and disable logs from previous months
                            var dateFirstOfMonth = $$utilities.getDateFirstOfMonth();
                            for (i = 0; i < $scope.logs.length; i++) {
                                // convert sql date to js date so we can compare with dateFirstOfMonth
                                var sqlDateOfLog = $scope.logs[i].date_of_log;
                                var jsDateOfLog = $$utilities.sqlDateToJSDate(sqlDateOfLog);
                                // if log date is less than dateFirstOfMonth, flag it as previous month
                                if (jsDateOfLog < dateFirstOfMonth) {
                                    $scope.logs[i].previous_month = true;
                                }
                            }

                            // save logs offline
                            $$offline.saveLogs(result.data);

                            // if no logs
                            if (result.data.length == 0) {
                                $scope.noLogs = true;
                            }

                        }).error(function (result, error) {

                            // if user does not exist, log user out
                            if (error === 404) {
                                $$utilities.logOut('This user account no longer exists.');
                            }
                            else {

                                // enable offline mode
                                $$offline.enable();

                                // update logs in view
                                $scope.logs = $$offline.getLogs();

                                // process connection error
                                $$utilities.processConnectionError(result, error);

                            }

                        });
                    }
				}
			}

        /*
        >> if the last log deleted set nologs true
    	*/
			$scope.$watch('logs', function (newVal) {
				console.log(newVal);
				if ( newVal !== null && newVal !== undefined && newVal.length === 0) {
					$scope.noLogs = true;
				}
			},true);


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
				// if no internet connection, edit local log and enable offline mode
				else if (!$$offline.checkConnection()) {
					$$offline.enable();
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

	  									// if user does not exist, log user out
										if (error === 404) {
											$$utilities.logOut('This user account no longer exists.');
										}
										else {

								  			// enable offline mode
								  			$$offline.enable();

								  			// delete log offline
								  			$scope.deleteLogOffline({ id: id, idKey: 'id'}, true, 'Log deleted offline.');

								  			// make it look deleted & needing to push
								  			log.deleted_at = $$utilities.getCurrentDateAndTimeAsString();
								  			log.needs_pushing = true;

								  			// process connection error
								  			$$utilities.processConnectionError(result, error);

								  		}

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
				if ($rootScope.isAdmin) {
                    document.querySelector('#tabs .tab-nav').style.display = 'flex';
				} else {
                    $('#tabs .tab-nav').addClass('displaynone');
                }

			});

		
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

			$scope.$on('$ionicView.beforeLeave', function() {
				document.querySelector('#tabs .tab-nav').style.display = 'none';
			})


	})
