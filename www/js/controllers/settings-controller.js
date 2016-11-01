/*
* CONTENTS
*
* settings controller
*    variables
*    location reminder switch changed
*    initialize geofence plugin
*    enable location reminders
*      get current lat and long
*      setup geofences
*    disable location reminders
*    get user email
*    log out
*/

/* 
	> settings controller
*/

	angular.module('app').controller('SettingsController', 
	function ($scope, $stateParams, $http, $ionicPopup, $ionicLoading, $ionicPlatform, $localStorage, $state, $rootScope, $$api, $$shout
	) {


		$ionicPlatform.ready(function() {

			/*
				>> variables
			*/

				if ($rootScope.options.debug) {
					$scope.radius = 100;
				}
				else {
					$scope.radius = 250;
				}


			/*
				>> location reminder switch changed
			*/

				$scope.locationRemindersSwitch = false;

				if ($localStorage.locationRemindersSwitch !== undefined) {
					if ($localStorage.locationRemindersSwitch === true) {
						$scope.locationRemindersSwitch = true;
					}
				}

				$scope.locationReminders = function() {

					var $this = this;

					// switch turned on
					if ($this.locationRemindersSwitch) { // FIX THIS ?
                             
	                    // ask user if they're in the location where they volunteer
						var locationRemindersPopup = $ionicPopup.show({
							template: 'Are you at ' + $rootScope.organisationName + ' right now?',
							title: 'Setup location reminders',
							scope: $scope,
							buttons: [
								{
									text: 'No',
									onTap: function(e) {
										// user tapped no, tell user to try again when at correct location
										var tryAgainLaterPopup = $ionicPopup.alert({
										  	title: 'Please try later',
										  	template: 'Please setup location reminders later, when you are at ' + $rootScope.organisationName + '.'
										});
										tryAgainLaterPopup.then(function(res) {
										  	// disable switch
										  	$this.locationRemindersSwitch = false; // FIX THIS ?
										});
									}
								},
								{
								  	text: '<b>Yes</b>',
								  	type: 'button-positive',
								  	onTap: function(e) {
								    	// user tapped yes, setup location reminders if geofencing supported
										if (window.geofence) {
									    	$scope.initializeGeofencePlugin();
									    	// $scope.enableLocationReminders();
									  	}
										// else inform user to use real device
										else {
											var geoFencingNotSupported = $ionicPopup.alert({
											  	title: 'Location reminders unavailable',
											  	template: 'Sorry, location reminders are only available on a real iOS or Android device.',
											  	okType: 'button-assertive',
											  	cssClass: 'error'
											});
											geoFencingNotSupported.then(function(res) {
											  	// disable switch
											  	$this.locationRemindersSwitch = false; // FIX THIS ?
											});
										}
									}
								}
							]
						});

					}
					// switch turned off
					else {
						// disable location reminders
						$scope.disableLocationReminders();
					}
				}


			/*
				>> initialize geofence plugin
			*/

				$scope.initializeGeofencePlugin = function() {

					if (window.geofence) {
	                    window.geofence.initialize().then(function () {

	                    	$scope.enableLocationReminders();

                        }, function (error) {

                            $$shout("Geofence: Error - " + error, 10000);
                            console.log("Geofence: Error - " + error);

                        });
	                }

				}


			/*
				>> enable location reminders
			*/

				$scope.enableLocationReminders = function() {

					// >>> get current lat and long
					navigator.geolocation.getCurrentPosition(function(position) {

						// get lat and log
						$scope.lat = position.coords.latitude;
						$scope.long = position.coords.longitude;

						// setup geofences
						$scope.setupGeofences();
					}, function(error) {
						// show error alert
						$ionicPopup.alert({
						  	title: 'Error',
						  	template: 'Could not retrieve your current location. Please try later: ' + reason,
						  	okType: 'button-assertive',
							cssClass: 'error'
						});
					});

					// >>> setup geofences
					$scope.setupGeofences = function() {

						// location leave geofence options
						var LocationLeave = {
							id:             'LocationLeave', //A unique identifier of geofence
							latitude:       $scope.lat, //Geo latitude of geofence
							longitude:      $scope.long, //Geo longitude of geofence
							radius:         $scope.radius, //Radius of geofence in meters
							transitionType: 2, //Type of transition 1 - Enter, 2 - Exit, 3 - Both
							notification: {         //Notification object
								title:          'You just left ' + $rootScope.organisationName, //Title of notification
								text:           'Did you remember to log your time at ' + $rootScope.organisationName + '?', //Text of notification
								openAppOnClick: true,//is main app activity should be opened after clicking on notification
								data:           {mydata: 'Left location'}  //Custom object associated with notification
							}
						};

						// location arrive geofence options
						var LocationArrive = {
							id:             'LocationArrive', //A unique identifier of geofence
							latitude:       $scope.lat, //Geo latitude of geofence
							longitude:      $scope.long, //Geo longitude of geofence
							radius:         $scope.radius, //Radius of geofence in meters
							transitionType: 1, //Type of transition 1 - Enter, 2 - Exit, 3 - Both
							notification: {         //Notification object
								title:          'You just arrived at ' + $rootScope.organisationName, //Title of notification
								text:           'Welcome to ' + $rootScope.organisationName + '!', //Text of notification
								openAppOnClick: true,//is main app activity should be opened after clicking on notification
								data:           {mydata: 'Arrived at location'}  //Custom object associated with notification
							}
						};

						// setup all geofences
						window.geofence.addOrUpdate([LocationLeave, LocationArrive]).then(function () {
							// show alert
							$ionicPopup.alert({
							  	title: 'Location reminders enabled',
							  	template: 'Location reminders have now been enabled. You will now be notified whenever you leave ' + $rootScope.organisationName + '.<input class="ng-hide" type="text" value="' + $scope.lat + ', ' + $scope.long + '">'

							});
							$localStorage.locationRemindersSwitch = true;

							// get watched geofences
							window.geofence.getWatched().then(function (geofencesJson) {
							    var geofences = JSON.parse(geofencesJson);
							});

						}, function (reason) {
							// show alert
							$ionicPopup.alert({
							  	title: 'Error',
							  	template: 'Failed to enable location reminders: ' + reason,
							  	okType: 'button-assertive',
								cssClass: 'error'
							});
						});

						// listen for geofence transitions within the app
						window.geofence.onTransitionReceived = function (geofences) {
							geofences.forEach(function (geo) {
								// left location and app not paused
								if (geo.id === 'LocationLeave' && $rootScope.appPaused === false) {
									$ionicPopup.alert({
									  	title: geo.notification.title,
									  	template: geo.notification.text
									});
								}
								// arrived location and app not paused
								if (geo.id === 'LocationArrive' && $rootScope.appPaused === false) {
									$ionicPopup.alert({
										title: geo.notification.title,
										template: geo.notification.text
									});
								}
							});
						};

					}

				};


			/* 
				>> disable location reminders
			*/

				$scope.disableLocationReminders = function() {
					// remove all geofences
					window.geofence.removeAll().then(function () {
						// show alert
						$ionicPopup.alert({
						  	title: 'Location reminders disable',
						  	template: 'Location reminders have now been disabled.'
						});
						// update localstorage
						$localStorage.locationRemindersSwitch = false;
					}, function (reason) {
						// show alert
						$ionicPopup.alert({
						  	title: 'Error',
						  	template: 'Failed to remove location reminders: ' + reason,
						  	okType: 'button-assertive',
							cssClass: 'error'
						});
					});
				};


			/*
				>> get user email
			*/

				$scope.getUserEmail = function() {
					if ($localStorage.user !== undefined) {
						return $localStorage.user.email;
					}
					else {
						return '';
					}
				}


			/*
				>> log out
			*/

				$scope.logOut = function() {
					delete $localStorage.user;
					$state.go('login');
				}

		});

	})
