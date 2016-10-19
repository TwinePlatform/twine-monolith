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
	.run(function($ionicPlatform, $localStorage, $rootScope, $filter, $ionicModal) {
		$ionicPlatform.ready(function() {

			/*
				>> options
			*/

				$rootScope.options = {
					debug: true,
					environment: 'dev',	// dev | stage
					apiBaseUrl: {
						dev:   'http://powertochangeadmindev.stage2.reason.digital/api/v1/',
						stage: 'http://powertochangeadmin.stage2.reason.digital/api/v1/'
					}
				}


			/*
				>> debug modal
			*/

				$ionicModal.fromTemplateUrl('templates/partials/debug-modal.html', {
				    scope: $rootScope,
				    animation: 'slide-in-up'
				}).then(function(modal) {
					$rootScope.debugModal = modal;
				});


			/*
				>> log $localStorage
			*/

				console.log('$localStorage: ', $localStorage);
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
					if ($localStorage.offlineData !== undefined) {
						var logsThatNeedPushing = $filter('filter')($localStorage.offlineData.logs, {'needs_pushing': true})
						return logsThatNeedPushing.length;
					}
					else {
						return 0;
					}
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
				>> sync offline data
			*/

				$rootScope.syncOfflineData = function() {
					var allLogs = $localStorage.offlineData.logs,
						logsByOrganisation = $filter('filter')(allLogs, {'organisation_id' : $localStorage.user.organisation.id})
						logsThatNeedPushing = $filter('filter')(logsByOrganisation, {'needs_pushing' : true});
					$rootScope.logsThatNeedPushing = logsThatNeedPushing;
					console.log('logsThatNeedPushing: ', logsThatNeedPushing);

					var data = {
						logs: logsThatNeedPushing
					}
					// console.log($.param(data));
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