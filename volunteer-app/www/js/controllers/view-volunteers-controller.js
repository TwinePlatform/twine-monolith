/*
* CONTENTS
*
* view volunteer controller
*    populate volunteers
*    edit volunteer
*    delete volunteer
*    beforeEnter
*    leave
*/

/*
	> view volunteers controller
*/

	angular.module('app.controllers').controller('ViewVolunteersController', function (
		$scope, $stateParams, $state, $http, $ionicLoading, $localStorage, $rootScope, $ionicPopup, $timeout,
		$$api, $$utilities, $$shout, $$offline
	) {

		$scope.isOfflineMode = $rootScope.offlineMode;


		/*
			>> populate volunteers
		*/

			$scope.populateVolunteers = function() {

				if (!$rootScope.offlineMode) {
					$$api.volunteers.getVolunteers($localStorage.user.organisation_id).success(function (result) {

						// update volunteers in view
						$scope.volunteers = result.data.volunteers;

						// if no volunteers
						if (result.data.volunteers.length == 0) {
							$scope.noVolunteers = true;
						}

					}).error(function (result, error) {

						// if user does not exist, log user out
						if (error === 404) {
							$$utilities.logOut('This user account no longer exists.');
						}
						else {

							// enable offline mode
							$$offline.enable();

							// process connection error
							$$utilities.processConnectionError(result, error);

						}

					});
				}

			};


		/*
			>> edit volunteer
		*/

			$scope.edit = function(volunteer) {
				// if no internet connection
				if (!$$offline.checkConnection()) {

					$$offline.enable();
				}
				// else edit via api
				else {

					$state.go('tabs.edit-volunteer', {
						id: volunteer.id
					});

				}

			}


		/*
			>> delete volunteer
		*/

			$scope.delete = function(volunteer) {

				// confirm deletion popup
				$ionicPopup.show({
					template: 'Are you sure you want to delete this volunteer?',
					title: 'Delete volunteer',
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


									// get id of volunteer
									var id = volunteer.id;

									// call api delete volunteer method
									$$api.volunteers.delete(id).success(function (result) {

									// hide loader
									$ionicLoading.hide();

									// remove from model & view
									var index = $scope.volunteers.indexOf(volunteer);
									$scope.volunteers.splice(index, 1);

									// shout volunteer deleted
									$$shout('Volunteer deleted');

								}).error(function (result, error) {

										// if user does not exist, log user out
									if (error === 404) {
										$$utilities.logOut('This user account no longer exists.');
									}
									else {
											// enable offline mode
											$$offline.enable();

											// process connection error
											$$utilities.processConnectionError(result, error);

										}

									});


							}
						}
					]
				});

			};

		/*
			>> beforeEnter
			   - fired every time view entered
		*/

			$scope.$on('$ionicView.beforeEnter', function() {
				if (!$localStorage.user || $localStorage.user.role_id!==2) {
          // go back to dashboard
          $state.go('tabs.dashboard');
				}
				// populate volunteers
				$scope.populateVolunteers();

			})


		/*
			>> leave
			   - fired every time view is fully left
		*/

			$scope.$on('$ionicView.leave', function() {

				// clear volunteers
				$scope.volunteers = null;
				if (!$rootScope.offlineMode) {
					$('.view-logs .list .item').remove();
				}

			})

	})
