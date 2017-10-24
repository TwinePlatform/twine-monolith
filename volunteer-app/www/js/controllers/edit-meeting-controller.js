/*
* CONTENTS
*
* edit meeting controller
*    variables
*    update total duration logged this date
*    setup datepickers
*    show loader
*    populate hours dropdown
*    populate minutes dropdown
*    calculate duration
*    display meeting data
*    get meeting data
*    function: generate form date
*    process the edit meeting form
*      validate form
*      submit edit meeting form
*/

/*
	> edit meeting controller
*/

angular.module('app.controllers').controller('EditMeetingController', function ($scope, $stateParams, $state, $http, $ionicLoading, $filter, $localStorage, $rootScope, $timeout,
                                                                                $$api, $$utilities, $$shout, $$offline) {

    /*
				>> populate meetingTypes dropdown
		*/

    $scope.meetingTypesDisabled = true;
    $scope.meetingTypes = [];


    /*
        >> variables
    */

    $scope.formData = {};
    $scope.meetingLoaded = false;


    /*
        >> setup datepickers
    */

    var $datepickerInput = $('.editLog .datepicker').pickadate({
        min: $$utilities.getDateFirstOfMonth(),
        container: '.datepicker-container',
        clear: false,
        onSet: function (context) {
            // add date to scope in correct format
            $scope.formData.date = $filter('date')(context.select, 'yyyy-MM-dd');

            // add current time
            $scope.formData.date = $scope.formData.date + ' ' + $$utilities.getCurrentTimeAsString();
        }
    });


    /*
        >> show loader
    */

    $ionicLoading.show();


    /*
        >> display meeting data
    */

    $scope.displayMeetingData = function (mainResult) {

        console.log('result: ', mainResult);

        // set datepicker date
        var picker = $datepickerInput.pickadate('picker');
        var dateShort = mainResult.data.date.substring(0, 10);
        picker.set('select', dateShort, {format: 'yyyy-mm-dd'});
        $$api.meetingTypes.get().success(function (result) {
            $scope.formData = mainResult.data;
            // loop through the results and push only required items to $scope.meetingTypes
            for (var i = 0, len = result.data.length; i < len; i++) {
                $scope.meetingTypes[i] = {id: result.data[i].id, name: result.data[i].name};
                if ($scope.formData.type === result.data[i].id) {
                    $scope.formData.type = result.data[i];
                }
            }
            // enable meetingTypes select
            $scope.meetingTypesDisabled = false;

            // add to scope
            $scope.formData = mainResult.data;
            // get the offline_id for this meeting from $localStorage
            var offlineMeeting = $.grep($localStorage.offlineData.meetings, function (e) {
                return e.id === $scope.formData.id;
            });
            $scope.formData.offline_id = offlineMeeting[0].offline_id;

            // meeting data has finished loading
            $scope.meetingLoaded = true;

            // hide loader
            $ionicLoading.hide();
        }).error(function (result, error) {

            // process connection error
            $$utilities.processConnectionError(result, error);

        });

    }


    /*
        >> get meeting data
    */

    // if offline mode, edit offline meeting
    if ($rootScope.offlineMode) {

        var result = $$offline.getMeeting($state.params.offline_id);

        setTimeout(function () {
            $scope.displayMeetingData(result);
        }, 100);

    }

    // else get meeting from api
    else {

        // get meeting id
        $scope.meetingId = $state.params.id;

        // get meeting from api
        $$api.meetings.getMeeting($scope.meetingId).success(function (result) {

            // set initial duration (used for making sure user can't meeting more than 24 hours)
            if (angular.isUndefined($scope.initialDuration)) {
                $scope.initialDuration = result.data.duration;
            }

            $scope.displayMeetingData(result);

        }).error(function (result, error) {

            // couldn't connect, send back to view meetings and enable offline mode
            $state.go('tabs.view-logs.meetings');

            // process connection error
            $$utilities.processConnectionError(result, error);

        });

    }


    /*
        >> function: generate form date
    */

    // generate a date in the format 2017-08-30 and add to hidden date field
    $scope.generateFormDate = function () {
        var formDate = $filter('date')($scope.formData.dateRaw, 'yyyy-MM-dd');
        $scope.formData.date = formDate;
    }

    /*
        >> process the edit meeting form
    */

    console.log('$$offline.checkConnection(): ', $$offline.checkConnection());

    $scope.formSubmitted = false;
    $scope.processForm = function (form) {

        // >>> validate form

        // variable to show that form was submitted
        $scope.formSubmitted = true;

        // form is valid
        if (form.$valid) {

            console.log('$scope.formData: ', $scope.formData);

            // show loader
            $ionicLoading.show();

            // if no internet connection, switch to offline mode
            if (!$$offline.checkConnection()) {
                $$offline.enable();
            }

            // if offline mode, save to offline data and marks as needs_pushing
            if ($rootScope.offlineMode) {

                // save offline
                $$offline.editMeeting({id: $scope.formData.offline_id, idKey: 'offline_id'}, $scope.formData, true);

                // hide loader
                $ionicLoading.hide();

                // go back to view meetings
                $state.go('tabs.view-logs.meetings');

                // shout success
                $$shout('Meeting saved locally!');

            }

            // else save to api
            else {

                // >>> submit edit meeting form
                $$api.meetings.edit($scope.formData.id, $.param($scope.formData)).success(function (result) {

                    console.log($scope.formData);

                    console.log('result: ', result);

                    // create meeting successful
                    if (result.success) {

                        // hide loader
                        $ionicLoading.hide();

                        // save offline
                        $$offline.editMeeting({id: $scope.formData.id, idKey: 'id'}, result.data);

                        // go back to view meetings
                        $state.go('tabs.view-logs.meetings');

                        // shout success
                        $$shout('Meeting saved succesfully!');

                    }

                    // create meeting unsuccessful
                    else {

                        $$shout('Edit meeting unsuccessful');

                    }

                }).error(function (result, error) {

                    // if user does not exist, meeting user out
                    if (error === 404) {
                        $$utilities.logOut('This user account no longer exists.');
                    }
                    else {

                        $$shout('Could not edit meeting. Please try again in offline mode.');

                        // enable offline mode
                        $$offline.enable();

                        // go back to view meetings
                        $state.go('tabs.view-logs.meetings');

                        // process connection error
                        $$utilities.processConnectionError(data, error);

                    }

                });

            }

        }
        // form is invalid
        else {
            console.log('form invalid!!');
        }

    };

})
