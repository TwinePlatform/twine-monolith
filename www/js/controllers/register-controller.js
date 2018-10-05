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

				// loop through the results and push only required items to $scope.genders
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
			$scope.organisationsByRegion = {};
			$scope.organisations = [];


			$$api.regions.organisations().success(function (data) {

				$scope.organisationsByRegion = data.result

			}).error(function (result, error) {
				
				// hide loader
				$ionicLoading.hide();

				// process connection error
				processConnectionError(result, error);

			});


			$scope.populateOrganisations = function(regionName) {
				if($scope.organisationsByRegion[regionName]){
					$scope.organisations = $scope.organisationsByRegion[regionName]
					$scope.organisationsDisabled = false;
				} else {
					$scope.organisationsDisabled = true;
				}
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

					// if no gender selected, setup an object with empty values
					if ($scope.formData.gender == null) {
						$scope.formData.gender = {
							id: '',
							name: ''
						}
					}

					// >>> submit form data
					$$api.user.register($.param($scope.formData)).success(function(response) {

						// registration successful
						if (response.success) {

							// hide loader
							$ionicLoading.hide();

							// hide click preventer
							$$clickPreventer.hide();

							// store user information
							$localStorage.user = response.data;

                            $rootScope.currentUser = response.data;

							// setup localstorage
							$$utilities.setupLocalStorage();

							// set organisation subheader title
							$rootScope.organisationName = $localStorage.user.organisation.name;

							// show success popup
                            $state.go('tabs.dashboard');

						}

						// registration unsuccessful
						else {

							// hide loader
							$ionicLoading.hide();

							// hide click preventer
							$$clickPreventer.hide();

							// show unsuccess popup
							var alertPopup = $ionicPopup.alert({
							  	title: 'Registration unsuccessful',
							  	template: 'Registration unsuccessful: ' + response.message,
							  	okText: 'OK',
							  	okType: 'button-assertive',
							  	cssClass: 'error'
							});

						}

					}).error(function(data, error) {

						// hide click preventer
						$$clickPreventer.hide();

						// process connection error
						$$utilities.processConnectionError(data, error);

					});
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
