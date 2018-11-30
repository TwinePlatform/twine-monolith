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
        if (!$localStorage.user || ['VOLUNTEER_ADMIN', 'CB_ADMIN'].includes($localStorage.user.role)) {
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

        $scope.genders = result.data;

        // enable genders select
        $scope.gendersDisabled = false;

    }).error(function (result, error) {

        // process connection error
        $$utilities.processConnectionError(result, error);

    });

    $ionicModal.fromTemplateUrl('templates/partials/pass-modal.html', {
        scope: $scope,
        animation: 'slide-in-left'
    }).then(function(modal) {
        $scope.passModal = modal;
    });

    $scope.infoShow = function () {
        $scope.passModal.show();
    };


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
            $scope.formData.role = 'VOLUNTEER';
            $scope.formData.organisationId = $localStorage.user.organisation.id;
            
            if($scope.formData.gender){
                $scope.formData.gender = $scope.formData.gender.name;
            }

            // >>> submit form data
            $$api.user.register($scope.formData).success(function (response) {

                // hide loader
                $ionicLoading.hide();

                // hide click preventer
                $$clickPreventer.hide();

                $$shout('Volunteer added.');

                // go back to volunteers list
                $state.go('tabs.view-volunteers');

            }).error(function (error) {

                // hide loader
                $ionicLoading.hide();

                $$shout(error.error.message);

                // hide click preventer
                $$clickPreventer.hide();

                // process connection error
                $$utilities.processConnectionError(error);

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
