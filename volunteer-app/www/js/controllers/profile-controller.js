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
						$scope.formData.gender = undefined;
					}

					// >>> submit form data
					$$api.user.save($scope.formData).success(function(response) {

						// hide loader
						$ionicLoading.hide();

						// hide click preventer
						$$clickPreventer.hide();

						// store user information
						$localStorage.user = Object.assign({}, $localStorage.user, response.data);

						$rootScope.currentUser = $localStorage.user;

						// set organisation subheader title
						$rootScope.organisationName = $localStorage.user.organisation.name;

						// shout success popup
						$$shout('Your profile was saved!');

					}).error(function(data, error) {

						// hide loader
						$ionicLoading.hide();

						// hide click preventer
						$$clickPreventer.hide();

						// show unsuccess popup
						$$shout('Could not save your profile!');

					});
				}
				// form is invalid
				else {

					$$shout('Application error.');

					// hide loader
					$ionicLoading.hide();

					// hide click preventer
					$$clickPreventer.hide();
				}

			};

	})
