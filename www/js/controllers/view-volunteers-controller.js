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
						result.data.volunteers.forEach(function (vol) {
							vol.created_at = $scope.normalDate(vol.created_at);
						});
						$scope.volunteers = result.data.volunteers;
						$scope.copyVolunteers = result.data.volunteers;

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
        >> search volunteer
    	*/

        $scope.search = function (event) {
        	if (event.target.value === '') {
        		$scope.volunteers = $scope.copyVolunteers;
			} else {
        		$scope.volunteers = [];
        		$scope.copyVolunteers.forEach(function (volunteer) {
					if (volunteer.name.indexOf(event.target.value) !== -1){
						$scope.volunteers.push(volunteer);
					}
                })
			}
        }

        $scope.clearSearch = function () {
            $scope.volunteers = $scope.copyVolunteers;
            $scope.searchParam = '';
        }

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
    	>> if the last volunteer deleted set nologs true
    	*/
        $scope.$watch('volunteers', function (newVal) {
            if ( newVal !== null && newVal !== undefined && newVal.length === 0) {
                $scope.noVolunteers = true;
            } else {
            	$scope.noVolunteers = false;
			}
        },true);
        /*
            >> date format changer
        */

        $scope.normalDate = function (date) {
        	var first = date[0]+date[1];
        	var second = date[3]+date[4];
        	date = date.replace(first,second);
            date = date.slice(0,2) + date.slice(2, date.length).replace(second,first);
            date = new Date(date).toLocaleDateString('en',{day: 'numeric',month: 'long',year: 'numeric'}).replace(',','');
            return date;
        }

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
