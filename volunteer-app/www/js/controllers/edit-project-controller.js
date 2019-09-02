/*
* CONTENTS
*
* edit project controller
*    variables
*    update total duration logged this date
*    setup datepickers
*    show loader
*    populate hours dropdown
*    populate minutes dropdown
*    calculate duration
*    display project data
*    get project data
*    function: generate form date
*    process the edit project form
*      validate form
*      submit edit project form
*/

/*
	> edit project controller
*/

angular.module('app.controllers').controller('EditProjectController', function (
    $scope, $state, $ionicLoading, $rootScope, $$api, $$utilities, $$shout, $$offline
) {

    /*
        >> store Project data
	*/

    $scope.projectId = $state.params.id;
    $scope.project = { name: '' };
    $scope.formData = {};

    /*
        >> show loader
    */

    $ionicLoading.show();

    /*
        >> get project data
    */

    // if offline mode, edit offline project
    if ($rootScope.offlineMode) {

        $$shout('Cannot edit projects in offline mode');
        return;

    }

    // else get project from api
    $$api.projects.getProject($scope.projectId).success(function (data) {

        $ionicLoading.hide();

        $scope.project = data.result;

    }).error(function (result, error) {
        // couldn't connect, send back to view projects and enable offline mode
        $state.go('tabs.view-logs.projects');

        // process connection error
        $$utilities.processConnectionError(result, error);
    });

    /*
        >> process the edit project form
    */

    $scope.formSubmitted = false;
    $scope.processForm = function (form) {

        // >>> validate form

        // variable to show that form was submitted
        $scope.formSubmitted = true;

        // form is valid
        if (form.$valid) {

            // show loader
            $ionicLoading.show();

            // if no internet connection, switch to offline mode
            if (!$$offline.checkConnection()) {
                $$offline.enable();
            }

            // if offline mode, stop
            if ($rootScope.offlineMode) {

                // hide loader
                $ionicLoading.hide();

                // go back to view projects
                $state.go('tabs.view-logs.projects');

                // shout failure
                $$shout('Projects cannot be saved in offline mode');

            }

            // else save to api
            else {

                // >>> submit edit projects form
                $$api.projects.edit($scope.projectId, { name: $scope.formData.name }).success(function (result) {

                    // hide loader
                    $ionicLoading.hide();

                    // shout success
                    $$shout('Project saved succesfully!');

                    $state.go('tabs.view-logs.projects');

                }).error(function (result, error) {

                    // hide loader
                    $ionicLoading.hide();

                    $$shout('Could not edit project. Please try again later.');

                    // go back to view projects
                    $state.go('tabs.view-logs.projects');

                    // process connection error
                    $$utilities.processConnectionError(data, error);

                });

            }

        }
        // form is invalid
        else {
            $$shout('Application error. Please contact the administrator.');
        }

    };

})
