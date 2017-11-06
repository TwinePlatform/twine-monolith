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

	angular.module('app.controllers').controller('NewMeetingLogController', function (
		$scope, $stateParams, $http, $state, $filter, $ionicLoading, $localStorage, $rootScope, $timeout,
		$$api, $$utilities, $$shout, $$offline
	) {

        /*
            >> populate meetingTypes dropdown
        */

        $scope.meetingTypesDisabled = true;
        $scope.meetingTypes = [];
        $scope.outreachTypes = [];
        $scope.outreachChildTypes = [];
        $scope.formData = {
            outreach : null,
            outreachChild : null
		};

        $$api.meetingTypes.get().success(function (result) {
            // loop through the results and push only required items to $scope.meetingTypes
            for (var i = 0, len = result.data.length; i < len; i++) {
                $scope.meetingTypes[i] = {id: result.data[i].id, name: result.data[i].name};
            }
            // enable meetingTypes select
            $scope.meetingTypesDisabled = false;

        }).error(function (result, error) {

            // process connection error
            $$utilities.processConnectionError(result, error);

        });

        $$api.outreach.getTypes().success(function (result) {
        	console.log(result);
            if (result !== undefined && result !== null) {
            	$scope.outreachTypes = result.data;
			}
        }).error(function (result, error) {

        	console.log(error);

            // process connection error
            $$utilities.processConnectionError(result, error);

        });

        $scope.$watch('formData', function (newVal) {
        	if (newVal !== null && newVal !== undefined && newVal.outreach !== undefined && newVal.outreach !== null) {
        		$$api.outreach.getChildTypes(newVal.outreach)
					.success(function (result) {
						if (result !== undefined && result !== null && result.data !== undefined && result.data !== null) {
							$scope.outreachChildTypes = result.data;
							$scope.partner = null;
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

			$('#createMeeting .datepicker').pickadate({
				min: $$utilities.getDateFirstOfMonth(),
				date: new Date(),
				container: '.datepicker-container',
				clear: false,
				onStart: function () {
					// set date to today initially
				    var date = new Date();
				    this.set('select', [date.getFullYear(), date.getMonth(), date.getDate()] )

				    // add date to scope in correct format
				    $scope.formData.date = $filter('date')(this.component.item.select.pick, 'yyyy-MM-dd');

				    // add current time
				    $scope.formData.date = $scope.formData.date + ' ' + $$utilities.getCurrentTimeAsString();
				},
				onSet: function(context) {
					// add date to scope in correct format
					$scope.formData.date = $filter('date')(context.select, 'yyyy-MM-dd');

					// add current time
					$scope.formData.date = $scope.formData.date + ' ' + $$utilities.getCurrentTimeAsString();

				}
			});


		/*
			>> populate user_id field
		*/

			$scope.formData.user_id = $localStorage.user.id;


		/*
			>> process the new meeting form
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

						// push to offline data, mark as 'needs_pushing'
						$scope.newMeetingOffline($scope.formData, true, 'Meeting saved offline.');

					}

					// not offline mode, submit the form
					else {

						console.log($scope.formData);

						$scope.sendData = {
							type : $scope.formData.type.id,
							partner : $scope.formData.outreachChild,
							user_id : $rootScope.currentUser.id,
							organisation_id : $scope.formData.outreach,
							date: $scope.formData.date
						};

						// >>> submit form
						$$api.meetings.new($.param($scope.sendData)).success(function (result) {

							// hide loader
							$ionicLoading.hide();

							// create meeting successful
							if (result.success) {

								// push to offline data
								$scope.newMeetingOffline(result.data);

								$$shout('Meeting saved.');

							}

							// create meeting unsuccessful
							else {

								$$shout(result.message);

							}

						}).error(function(data, error) {

							// enable offline mode
							$$offline.enable();

							// push to offline data and mark as 'needs_pushing'
							$scope.newMeetingOffline($scope.formData, true, 'Meeting saved offline.');

							// process connection error
							$$utilities.processConnectionError(data, error);

						});

					}
				}
				// form is invalid
				else {

				}

			};


		/*
			>> push to offline data
		*/

			$scope.newMeetingOffline = function(data, needs_pushing, message) {

				// hide loader
				$ionicLoading.hide();

				if (needs_pushing === undefined) {
					needs_pushing = false;
				}

				// push to offline data
				$$offline.newMeeting(data, needs_pushing);

				// shout message
				if (message !== undefined) {
					$$shout(message);
				}

				// go back to meeting list
				$state.go('tabs.view-logs.meetings');

			}


	})
