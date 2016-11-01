/*
* CONTENTS
*
* login controller
*    store the form data
*    process the form
*      validate form
*      submit login form
*/

/*
	> login controller
*/

	angular.module('app.controllers').controller('LoginController', function (
		$scope, $stateParams, $http, $state, $ionicPopup, $localStorage, $ionicLoading, $rootScope, 
		$$api, $$utilities
	) {

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

					// >>> submit login form
					$$api.user.login($.param($scope.formData)).success(function (result) {

						// login successful
						if (result.success) {

							// hide loader
							$ionicLoading.hide();

							// store user data
							$localStorage.user = result.data;

							// setup local storage
							$$utilities.setupLocalStorage();

							// set organisation subheader title
							$rootScope.organisationName = $localStorage.user.organisation.name;

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
						$$utilities.processConnectionError(data, error);

					});
				}
				// form is invalid
				else {
					
				}

			};

	})