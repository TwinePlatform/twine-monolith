/*
* CONTENTS
*
* login controller
*   store the form data
*   process the form
*    validate form
*    submit form
*/

/*
	> login controller
*/

	angular.module('app').controller('LoginController', ['$scope', '$stateParams', '$http', '$state', '$ionicPopup', '$localStorage', '$ionicLoading', 
	function ($scope, $stateParams, $http, $state, $ionicPopup, $localStorage, $ionicLoading) {

		/*
			>> store the form data
		*/

			$scope.formData = {};


		/*
			>> process the form
		*/

			$scope.formSubmitted = false;
			$scope.processForm = function(form) {

				// >>> validate form

				// variable to show that form was submitted
				$scope.formSubmitted = true;

				// form is valid
				if (form.$valid) {

					// show loader
					$ionicLoading.show();

					// >>> submit form
					$http({
						method: 'POST',
						url: api('users/login'),
						data: $.param($scope.formData),
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
					}).success(function(response) {

						// login successful
						if (response.success) {

							// hide loader
							$ionicLoading.hide();

							console.log('response.data: ', response.data);

							// store user data
							$localStorage.user = response.data;

							// go to dashboard
							$state.go('tabs.dashboard');

						}

						// login unsuccessful
						else {

							// hide loader
							$ionicLoading.hide();

							// show unsuccess popup
							var alertPopup = $ionicPopup.alert({
							  	title: 'Error',
							  	template: 'Login unsuccessful: ' + response.message,
							  	okText: 'OK',
							  	okType: 'button-assertive',
							  	cssClass: 'error'
							});

						}

					}).error(function(data, error) {

						// process connection error
						processConnectionError(data, error);

					});
				}
				// form is invalid
				else {
					
				}

			};

	}])