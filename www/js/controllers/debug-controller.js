/*
* CONTENTS
*
* settings controller
*    store the form data
*    variables
*    location reminder switch changed
*    enable location reminders
*      get current lat and long
*      setup geofences
*    disable location reminders
*    get user email
*    populate region dropdown
*    populate organisation dropdown
*      loop through the results and push only required items to $scope.organisations
*    process save user form
*      validate form
*      submit form data
*    log out
*/

/* 
	> settings controller
*/

	angular.module('app').controller('DebugController', 
	function (
		$scope, $stateParams, $http, $localStorage, $ionicHistory, 
		$$shout
	) {

		/*
			> offline mode
		*/

			// set the switch
			$scope.offlineModeSwitch = $localStorage.offlineMode;

			// switch toggled
			$scope.offlineModeSwitchChanged = function() {
				// turned on
				if ($scope.offlineModeSwitch) {
					$localStorage.offlineMode = true;
				}
				// turned off
				else {
					$localStorage.offlineMode = false;
				}
				setTimeout(function(){
					location.reload();
				}, 250);
			}


		/*
			> clear local storage
		*/

			$scope.clearLocalStorage = function(key) {

				// if key specified, delete it
				if (key !== undefined) {
					delete $localStorage[key];
					$$shout('Deleted $localStorage.' + key);
				}
				// else delete all
				else {
					$localStorage.$reset();
					$$shout('Deleted $localStorage');
				}

			}


		/*
			> restart app
		*/

			$scope.restartApp = function() {

				// clear cache
				$ionicHistory.clearCache();

				// go to app root
				window.location = '/';

			}


	})
