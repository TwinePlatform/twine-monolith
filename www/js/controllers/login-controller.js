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

							$rootScope.currentUser = result.data;

							// setup local storage
							$$utilities.setupLocalStorage();

							// set organisation subheader title
							$rootScope.organisationName = $localStorage.user.organisation.name;

              if ($localStorage.user.role_id===2) {
                console.log($localStorage.user);
                // go to volunteers
                $state.go('tabs.view-volunteers');
              } else {
                // go to dashboard
                $state.go('tabs.dashboard');
							}

						}

						// login unsuccessful
						else {

							// hide loader
							$ionicLoading.hide();

							// show unsuccess popup
							var alertPopup = $ionicPopup.alert({
							  	title: 'Error',
							  	template: 'Login unsuccessful: ' + result.message,
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
