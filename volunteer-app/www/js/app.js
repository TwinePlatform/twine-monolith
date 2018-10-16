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
		$ionicPlatform, $localStorage, $rootScope, $filter, $ionicModal, $ionicLoading, $state, $window,
		$$api, $$offline, $$shout, $$utilities
	) {

		/*
			>> options
		*/

			$rootScope.options = {
				appName: 'Twine',
				debug: false,
				environment: 'dev',	// dev | stage | live
				apiBaseUrl: {
					local: 'http://localhost:4000/v1/',
					dev:   'http://localhost:4000/v1/',
					stage: 'https://twine-api-staging.herokuapp.com/v1/',
					live:  'https://api.twine-together.com/v1/',
				},
				adminBaseUrl: {
					local: 'http://localhost:4000/v1/',
					dev:   'http://localhost:4000/v1/',
					stage: 'https://twine-together.herokuapp.com/v1/',
					live:  'https://twine-together.com/v1/',
				}
			};


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

					console.log('%c$localStorage: ', 'background: red', $localStorage);
					if ($localStorage.offlineData !== undefined) {
						console.log('%c$localStorage.offlineData.logs: ', 'background: yellow', $localStorage.offlineData.logs);
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
        	// ionic.Platform.fullScreen();


				/*
					>>> set organisation subheader title
				*/

					if ($localStorage.user) {
						$$api.user.get('me')
							.then(function(result) {
								$localStorage.user = result.data;
								$rootScope.currentUser = $localStorage.user;

								return $$api.user.roles();
							})
							.then((response) => {
								$localStorage.user.role = response.data.result.role;
								$rootScope.currentUser.role = response.data.result.role;

								if (['VOLUNTEER_ADMIN', 'ORG_ADMIN'].includes($localStorage.user.role)) {
									$rootScope.isAdmin = true;
								} else {
									$rootScope.isAdmin = false;
								}

								return $$api.organisations.get();
							})
							.then((response) => {
								$localStorage.user.organisation = response.data.result;
								$rootScope.currentUser.organisation = response.data.result;
								$rootScope.organisationName = $localStorage.user.organisation.name;
							})
							.catch(function (error) {
								$localStorage.user = null;
								// process connection error
								$$utilities.processConnectionError(null, error);

							});

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
						// do not run if not logged in
						if (!$localStorage.user) {
							return;
						}
						// get all offline logs
						var allLogs = $localStorage.offlineData ? $localStorage.offlineData.logs : [];
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

						console.log('$.param(logsData): ', $.param(logsData));

						// if we have logs that need syncing, sync them
						if (logsData.logs.length > 0) {

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
						// if we don't have logs that need syncing, switch offline mode off (if we can)
						else if ($$offline.checkConnection()) {
                            $$shout('Data synced successfully!');
                            $$offline.disable();
						} else {
                            $$shout('No internet connection!');
						}


				}

				/*
					>>> check for internet connection
				*/

					// online
					if ($$offline.checkConnection()) {
						// if app is in offline mode, attempt to sync offline data
						if ($rootScope.offlineMode) {
							$rootScope.syncOfflineData();
						}
					}
					// offline
					else {
                        $rootScope.offlineMode = true;
                        $state.go('register');
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

				/*
					>>> root access
				 */

					$rootScope.$watch('currentUser',function (user) {
						if (user !== undefined && user !== null) {
                            if (user.role_id !== undefined && user.role_id == 2) {
                                $rootScope.isAdmin = true;
                            } else {
                                $rootScope.isAdmin = false;
                            }
						}
					})

                    // $ionicPlatform.on('resume', function(){
			});
	})
    .config(function( $ionicConfigProvider) {
		$ionicConfigProvider.navBar.alignTitle('center');
	});

	// controllers module
	angular.module('app.controllers', [])

	// services module
	angular.module('app.services', [])
