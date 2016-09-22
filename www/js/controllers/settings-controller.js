/*
* CONTENTS
*
* settings controller
*   store the form data
*   variables
*   location reminder switch changed
*   enable location reminders
*    get current lat and long
*    setup geofences
*   disable location reminders
*   get user email
*   populate region dropdown
*   populate organisation dropdown
*    loop through the results and push only required items to $scope.organisations
*   process save user form
*    validate form
*    submit form data
*   log out
*/

/* 
	> settings controller
*/

	angular.module('app').controller('SettingsController', ['$scope', '$stateParams', '$http', '$ionicPopup', '$ionicLoading', '$ionicPlatform', '$localStorage', '$state', '$rootScope', 
	function ($scope, $stateParams, $http, $ionicPopup, $ionicLoading, $ionicPlatform, $localStorage, $state, $rootScope) {

		$ionicPlatform.ready(function() {

			/*
				>> store the form data
			*/

				$scope.formData = {};


			/*
				>> variables
			*/

				$scope.radius = 100;


			/*
				initialize geofencing plugin
			*/

				if (window.geofence) {
					window.geofence.initialize().then(function () {

						// get watched geofences
						// window.geofence.getWatched().then(function (geofencesJson) {
						//     var geofences = JSON.parse(geofencesJson);
						// });

					}, function (error) {
						shout("Geofence: Error - " + error);
					});
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
									    	$scope.enableLocationReminders();
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
							  	template: 'Location reminders have now been enabled. You will now be notified whenever you leave ' + $rootScope.organisationName + '<input type="text" value="' + $scope.lat + ', ' + $scope.long + '">'

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
				>> populate region dropdown
			*/

				$scope.regionsDisabled = true;
				$scope.regions = [];

				$http({
					method: 'GET',
					url: api('regions')
				}).success(function (result) {
					
					// loop through the results and push only required items to $scope.regions
					for (var i = 0, len = result.data.length; i < len; i++) {
						$scope.regions[i] = {id: result.data[i].id, name: result.data[i].name};

						// when for loop complete
						if (i === len - 1) {

							// get user's region id
							var regionId = parseInt($localStorage.user.region.id);

							// get position of user's organsation in $scope.regions array
							var regionPosition = $scope.regions.map(function(x) {return x.id; }).indexOf(regionId);

							// set the value of formData.region to that item
							$scope.formData.region = $scope.regions[regionPosition];

						}
					}

					// enable regions select
					$scope.regionsDisabled = false;

				}).error(function (result, error) {
					
					// process connection error
					processConnectionError(result, error);

				});


			/*
				>> populate organisation dropdown
			*/

				$scope.organisationsDisabled = true;
				$scope.organisations = [];

				$scope.populateOrganisations = function(regionId) {

					// if no region is selected, empty & disable organisations
					if (regionId === undefined) {
						$scope.organisations = [];
						$scope.organisationsDisabled = true;
					}
					// otherwise get the organisations
					else {
						$http({
							method: 'GET',
							url: api('regions/' + regionId + '/organisations')
						}).success(function (result) {

							$scope.organisations = result.data;
							// >>> loop through the results and push only required items to $scope.organisations
							for (var i = 0, len = result.data.length; i < len; i++) {
								$scope.organisations[i] = {id: result.data[i].id, name: result.data[i].name};

								// when for loop complete
								if (i === len - 1) {

									$scope.organisationsLoaded = true;

									// get user's organisation id
									var orgId = parseInt($localStorage.user.organisation.id);

									// get position of user's organsation in $scope.organisations array
									var organisationPosition = $scope.organisations.map(function(x) {return x.id; }).indexOf(orgId);

									// set the value of formData.organisation to that item
									$scope.formData.organisation = $scope.organisations[organisationPosition];

									// hide loader
									$ionicLoading.hide();

								}
							}

							// enable organisation select 
							$scope.organisationsDisabled = false;

						}).error(function (result, error) {
							
							// hide loader
							$ionicLoading.hide();

							// process connection error
							processConnectionError(result, error);

						});
					}

				}

				// populate on first load by localStorage region id
				$scope.populateOrganisations($localStorage.user.region.id);


			/*
				>> process save user form
			*/

				$scope.formSubmitted = false;
				$scope.saveUser = function(form) {

					// >>> validate form

					// variable to show that form was submitted
					$scope.formSubmitted = true;

					// form is valid
					if (form.$valid) {

						// show loader
						$ionicLoading.show();

						// >>> submit form data
						$http({
							method: 'PUT',
							url: api('users/' + $localStorage.user.id),
							data: $.param($scope.formData),
							headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
						}).success(function(response) {

							// registration successful
							if (response.success) {

								// hide loader
								$ionicLoading.hide();

								// store user information
								$localStorage.user = response.data;

								// update organisation subheader name
								$rootScope.organisationName = $localStorage.user.organisation.name;

								// shout success
								shout('Your region and organisation were updated!');

							}

							// registration unsuccessful
							else {

								// hide loader
								$ionicLoading.hide();

								// shout error
								shout('Could not save region and organisation!');

							}

						}).error(function(data, error) {

							// hide loader
							$ionicLoading.hide();

							// process connection error
							processConnectionError(data, error);

						});
					}
					// form is invalid
					else {

					}

				};


			/*
				>> log out
			*/

				$scope.logOut = function() {
					delete $localStorage.user;
					$state.go('login');
				}

		});

	}])