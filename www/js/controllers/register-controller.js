/*
* CONTENTS
*
* register controller
*    if user has access token, log straight in
*    store the form data
*    populate year of birth dropdown (current year going down to (current year - 110))
*    populate gender dropdown
*    populate region dropdown
*    populate organisation dropdown
*    process the form
*      validate form
*      submit form data
*    terms & conditions modal
*/

/*
	> register controller
*/

	angular.module('app').controller('RegisterController', function (
		$scope, $stateParams, $http, $state, $ionicPopup, $ionicLoading, $localStorage, $ionicModal, $rootScope, 
		$$api, $$clickPreventer, $$utilities, $$offline
	) {

		/*
			>> if user has access token, log straight in
		*/
			if ($localStorage.user && $localStorage.user.api_token !== '') {
				if ($localStorage.user.role_id === 2) {
					$state.go('tabs.view-volunteers')
                } else {
                    $state.go('tabs.dashboard');
                }
			}

		/*
			>> store the form data
		*/

			$scope.formData = {};
			$scope.selected = {};
			$scope.syncOfflineData =  $rootScope.syncOfflineData;

		/*
			>> populate year of birth dropdown (current year going down to (current year - 110))
		*/

			$scope.years = $$utilities.getYearsOptions();

		/*
			>> populate gender dropdown
		*/

			$scope.gendersDisabled = true;
			$scope.genders = [];

			$$api.genders.get().success(function (result) {

				$scope.genders = result.data;

				// enable genders select
				$scope.gendersDisabled = false;

			}).error(function (result, error) {
				
				// process connection error
				$$utilities.processConnectionError(result, error);

			});			

		/*
			>> populate region dropdown
		*/

			$scope.regionsDisabled = true;
			$scope.regions = [];

			$$api.regions.get().success(function (result) {

				// store results on scope
				$scope.regions = result.data;

				// enable regions select
				$scope.regionsDisabled = false;

			}).error(function (result, error) {

				// process connection error
				$$utilities.processConnectionError(result, error);

			});


		/*
			>> populate organisation dropdown
		*/

			$scope.organisationsDisabled = true;
			$scope.organisations = [];


			$scope.populateOrganisations = function() {
				
				$$api.regions.organisations($scope.selected.region.id).success(function (data) {
					$scope.organisations = data.result
					$scope.organisationsDisabled = false;
	
				}).error(function (result, error) {
					
					// hide loader
					$ionicLoading.hide();
	
					// process connection error
					$$utilities.processConnectionError(result, error);

				});
			}


		/*
			>> process the form
		*/

			$scope.formSubmitted = false;
			$scope.processForm = function(form) {
				
				// >>> validate form

				// variable to show that form was submitted
				$scope.formSubmitted = true;

				// show click preventer
				$$clickPreventer.show();

				// show loader
				$ionicLoading.show();

				// form is valid
				if (form.$valid) {

					// form cleanup
					if ($scope.selected.gender) {
						$scope.formData.gender = $scope.selected.gender.name
					}

					if ($scope.selected.organisation) {
						$scope.formData.organisationId = $scope.selected.organisation.id
					}

					if($scope.formData.adminCode) {
						$scope.formData.role = 'VOLUNTEER_ADMIN'
					} else {
						$scope.formData.role = 'VOLUNTEER'
					}

					// >>> submit form data
					$$api.user.register($scope.formData).success(function(response) {

						// hide loader
						$ionicLoading.hide();

						// hide click preventer
						$$clickPreventer.hide();

						// setup localstorage
						$$utilities.setupLocalStorage();

						// store user information
						$localStorage.user = response.result;
						$rootScope.currentUser = response.result;

						// set organisation subheader title
						$rootScope.organisationName = $scope.selected.organisation.name

						// if registration is successful then run login promise chain to gather all user info
						$$api.user.login($scope.formData)
							.then(function(){
								return $$api.user.roles()
							})
							.then((response) => {
								$localStorage.user.role = response.data.result.role;
		
								if ($localStorage.user.role !== undefined && $localStorage.user.role === 'VOLUNTEER_ADMIN') {
									$rootScope.isAdmin = true;
								} else {
									$rootScope.isAdmin = false;
								}
		
								return $$api.organisations.get();
							})
							.then((response) => {
								$localStorage.user.organisation = response.data.result;
		
								if ($rootScope.isAdmin) {
									// go to volunteers
									$state.go('tabs.view-volunteers');
								} else {
									// go to dashboard
									$state.go('tabs.dashboard');
								}
							})
							.catch(function(error) {
								// hide loader
								$ionicLoading.hide();
		
								// hide click preventer
								$$clickPreventer.hide();
		
								// show unsuccess popup
								if (typeof error === 'object' && error.status >= 400) {
									// show unsuccess popup
									return $ionicPopup.alert({
										title: 'Redirect unsuccessful',
										template: error.data.error.message + ', please try to login',
										okText: 'OK',
										okType: 'button-assertive',
										cssClass: 'error'
									});
								}
		
								// process connection error
								$$utilities.processConnectionError(error);
		
							});
					})
					.catch(function(error) {
						// hide loader
						$ionicLoading.hide();

						// hide click preventer
						$$clickPreventer.hide();

						// show unsuccess popup
						if (typeof error === 'object' && error.status >= 400) {
							// show unsuccess popup
							return $ionicPopup.alert({
								title: 'Registration unsuccessful',
								template: 'Registration unsuccessful: ' + error.data.error.message,
								okText: 'OK',
								okType: 'button-assertive',
								cssClass: 'error'
							});
						}

						// process connection error
						$$utilities.processConnectionError(error);

					})
				}
				// form is invalid
				else {
					// hide loader
					$ionicLoading.hide();

					// hide click preventer
					$$clickPreventer.hide();
				}

			};


		/*
			>> terms & conditions modal
		*/
			$scope.browse = function (url) {
                cordova.InAppBrowser.open(url, '_blank', 'location=yes');
            }


			$ionicModal.fromTemplateUrl('templates/partials/terms-and-conditions-modal.html', {
			    scope: $scope,
			    animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.modal = modal;
			});


        // show terms modal
			$scope.termsShow = function() {
				$scope.modal.show();
			};

			// close terms modal
			$scope.termsClose = function() {
			    $scope.modal.hide();
			};


			$ionicModal.fromTemplateUrl('templates/partials/years-modal.html', {
				scope: $scope,
				animation: 'slide-in-left'
			}).then(function(modal) {
				$scope.yearsModal = modal;
			});

			// show terms modal
			$scope.yearsShow = function() {
				$scope.yearsModal.show();
			};

			// close terms modal
			$scope.yearsClose = function() {
				$scope.yearsModal.hide();
			};

			$ionicModal.fromTemplateUrl('templates/partials/code-modal.html', {
				scope: $scope,
				animation: 'slide-in-left'
			}).then(function(modal) {
				$scope.codeModal = modal;
			});

			// show terms modal
			$scope.codeShow = function() {
				$scope.codeModal.show();
			};

			// close terms modal
			$scope.codeClose = function() {
				$scope.codeModal.hide();
			};


			$ionicModal.fromTemplateUrl('templates/partials/gender-modal.html', {
				scope: $scope,
				animation: 'slide-in-left'
			}).then(function(modal) {
				$scope.genderModal = modal;
			});

			// show terms modal
			$scope.genderShow = function() {
				$scope.genderModal.show();
			};

			// close terms modal
			$scope.genderClose = function() {
				$scope.genderModal.hide();
			};

			$scope.terms = function () {
				$scope.yearsClose();
				$scope.genderClose();
				$scope.termsShow();
			};


	})
