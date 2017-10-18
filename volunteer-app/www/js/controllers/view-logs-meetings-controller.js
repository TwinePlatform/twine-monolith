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

		/*
			>> populate meetings
		*/

			$scope.populateMeetings = function() {

				// if offline mode, get and display $localStorage meetings
				if ($rootScope.offlineMode) {

					// update meetings in view
					$scope.meetings = $$offline.getMeetings();

				}

				// else get meetings from api
				else {
					$$api.meetings.getMeetings($localStorage.user.id).success(function (result) {

						// update meetings in view
						$scope.meetings = result.data.meetings;

						// loop through each meeting and disable meetings from previous months
						var dateFirstOfMonth = $$utilities.getDateFirstOfMonth();
						for (i = 0; i < $scope.meetings.length; i++) {
							// convert sql date to js date so we can compare with dateFirstOfMonth
							var sqlDateOfMeeting = $scope.meetings[i].date;
							var jsDateOfMeeting = $$utilities.sqlDateToJSDate(sqlDateOfMeeting);
							// if meeting date is less than dateFirstOfMonth, flag it as previous month
							if (jsDateOfMeeting < dateFirstOfMonth) {
								$scope.meetings[i].previous_month = true;
							}
						}

						// save meetings offline
						$$offline.saveMeetings(result.data.meetings);

						// if no meetings
						if (result.data.meetings.length == 0) {
							$scope.noMeetings = true;
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
							$scope.meetings = $$offline.getMeetings();

							// process connection error
							$$utilities.processConnectionError(result, error);

						}

					});
				}

			}


		/*
			>> edit meeting
		*/

			$scope.edit = function(meeting) {

				// if offline mode, edit local meeting
				if ($rootScope.offlineMode) {

					$state.go('tabs.edit-meeting-offline', {
						offline_id: meeting.offline_id
					});

				}
				// if no internet connection, edit local meeting and enable offline mode
				else if (!$$offline.checkConnection()) {

					$$offline.enable();
					$state.go('tabs.edit-meeting-offline', {
						offline_id: meeting.offline_id
					});

				}
				// else edit via api
				else {

					$state.go('tabs.edit-meeting', {
						id: meeting.id
					});

				}

			}


		/*
			>> delete meeting
		*/

			$scope.delete = function(meeting) {

				// confirm deletion popup
				$ionicPopup.show({
					template: 'Are you sure you want to delete this meeting?',
					title: 'Delete meeting',
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
						  			$scope.deleteMeetingOffline({ id: meeting.offline_id, idKey: 'offline_id' }, true, 'Meeting deleted offline.');

						  		}
						  		// else delete via api
						  		else {

							  		// get id of meeting
							  		var id = meeting.id;

							  		// call api delete meeting method
							  		$$api.meetings.delete(id).success(function (result) {

							  			// hide loader
							  			$ionicLoading.hide();

							  			// delete locally
										$scope.deleteMeetingOffline({ id: meeting.id, idKey: 'id' });

							  			// remove from model & view
							  			var index = $scope.meetings.indexOf(meeting);
							  			$scope.meetings.splice(index, 1);

							  			// shout meeting deleted
							  			$$shout('Meeting deleted');

							  		}).error(function (result, error) {

	  									// if user does not exist, log user out
										if (error === 404) {
											$$utilities.logOut('This user account no longer exists.');
										}
										else {

								  			// enable offline mode
								  			$$offline.enable();

								  			// delete meeting offline
								  			$scope.deleteMeetingOffline({ id: id, idKey: 'id'}, true, 'Meeting deleted offline.');

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
			>> delete meeting offline
		*/

			$scope.deleteMeetingOffline = function(idObject, needs_pushing, message) {

				// hide loader
				$ionicLoading.hide();

				if (needs_pushing === undefined) {
					needs_pushing = false;
				}

				// delete meeting
				$$offline.deleteMeeting(idObject, needs_pushing);

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
				$scope.populateMeetings();

			})


		/*
			>> leave
			   - fired every time view is fully left
		*/

			$scope.$on('$ionicView.leave', function() {

				// clear meetings
				$scope.meetings = null;
				if (!$rootScope.offlineMode) {
					$('.view-logs .list .item').remove();
				}

			})


	})
