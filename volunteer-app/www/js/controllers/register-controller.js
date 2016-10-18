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
		$$api, $$clickPreventer, $$utilities
	) {

		/*
			>> if user has access token, log straight in
		*/

			if ($localStorage.user && $localStorage.user.api_token !== '') {
				$state.go('tabs.dashboard');
			}

		/*
			>> store the form data
		*/

			$scope.formData = {};

		/*
			>> populate year of birth dropdown (current year going down to (current year - 110))
		*/

			$scope.years = $$utilities.getYearsOptions();

		/*
			>> populate gender dropdown
		*/

			// $scope.genders = ['Male', 'Female', 'Trans male', 'Trans female', 'Other', 'Non-binary', 'Rather not say'];

			$scope.gendersDisabled = true;
			$scope.genders = [];

			$$api.genders.get().success(function (result) {
				
				// loop through the results and push only required items to $scope.genders
				for (var i = 0, len = result.data.length; i < len; i++) {
					$scope.genders[i] = {id: result.data[i].id, name: result.data[i].name};
				}

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
				
				// loop through the results and push only required items to $scope.regions
				for (var i = 0, len = result.data.length; i < len; i++) {
					$scope.regions[i] = {id: result.data[i].id, name: result.data[i].name};
				}

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

				// get selected region id
				$scope.regionId = $scope.formData.region.id;

				$$api.organisations.get($scope.regionId).success(function (result) {

					// loop through the results and push only required items to $scope.organisations
					for (var i = 0, len = result.data.length; i < len; i++) {
						$scope.organisations[i] = {id: result.data[i].id, name: result.data[i].name};
					}

					// enable organisation select 
					$scope.organisationsDisabled = false;

				}).error(function (result, error) {
					
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

							// set organisation subheader title
							$rootScope.organisationName = $localStorage.user.organisation.name;

							// show success popup
							var alertPopup = $ionicPopup.alert({
							  	title: 'Registration successful!',
							  	template: 'Welcome to ' + $localStorage.user.organisation.name + ', ' + $localStorage.user.name + '!',
							  	okText: 'Start logging time'
							});

							// go to dashboard
							alertPopup.then(function(res) {
							  	$state.go('tabs.dashboard');
							});

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



	})