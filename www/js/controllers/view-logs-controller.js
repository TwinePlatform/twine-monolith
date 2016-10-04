/*
* CONTENTS
*
* view logs controller
*    populate logs
*    delete log
*    beforeEnter
*    leave
*/

/*
	> view logs controller
*/

	angular.module('app').controller('ViewLogsController', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$localStorage', '$rootScope', '$ionicPopup', '$$api', '$$form', '$$shout', 
	function ($scope, $stateParams, $state, $http, $ionicLoading, $localStorage, $rootScope, $ionicPopup, $$api, $$form, $$shout) {

		/*
			>> populate logs
		*/

			$scope.populateLogs = function() {

				// get logs from api
				$$api.logs.getLogs($localStorage.user.id).success(function (result) {

					// update logs in view
					$scope.logs = result.data.logs;

					// if no logs
					if (result.data.logs.length == 0) {
						$scope.noLogs = true;
					}

				}).error(function (result, error) {
					
					// process connection error
					$$form.processConnectionError(result, error);

				});

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

						  		// get id of log
						  		var id = log.id;

						  		// call api delete log method
						  		$$api.logs.delete(id).success(function (result) {
						  			
						  			// hide loader
						  			$ionicLoading.hide();

						  			// remove from model & view
						  			var index = $scope.logs.indexOf(log);
						  			$scope.logs.splice(index, 1);

						  			// shout log deleted
						  			$$shout('Log deleted');

						  		}).error(function (result, error) {
						  			
						  			// process connection error
						  			$$form.processConnectionError(result, error);

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