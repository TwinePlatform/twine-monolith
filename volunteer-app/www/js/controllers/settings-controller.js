/*
* CONTENTS
*
* settings controller
*   variables
*   location reminder switch changed
*   enable location reminders
*    get current lat and lon
*    setup geofences
*   disable location reminders
*   populate organisation dropdown
*    loop through the results and push only required items to $scope.organisations
*/

/* 
	> settings controller
*/

	angular.module('app').controller('SettingsController', ['$scope', '$stateParams', '$http', '$ionicPopup', '$ionicLoading', '$ionicPlatform', '$localStorage', 
	function ($scope, $stateParams, $http, $ionicPopup, $ionicLoading, $ionicPlatform, $localStorage) {

		$ionicPlatform.ready(function() {

			/*
				>> variables
			*/

				$scope.radius = 100;


			/*
				initialize geofencing plugin
			*/

				if (window.geofence) {
					window.geofence.initialize().then(function () {
						console.log("Geofence: Successful initialization");
					}, function (error) {
						console.log("Geofence: Error", error);
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
							template: 'Are you in the location where you volunteer right now?',
							title: 'Setup location reminders',
							scope: $scope,
							buttons: [
								{
									text: 'No',
									onTap: function(e) {
										// user tapped no, tell user to try again when at correct location
										var tryAgainLaterPopup = $ionicPopup.alert({
										  	title: 'Please try later',
										  	template: 'Please setup location reminders later, when you are in your volunteering location.'
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

					console.log('enableLocationReminders');

					// >>> get current lat and lon
					navigator.geolocation.getCurrentPosition(function(position) {
						console.log(position);
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

						// leaving location geofence
						window.geofence.addOrUpdate({
							id:             'LocationLeave', //A unique identifier of geofence
							latitude:       $scope.lat, //Geo latitude of geofence
							longitude:      $scope.long, //Geo longitude of geofence
							radius:         $scope.radius, //Radius of geofence in meters
							transitionType: 2, //Type of transition 1 - Enter, 2 - Exit, 3 - Both
							notification: {         //Notification object
								title:          'You just left your volunteering location.', //Title of notification
								text:           'Did you remember to log your time?', //Text of notification
								// smallIcon:      String, //Small icon showed in notification area, only res URI
								// icon:           String, //icon showed in notification drawer
								openAppOnClick: true,//is main app activity should be opened after clicking on notification
								data:           {mydata: 'Left location'}  //Custom object associated with notification
							}
						}).then(function () {
							// show alert
							$ionicPopup.alert({
							  	title: 'Location reminders enabled',
							  	template: 'Location reminders have now been enabled. You will now be notified whenever you leave your volunteering location: ' + $scope.lat + ', ' + $scope.long
							});
							$localStorage.locationRemindersSwitch = true;
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
								console.log('Geofence transition detected');
								console.dir(geo);
								// left location
								if (geo.id === 'LocationLeave') {
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
				>> populate organisation dropdown
			*/

				$scope.organisations = [];
				$http({
					method: 'GET',
					url: api('organisations')
				}).success(function (result) {
					console.log(result.data);
					$scope.organisations = result.data;
					// >>> loop through the results and push only required items to $scope.organisations
					for (var i = 0, len = result.data.length; i < len; i++) {
						$scope.organisations[i] = {id: result.data[i].id, name: result.data[i].name};
					}
				}).error(function (result, error) {
					
					// process connection error
					processConnectionError(result, error);

				});

		});

	}])