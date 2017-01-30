/*
* CONTENTS
*
* profile controller
*    store the form data
*    populate name, email, password, phone number
*    populate year of birth dropdown (current year going down to (current year - 110))
*    populate gender dropdown
*    populate region dropdown
*    populate organisation dropdown
*      loop through the results and push only required items to $scope.organisations
*    process save user form
*      validate form
*      submit form data
*/

/*
	> profile controller
*/

	angular.module('app').controller('ProfileController', function (
		$scope, $localStorage, $rootScope, $ionicLoading,  
		$$utilities, $$api, $$clickPreventer, $$shout
	) {

		/*
			>> store the form data
		*/

			$scope.formData = {};


		/*
			>> populate name, email, password, phone number
		*/

			// name
			$scope.formData.name = $localStorage.user.name;

			// email
			$scope.formData.email = $localStorage.user.email;

			// phone
			$scope.formData.phone = $localStorage.user.phone;

		/*
			>> populate year of birth dropdown (current year going down to (current year - 110))
		*/

			$scope.years = $$utilities.getYearsOptions();

			// get user's yearOfBirth
			var yearOfBirth = parseInt($localStorage.user.yearOfBirth);

			// get position of user's yearOfBirth in $scope.years array
			var yearOfBirthPosition = $scope.years.map(function(x) {return x; }).indexOf(yearOfBirth);

			// set the value of formData.yearOfBirth to that item
			$scope.formData.yearOfBirth = $scope.years[yearOfBirthPosition];
				
		/*
			>> populate gender dropdown
		*/

			$scope.gendersDisabled = true;
			$scope.genders = [];

			$$api.genders.get().success(function (result) {
				
				// loop through the results and push only required items to $scope.genders
				for (var i = 0, len = result.data.length; i < len; i++) {
					$scope.genders[i] = {id: result.data[i].id, name: result.data[i].name};

					// when for loop complete
					if (i === len - 1) {

						// enable genders select
						$scope.gendersDisabled = false;

						// if theres a gender in localstorage
						if ($localStorage.user.gender !== undefined) {

							// get user's gender
							var gender = $localStorage.user.gender.name;

							// get position of user's gender in $scope.years array
							var genderPosition = $scope.genders.map(function(x) {return x.name; }).indexOf(gender);

							// set the value of formData.gender to that item
							$scope.formData.gender = $scope.genders[genderPosition];

						}

					}
				}


			}).error(function (result, error) {
				
				// process connection error
				$$utilities.processConnectionError(result, error);

			});			


		/*
			>> populate region dropdown
		*/

			$scope.regionsDisabled = true;
			$scope.regions = [];

			$$api.regions.get($localStorage.user.organisation.id).success(function (result) {
				
				// loop through the results and push only required items to $scope.regions
				for (var i = 0, len = result.data.length; i < len; i++) {
					$scope.regions[i] = {id: result.data[i].id, name: result.data[i].name};

					// when for loop complete
					if (i === len - 1) {

						// get user's region id
						var regionId = parseInt($localStorage.user.region.id);

						// get position of user's region in $scope.regions array
						var regionPosition = $scope.regions.map(function(x) {return x.id; }).indexOf(regionId);

						// set the value of formData.region to that item
						$scope.formData.region = $scope.regions[regionPosition];

					}
				}

				// enable regions select
				$scope.regionsDisabled = false;

			}).error(function (result, error) {
				
				// process connection error
				processConnectionError(result, error);

			});


		/*
			>> populate organisation dropdown
		*/

			$scope.organisationsDisabled = true;
			$scope.organisations = [];

			$scope.populateOrganisations = function(regionId) {

				// if no region is selected, empty & disable organisations
				if (regionId === undefined) {
					$scope.organisations = [];
					$scope.organisationsDisabled = true;
				}
				// otherwise get the organisations
				else {

					$$api.organisations.get(regionId).success(function (result) {

						$scope.organisations = result.data;
						// >>> loop through the results and push only required items to $scope.organisations
						for (var i = 0, len = result.data.length; i < len; i++) {
							$scope.organisations[i] = {id: result.data[i].id, name: result.data[i].name};

							// when for loop complete
							if (i === len - 1) {

								$scope.organisationsLoaded = true;

								// get user's organisation id
								var orgId = parseInt($localStorage.user.organisation.id);

								// get position of user's organsation in $scope.organisations array
								var organisationPosition = $scope.organisations.map(function(x) {return x.id; }).indexOf(orgId);

								// set the value of formData.organisation to that item
								$scope.formData.organisation = $scope.organisations[organisationPosition];

								// hide loader
								$ionicLoading.hide();

							}
						}

						// enable organisation select 
						$scope.organisationsDisabled = false;

					}).error(function (result, error) {
						
						// hide loader
						$ionicLoading.hide();

						// process connection error
						processConnectionError(result, error);

					});
				}

			}

			// populate on first load by localStorage region id
			$scope.populateOrganisations($localStorage.user.region.id);


		/*
			>> process save user form
		*/

			$scope.formSubmitted = false;
			$scope.saveUser = function(form) {

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
					$$api.user.save($localStorage.user.id, $.param($scope.formData)).success(function(response) {

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

							// shout success popup
							$$shout('Your profile was saved!');

						}

						// registration unsuccessful
						else {

							// hide loader
							$ionicLoading.hide();

							// hide click preventer
							$$clickPreventer.hide();

							// show unsuccess popup
							$$shout('Could not save your profile!');

						}

					}).error(function(data, error) {

						// shout error
						$$shout('Your account has not been approved'); // this is not specific enough

						// hide click preventer
						$$clickPreventer.hide();

						// process connection error
						$$utilities.processConnectionError(data, error);

					});
				}
				// form is invalid
				else {

					console.log('form invalid');

					// hide loader
					$ionicLoading.hide();

					// hide click preventer
					$$clickPreventer.hide();
				}

			};

	})