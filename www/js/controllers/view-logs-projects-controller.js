/*
* CONTENTS
*
* view project controller
*    populate projects
*    edit project
*    delete project
*    delete project offline
*    beforeEnter
*    leave
*/

/*
	> view projects controller
*/

	angular.module('app.controllers').controller('ViewLogsProjectsController', function (
		$scope, $state, $ionicLoading, $rootScope, $ionicPopup, $$api, $$utilities, $$shout, $$offline, $localStorage
	) {

		if (!$$offline.checkConnection()) {
			$$offline.enable();
		}

		$scope.noProjects = true;
		$scope.offlineMode = $rootScope.offlineMode;

		/*
			>> populate Projects
		*/

			$scope.populateProjects = function() {

				// if offline mode, stop
				if ($rootScope.offlineMode) {
					$scope.offlineMode = $rootScope.offlineMode;
					$scope.projects = $localStorage.offlineData.projects || [];
					$scope.noProjects = $scope.projects.length === 0;
				}

				// else get projects from api
				$$api.projects.getProjects().success(function (data) {

					$scope.projects = data.result;
					$scope.noProjects = $scope.projects.length === 0;

				}).error(function(result, error) {
					if (error === 0) {
						$$offline.enable();
						$scope.offlineMode = $rootScope.offlineMode;
						$scope.projects = $localStorage.offlineData.projects || [];
						$scope.noProjects = $scope.projects.length === 0;
					}

					$$utilities.processConnectionError(result, error);
				});

			}

		/*
			>> if the last log deleted set nologs true
		*/
			$scope.$watch('projects', function (newVal) {
				if ( newVal !== null && newVal !== undefined && newVal.length === 0) {
					$scope.noProjects = true;
				}
			}, true);


		/*
			>> edit Project
		*/

			$scope.edit = function(project) {

				$state.go('tabs.view-logs.edit-project', { id: project.id });

			}


		/*
			>> delete outreach
		*/

			$scope.delete = function(project) {

				// confirm deletion popup
				$ionicPopup.show({
					template: 'Are you sure you want to delete this project?',
					title: 'Delete project',
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

						  		// if offline mode
						  		if ($scope.offlineMode) {

						  			// delete project offline
						  			$$shout('Cannot delete project in offline mode');
										return;

									}

									// call api delete meeting method
									$$api.projects.delete(project.id).success(function (result) {

										// hide loader
										$ionicLoading.hide();

										// remove from model & view
										var index = $scope.projects.indexOf(project);
										$scope.projects.splice(index, 1);

										// shout project deleted
										$$shout('Project deleted');

									}).error(function (result, error) {

										// if user does not exist, log user out
										if (error === 0) {
											// enable offline mode
											$$offline.enable();
										}

										// process connection error
										$$utilities.processConnectionError(result, error);

									});

							}
						}
					]
				});

			}

		/*
			>> beforeEnter
			   - fired every time view entered
		*/

			$scope.$on('$ionicView.beforeEnter', function() {

				// populate projects
				$scope.populateProjects();
					if ($rootScope.isAdmin) {
							document.querySelector('#tabs .tab-nav').style.display = 'flex';
					}

			})


		/*
			>> leave
			   - fired every time view is fully left
		*/

			$scope.$on('$ionicView.leave', function() {

				// clear projects
				$scope.projects = null;
				if (!$rootScope.offlineMode) {
					$('.view-logs .list .item').remove();
				}

			})

			$scope.$on('$ionicView.beforeLeave', function() {
				document.querySelector('#tabs .tab-nav').style.display = 'none';
			})



    })
