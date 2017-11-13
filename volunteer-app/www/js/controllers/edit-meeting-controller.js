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
				>> store Outreach data
	*/

    $scope.meetingTypes = [];
    $scope.outreachTypes = [];
    $scope.outreachChildTypes = [];
    $scope.organisations = [];

    $scope.formData = {
    };

    /*
				>>> populate Selects
	*/

    $$api.meetingTypes.get().success(function (result) {
        // loop through the results and push only required items to $scope.meetingTypes
        for (var i = 0, len = result.data.length; i < len; i++) {
            $scope.meetingTypes[i] = {id: result.data[i].id, name: result.data[i].name};
        }

    }).error(function (result, error) {

        // process connection error
        $$utilities.processConnectionError(result, error);

    });

    $$api.outreach.getTypes().success(function (result) {

        if (result !== undefined && result !== null) {
            $scope.outreachTypes = result.data;
        }
    }).error(function (result, error) {

        console.log(error);

        // process connection error
        $$utilities.processConnectionError(result, error);

    });

    $$api.organisations.get($rootScope.currentUser.region_id).success(function (result) {

        if (result !== undefined && result !== null) {
            $scope.organisations = result.data;
        }
    }).error(function (result, error) {

        console.log(error);

        // process connection error
        $$utilities.processConnectionError(result, error);

    });


    $scope.$watch('formData', function (newVal, oldVal) {
        if (newVal !== null && newVal !== undefined && newVal.outreach_type !== undefined && newVal.outreach_type !== null && newVal.outreach_type !== oldVal.outreach_type) {
            $$api.outreach.getChildTypes(newVal.outreach_type)
                .success(function (result) {
                    if (result !== undefined && result !== null && result.data !== undefined && result.data !== null) {
                        $scope.outreachChildTypes = result.data;
                    }
                })
                .error(function (result,error) {
                    console.log(error);
                })
        }
    },true);

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
        >> display Outreach data
    */

    $scope.displayOutreachData = function (mainResult) {

        console.log('result: ', mainResult);

        // set datepicker date
        var picker = $datepickerInput.pickadate('picker');
        var dateShort = mainResult.data.date.substring(0, 10);
        picker.set('select', dateShort, {format: 'yyyy-mm-dd'});

        // add to scope
        $scope.formData = mainResult.data;
        // get the offline_id for this outreach from $localStorage
        var offlineOutreach = $.grep($localStorage.offlineData.outreach, function (e) {
            return e.id === $scope.formData.id;
        });
        $scope.formData.offline_id = offlineOutreach[0].offline_id;

        // hide loader
        $ionicLoading.hide();

    };


    /*
        >> get outreach data
    */

    // if offline mode, edit offline outreach
    if ($rootScope.offlineMode) {

        var result = $$offline.getOutreach($state.params.offline_id);

        setTimeout(function () {
            $scope.displayOutreachData(result);
        }, 100);

    }

    // else get outreach from api
    else {

        // get outreach id
        $scope.outreachId = $state.params.id;

        // get outreach from api
        $$api.outreach.get($scope.outreachId).success(function (result) {

            // set initial duration (used for making sure user can't outreach more than 24 hours)
            $scope.displayOutreachData(result);

        }).error(function (result, error) {

            // couldn't connect, send back to view outreach and enable offline mode
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
        >> process the edit outreach form
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
                $$offline.editOutreach({id: $scope.formData.offline_id, idKey: 'offline_id'}, $scope.formData, true);

                // hide loader
                $ionicLoading.hide();

                // go back to view outreach
                $state.go('tabs.view-logs.meetings');

                // shout success
                $$shout('Outreach saved locally!');

            }

            // else save to api
            else {

                // >>> submit edit outreach form
                $$api.outreach.edit($scope.formData.id, $.param($scope.formData)).success(function (result) {

                    // create outreach successful
                    if (result.success) {

                        // hide loader
                        $ionicLoading.hide();

                        // save offline
                        $$offline.editOutreach({id: $scope.formData.id, idKey: 'id'}, result.data);

                        $localStorage.outreach_type = $scope.formData.outreach_type;

                        // go back to view outreach
                        $state.go('tabs.view-logs.meetings');

                        // shout success
                        $$shout('Outreach saved succesfully!');

                    }

                    // create outreach unsuccessful
                    else {

                        $$shout('Edit outreach unsuccessful');

                    }

                }).error(function (result, error) {

                    // if user does not exist, outreach user out
                    if (error === 404) {
                        $$utilities.logOut('This user account no longer exists.');
                    }
                    else {

                        $$shout('Could not edit outreach. Please try again in offline mode.');

                        // enable offline mode
                        $$offline.enable();

                        // go back to view outreach
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


    /*
    >> beforeEnter
   - fired every time view entered
    */

})
