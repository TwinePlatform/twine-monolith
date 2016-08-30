/*
* CONTENTS
*
* login controller
*/

/*
	> login controller
*/

	angular.module('app').controller('LoginController', ['$scope', '$stateParams', '$http', '$state', '$ionicPopup',
	function ($scope, $stateParams, $http, $state, $ionicPopup) {

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
					console.log('form valid');

					// >>> submit form
					$http({
						method: 'POST',
						url: api('users/login'),
						data: $.param($scope.formData),
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
					}).success(function(response) {

						console.log(response);

						// login successful
						if (response.success) {

							// store api token
							$localStorage.user.api_token = response.data.api_token;

							// go to dashboard
							$state.go('tabs.dashboard');

						}

						// login unsuccessful
						else {

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
					console.log('form invalid');
				}

			};


	}])