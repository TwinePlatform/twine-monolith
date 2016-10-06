/*
* CONTENTS
*
* app
*    log $localStorage
*    setup offline mode
*    device detection
*    set organisation subheader title
*    hide accessory bar
*    app paused (in background)
*    app resumed
*/

/*
	> app
*/

	angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives','app.services','app.filters','ngStorage',])
	.run(function($ionicPlatform, $localStorage, $rootScope, $filter) {
		$ionicPlatform.ready(function() {

			/*
				>> options
			*/

				$rootScope.options = {
					environment: 'dev',	// dev | stage
					apiBaseUrl: {
						dev:   'http://powertochangeadmindev.stage2.reason.digital/api/v1/',
						stage: 'http://powertochangeadmin.stage2.reason.digital/api/v1/'
					}
				}
				

			/*
				>> log $localStorage
			*/

				// console.log('$localStorage: ', $localStorage);
				if ($localStorage.offlineData !== undefined) {
					console.log('$localStorage.offlineData.logs: ', $localStorage.offlineData.logs);
				}


			/*
				>> setup offline mode
			*/

				// either enable or disable offline mode
				if ($localStorage.offlineMode) {
					$rootScope.offlineMode = true;
				}
				else {
					$rootScope.offlineMode = false;
					$localStorage.offlineMode = false;
				}

				// setup empty $localStorage array for offline data
				if (!$localStorage.offlineData && $localStorage.user) {
					$localStorage.offlineData = {
						user_id: $localStorage.user.id,
						logs: []
					}
				}

				// count number of logs that need pushing
				$rootScope.offlineLogsToPush = function() {
					// get an array of only the logs that need pushing
					var logsThatNeedPushing = $filter('filter')($localStorage.offlineData.logs, {'needs_pushing': true})
					return logsThatNeedPushing.length;
				}

			/*
				>> device detection
			*/

				$rootScope.isIOS = ionic.Platform.isIOS();
				$rootScope.isAndroid = ionic.Platform.isAndroid();

			/*
				>> set organisation subheader title
			*/

				if ($localStorage.user) {
					$rootScope.organisationName = $localStorage.user.organisation.name;
				}


			/*
				>> hide accessory bar
			*/

				if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
					cordova.plugins.Keyboard.disableScroll(true);
				}
				if (window.StatusBar) {
					// org.apache.cordova.statusbar required
					StatusBar.styleBlackTranslucent();
				}


			/*
				>> app paused (in background)
			*/

				$rootScope.appPaused = false;
				document.addEventListener('pause', function() {
					$rootScope.appPaused = true;
			    }, false);


		    /*
		    	>> app resumed
		    */

				document.addEventListener('resume', function() {
					$rootScope.appPaused = false;
			    }, false);

		});
	})

	// controllers module
	angular.module('app.controllers', [])

	// services module
	angular.module('app.services', [])