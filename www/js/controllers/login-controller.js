/*
* CONTENTS
*
* login controller
*    store the form data
*    process the form
*      validate form
*      submit login form
*    forgot password
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
			var formData = JSON.parse(localStorage.getItem('lastAuth'));
			$scope.formData = (formData !== undefined && formData !== null && formData !== '') ? formData : {};

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
					$$api.user.login($scope.formData)
					.then(() => $$api.user.get('me'))
					.then((response) => {

						// login successful
						localStorage.setItem('lastAuth', JSON.stringify($scope.formData));

						// hide loader
						$ionicLoading.hide();

						// store user data
						$localStorage.user = response.data.result;
						$rootScope.currentUser = response.data.result;

						return $$api.user.roles()
					})
					.then((response) => {
						$localStorage.user.role = response.data.result.role;

						if (['VOLUNTEER_ADMIN', 'ORG_ADMIN'].includes($localStorage.user.role)) {
							$rootScope.isAdmin = true;
						} else {
							$rootScope.isAdmin = false;
						}

						// setup local storage
						$$utilities.setupLocalStorage();

						return $$api.organisations.get();
					})
					.then((response) => {
						$localStorage.user.organisation = response.data.result;

						// set organisation subheader title
						$rootScope.organisationName = $localStorage.user.organisation.name;

						if ($rootScope.isAdmin) {
							// go to volunteers
							$state.go('tabs.view-volunteers');
						} else {
							// go to dashboard
							$state.go('tabs.dashboard');
						}

					}).catch(function(error) {

						// hide loader
						$ionicLoading.hide();

						if (typeof error === 'object' && error.status >= 400) {
							// show unsuccess popup
							return $ionicPopup.alert({
								title: 'Error',
								template: 'Login unsuccessful: ' + error.data.error.message,
								okText: 'OK',
								okType: 'button-assertive',
								cssClass: 'error'
							});
						}

						// process connection error
						$$utilities.processConnectionError(null, error);

					});
				}
				// form is invalid
				else {

				}

			};


		/*
			>> forgot password
		*/

			$scope.forgotPassword = function(form) {
				if (window.cordova) {
					var forgotPasswordUrl = $rootScope.options.adminBaseUrl[$rootScope.options.environment] + 'password/reset';
					window.open(forgotPasswordUrl, '_blank', 'location=no,clearcache=yes,clearsessioncache=yes');
				}

			};

        /*
      		>> set login page custom styles
  		*/
        $scope.$on('$ionicView.beforeEnter', function() {
            document.getElementsByClassName('bar-header')[1].style.backgroundColor = '#7407ff';
            document.getElementsByClassName('bar-header')[1].style.border = 'none';
            document.getElementsByClassName('title-center')[0].style.color = 'white';
            document.getElementsByClassName('title-center')[1].style.color = 'white';
        });

        $scope.$on('$ionicView.beforeLeave', function() {
            document.getElementsByClassName('bar-header')[1].style.backgroundColor = '';
            document.getElementsByClassName('bar-header')[1].style.border = '';
            document.getElementsByClassName('title-center')[0].style.color = '';
            document.getElementsByClassName('title-center')[1].style.color = '';
        });

	})
