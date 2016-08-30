/*
* CONTENTS
*
* settings controller
*   populate organisation dropdown
*    loop through the results and push only required items to $scope.organisations
*/

/* 
	> settings controller
*/

	angular.module('app').controller('SettingsController', ['$scope', '$stateParams', '$http', '$ionicPopup', '$ionicLoading',
	function ($scope, $stateParams, $http, $ionicPopup, $ionicLoading) {

		/*
			>> location reminders
		*/

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
							    	// user tapped yes, setup location reminders
							    	$scope.enableLocationReminders();
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
		    	console.log('enable location reminders');
		    	$ionicLoading.show();
		    	setTimeout(function(){
		    		$ionicLoading.hide();
		    	}, 1000);
			}


		/*
			>> disable location reminders
		*/

			$scope.disableLocationReminders = function() {
		    	console.log('disable location reminders');
			}


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

	}])