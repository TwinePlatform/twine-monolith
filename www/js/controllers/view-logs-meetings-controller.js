/*
* CONTENTS
*
* view meeting controller
*    populate meetings
*    edit meeting
*    delete meeting
*    delete meeting offline
*    beforeEnter
*    leave
*/

/*
	> view meetings controller
*/

	angular.module('app.controllers').controller('ViewLogsMeetingsController', function (
		$scope, $stateParams, $state, $http, $ionicLoading, $localStorage, $rootScope, $ionicPopup, $timeout,
		$$api, $$utilities, $$shout, $$offline
	) {

		$scope.test = $localStorage.outreach_type;
		/*
			>> populate Outreaches
		*/

			$scope.populateOutreaches = function() {

				// if offline mode, get and display $localStorage meetings
				if ($rootScope.offlineMode) {

					// update meetings in view
					$scope.outreach = $$offline.getOutreaches();

				}

				// else get meetings from api
				else {

					if ($localStorage.outreach_type !== null && $localStorage.outreach_type !== undefined) {

						$$api.outreach.getByType($localStorage.outreach_type).success(function (result) {

							// update meetings in view
							$scope.outreaches = result.data;

							// loop through each meeting and disable meetings from previous months
							var dateFirstOfMonth = $$utilities.getDateFirstOfMonth();
							for (i = 0; i < $scope.outreaches.length; i++) {
								// convert sql date to js date so we can compare with dateFirstOfMonth
								var sqlDateOfMeeting = $scope.outreaches[i].date;
								var jsDateOfMeeting = $$utilities.sqlDateToJSDate(sqlDateOfMeeting);
								// if meeting date is less than dateFirstOfMonth, flag it as previous month
								if (jsDateOfMeeting < dateFirstOfMonth) {
									$scope.outreaches[i].previous_month = true;
								}
							}

							// save meetings offline
							$$offline.saveOutreach(result.data);

							// if no meetings
							if (result.data.length == 0) {
								$scope.noOutreach = true;
							}

						}).error(function (result, error) {

							// if user does not exist, meeting user out
							if (error === 404) {
								$$utilities.logOut('This user account no longer exists.');
							}
							else {

								// enable offline mode
								$$offline.enable();

								// update meetings in view
								$scope.outreaches = $$offline.getOutreaches();

								// process connection error
								$$utilities.processConnectionError(result, error);

							}

						});
                    } else {
                        $scope.noOutreach = true;
                        $scope.outreaches = [];
                        $$offline.saveOutreach($scope.outreaches);
					}
				}

			}


		/*
			>> edit Outreach
		*/

			$scope.edit = function(outreach) {

				// if offline mode, edit local meeting
				if ($rootScope.offlineMode) {

					$state.go('tabs.edit-meeting-offline', {
						offline_id: outreach.offline_id
					});

				}
				// if no internet connection, edit local outreach and enable offline mode
				else if (!$$offline.checkConnection()) {

					$$offline.enable();
					$state.go('tabs.edit-meeting-offline', {
						offline_id: outreach.offline_id
					});

				}
				// else edit via api
				else {

					$state.go('tabs.edit-meeting', {
						id: outreach.id
					});

				}

			}


		/*
			>> delete outreach
		*/

			$scope.delete = function(outreach) {

				// confirm deletion popup
				$ionicPopup.show({
					template: 'Are you sure you want to delete this outreach?',
					title: 'Delete outreach',
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

						  			// delete meeting offline
						  			$scope.deleteMeetingOffline({ id: meeting.offline_id, idKey: 'offline_id' }, true, 'Outreach deleted offline.');

						  		}
						  		// else delete via api
						  		else {

							  		// get id of meeting
							  		var id = outreach.id;

							  		// call api delete meeting method
							  		$$api.outreach.delete(id).success(function (result) {

							  			// hide loader
							  			$ionicLoading.hide();

							  			// delete locally
										$scope.deleteOutreachOffline({ id: outreach.id, idKey: 'id' });

							  			// remove from model & view
							  			var index = $scope.outreaches.indexOf(outreach);
							  			$scope.outreaches.splice(index, 1);

							  			// shout outreach deleted
							  			$$shout('Outreach deleted');

							  		}).error(function (result, error) {

	  									// if user does not exist, log user out
										if (error === 404) {
											$$utilities.logOut('This user account no longer exists.');
										}
										else {

								  			// enable offline mode
								  			$$offline.enable();

								  			// delete Outreach offline
								  			$scope.deleteOutreachOffline({ id: id, idKey: 'id'}, true, 'Outreach deleted offline.');

								  			// make it look deleted & needing to push
								  			meeting.deleted_at = $$utilities.getCurrentDateAndTimeAsString();
								  			meeting.needs_pushing = true;

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
			>> delete Outreach offline
		*/

			$scope.deleteOutreachOffline = function(idObject, needs_pushing, message) {

				// hide loader
				$ionicLoading.hide();

				if (needs_pushing === undefined) {
					needs_pushing = false;
				}

				// delete meeting
				$$offline.deleteOutreach(idObject, needs_pushing);

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

				// populate meetings
				$scope.populateOutreaches();
                if ($rootScope.isAdmin) {
                    document.querySelector('#tabs .tab-nav').style.display = 'flex';
                }

			})


		/*
			>> leave
			   - fired every time view is fully left
		*/

			$scope.$on('$ionicView.leave', function() {

				// clear meetings
				$scope.outreaches = null;
				if (!$rootScope.offlineMode) {
					$('.view-logs .list .item').remove();
				}

			})

			$scope.$on('$ionicView.beforeLeave', function() {
				document.querySelector('#tabs .tab-nav').style.display = 'none';
			})



    })
