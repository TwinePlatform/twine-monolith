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
			$scope.formData.phoneNumber = $localStorage.user.phoneNumber;
			
			// gender
			$scope.formData.gender = $localStorage.user.gender;

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
				
				$scope.genders = result.data 
				$scope.gendersDisabled = false;

				if ($localStorage.user.gender) {
					$scope.formData.gender = $localStorage.user.gender
				}

			}).error(function (result, error) {
				
				// process connection error
				$$utilities.processConnectionError(result, error);

			});


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

              $rootScope.currentUser = response.data;

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