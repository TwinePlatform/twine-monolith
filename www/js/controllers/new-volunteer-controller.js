/*
* CONTENTS
*
* newVolunteer controller
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
	> newVolunteer controller
*/

angular.module('app').controller('NewVolunteerController', function ($scope, $stateParams, $http, $state, $ionicPopup, $ionicLoading, $localStorage, $ionicModal, $rootScope,
                                                                     $$api, $$clickPreventer, $$utilities, $$shout) {

    $scope.$on('$ionicView.beforeEnter', function () {
        if (!$localStorage.user || $localStorage.user.role_id !== 2) {
            // go back to dashboard
            $state.go('tabs.dashboard');
        }
    });

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
        >> process the form
    */

    $scope.formSubmitted = false;
    $scope.processForm = function (form) {

        // >>> validate form

        // variable to show that form was submitted
        $scope.formSubmitted = true;

        // show click preventer
        $$clickPreventer.show();

        // show loader
        $ionicLoading.show();

        // form is valid
        if (form.$valid) {
            $scope.formData.organisation = $localStorage.user.organisation;
            $scope.formData.region = $localStorage.user.region;
            // if no gender selected, setup an object with empty values
            if ($scope.formData.gender == null) {
                $scope.formData.gender = {
                    id: '',
                    name: ''
                }
            }

            // >>> submit form data
            $$api.volunteers.new($.param($scope.formData)).success(function (response) {

                // adding successful
                if (response.success) {

                    // hide loader
                    $ionicLoading.hide();

                    // hide click preventer
                    $$clickPreventer.hide();

                    $$shout('Volunteer added.');

                    // go back to volunteers list
                    $state.go('tabs.view-volunteers');

                }

                // adding unsuccessful
                else {

                    $$shout(result.message);

                }

            }).error(function (data, error) {

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

});
