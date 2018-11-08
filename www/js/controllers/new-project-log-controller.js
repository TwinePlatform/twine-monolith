/*
* CONTENTS
*
* new meeting controller
*    store the form data
*    setup datepickers
*    populate hours dropdown
*    populate minutes dropdown
*    calculate duration
*    populate user_id field
*    process the new meeting form
*      validate form
*      submit form
*    push to offline data
*/

/*
	> new meeting controller
*/

	angular.module('app.controllers').controller('NewProjectController', function (
		$scope, $state, $ionicLoading, $rootScope, $$api, $$utilities, $$shout
	) {

		/*
				>> store data
		*/
			$scope.formData = {};


		/*
			>> process the new outreach form
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

					// if offline mode active, push to offline data
					if ($rootScope.offlineMode) {

						$$shout('Cannot create new project in offline mode');
						return;

					}

					// not offline mode, submit the form

						// >>> submit form
						$$api.projects.new({ name: $scope.formData.name }).success(function (result) {

							// hide loader
							$ionicLoading.hide();

							$$shout('Project saved!');

							$state.go('tabs.view-logs.projects');

						}).error(function(data, error) {

							// process connection error
							$$utilities.processConnectionError(data, error);

						});

				}
				// form is invalid
				else {
					$$shout('Application error. Please contact the administrator.');
				}

			};
	})
