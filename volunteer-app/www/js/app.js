/*
* CONTENTS
*
* app
*    options
*    ionic ready
*      debug modal
*      log $localStorage
*      setup offline mode
*      device detection
*      set organisation subheader title
*      hide accessory bar
*      sync offline data
*      check for internet connection
*      app paused (in background)
*      app resumed
*/

/*
	> app
*/

	angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives','app.services','app.filters','ngStorage',])
	.run(function(
		$ionicPlatform, $localStorage, $rootScope, $filter, $ionicModal, $ionicLoading, $state, 
		$$api, $$offline, $$shout, $$utilities
	) {

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
			>> ionic ready
		*/

			$ionicPlatform.ready(function() {

				/*
					>>> debug modal
				*/

					$ionicModal.fromTemplateUrl('templates/partials/debug-modal.html', {
					    scope: $rootScope,
					    animation: 'slide-in-up'
					}).then(function(modal) {
						$rootScope.debugModal = modal;
					});


				/*
					>>> log $localStorage
				*/

					console.log('%c$localStorage: ', 'background: lightblue', $localStorage);
					if ($localStorage.offlineData !== undefined) {
						console.log('%c$localStorage.offlineData.logs: ', 'background: lightblue', $localStorage.offlineData.logs);
						// console.log(JSON.stringify($localStorage.offlineData.logs));
					}
					

				/*
					>>> setup offline mode
				*/

					// setup localstorage
					$$utilities.setupLocalStorage();

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
					>>> device detection
				*/

					$rootScope.isIOS = ionic.Platform.isIOS();
					$rootScope.isAndroid = ionic.Platform.isAndroid();


				/*
					>>> set organisation subheader title
				*/

					if ($localStorage.user) {
						$rootScope.organisationName = $localStorage.user.organisation.name;
					}


				/*
					>>> hide accessory bar
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
					>>> sync offline data
				*/

					$rootScope.syncOfflineData = function() {
						// get all offline logs
						var allLogs = $localStorage.offlineData.logs;
						// filter by current organisation id
						var logsByOrganisation = $filter('filter')(allLogs, {'organisation_id' : $localStorage.user.organisation.id});
						// filter by 'needs_pushing'
						var logsThatNeedPushing = $filter('filter')(logsByOrganisation, {'needs_pushing' : true});

						var logsData = {
							logs: logsThatNeedPushing
						}

						// remove $$hasKey items
						logsData = angular.copy(logsData);

						console.log('logsData: ', logsData);

						// sync offline logs
						$$api.logs.sync($.param(logsData)).success(function(response) {
							console.log('response: ', response);

							// successful response
							if (response.success) {

								// show loader
								$ionicLoading.show('Syncing');

								// get response logs
								var responseLogs = response.data;

								// save logs offline
								$$offline.saveLogs(responseLogs);

								// switch offline mode off
								$$offline.disable();

								// reload current page
								$state.reload();

								// hide loader
								$ionicLoading.hide();

								// inform user
								$$shout('Data synced successfully!');

							}
							// unsuccessful response
							else {
								$$shout('Couldn\'t sync offline data');
							}


						}).error(function(data, error) {

							$$shout('Couldn\'t sync offline data');

						});


					}


				/*
					>>> check for internet connection
				*/

					// online
					if (navigator.onLine) {
						// if app is in offline mode, attempt to sync offline data
						if ($rootScope.offlineMode) {
							$rootScope.syncOfflineData();
						}
					}
					// offline
					else {
						
					}


				/*
					>>> app paused (in background)
				*/

					$rootScope.appPaused = false;
					document.addEventListener('pause', function() {
						$rootScope.appPaused = true;
				    }, false);


			    /*
			    	>>> app resumed
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
