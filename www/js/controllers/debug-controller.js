/*
* CONTENTS
*
* debug controller
* offline mode
* clear local storage
* restart app
*/

/* 
	> debug controller
*/

	angular.module('app').controller('DebugController', 
	function (
		$scope, $state, $stateParams, $http, $localStorage, $ionicHistory, $window, $timeout, $rootScope, 
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

				// hide debug modal 
				$rootScope.debugModal.hide();

				// go to app root
				$state.go('register');
				$timeout(function(){
					$window.location.reload();
				}, 200);

			}


	})
