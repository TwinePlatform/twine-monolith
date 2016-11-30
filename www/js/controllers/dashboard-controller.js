/*
* CONTENTS
*
* dashboard controller
*    get a link to $localStorage
*    refresh dashboard
*      update status (pending / approved)
*      update overall total hours
*      update last 7 days hours
*      update last 30 days hours
*      update chart
*      update today's total hours
*      update organisation summary
*    generate chart
*    custom tooltip
*    on enter view
*    on leave view
*/

/*
	> dashboard controller
*/

	angular.module('app.controllers').controller('DashboardController', function (
		$scope, $stateParams, $http, $localStorage, $rootScope, $filter, 
		$$api, $$utilities, $$shout, $$offline
	) {

		/*
			>> get a link to $localStorage
		*/

			$scope.$storage = $localStorage;

		/*
			>> refresh dashboard
		*/

			$scope.refreshDashboard = function() {

				/*
					>>> update status (pending / approved)
				*/

					$$api.user.get($localStorage.user.id).success(function(result) {
						$scope.$storage.user.status = result.data.status;
					}).error(function (result, error) {
							
						// process connection error
						$$utilities.processConnectionError(result, error);

					});



				/*
					>>> update overall total hours
				*/

					$scope.totalHours = -1;

					// if offline mode, get offline total hours
					if ($rootScope.offlineMode) {

						$scope.totalHours = $$offline.totalHours($localStorage.user.organisation.id);

					}
					// else get total hours from api
					else {

						$$api.user.totalHours($localStorage.user.id).success(function (result) {
							
							$scope.totalHours = result.data.total;

						}).error(function (result, error) {
							
							// process connection error
							$$utilities.processConnectionError(result, error);

						});

					}


				/* 
					>>> update last 7 days hours
				*/

					$scope.last7DaysHours = -1;

					$$api.user.totalHours($localStorage.user.id, 7).success(function (result) {
						
						$scope.last7DaysHours = result.data.total;

					}).error(function (result, error) {
						
						// process connection error
						$$utilities.processConnectionError(result, error);

					});

				/*
					>>> update last 30 days hours
				*/

					$scope.last30DaysHours = -1;

					$$api.user.totalHours($localStorage.user.id, 30).success(function (result) {
						
						$scope.last30DaysHours = result.data.total;

					}).error(function (result, error) {
						
						// process connection error
						$$utilities.processConnectionError(result, error);

					});

				/*
					>>> update chart
				*/

					$scope.updateChart = function(result) {

						// arrays and variables
						$scope.labels = [];
						$scope.hours = [];
						$scope.barColor = '#0378B5';
						$scope.tooltipFunction = customTooltip;

						// get logs
						var logs = result.data.logs;

						// sort the logs by date_of_log in reverse
						logs = $filter('orderBy')(logs, 'date_of_log');

						// if there have been no hours logged, create a chart with dummy data
						if (logs.length === 0) {
							$scope.labels = ['[1] Today', '[2] Wed 17 Aug', '[3] Tue 16 Aug', '[4] Mon 15 Aug', '[5] Sun 14 Aug', '[6] Sat 13 Aug', '[7] Fri 12 Aug'];
							$scope.hours = [7, 6, 7, 5, 6, 7, 4];
							$scope.barColor = '#dddddd';
							$scope.tooltipFunction = null;
						}

						// else create a chart with real data 
						else {

							// loop 7 times
							for (i = 0; i < 7; i++) {

								// create a counter to add to start of label (e.g. [1])
								var counter = '[' + i + '] ';

								// if a log exists..
								if (logs[i] !== undefined) {
									// get raw date
									var rawDate = logs[i]['date_of_log'].substring(0,10);

									// if the date is today, change to 'Today'
									var rawDateCheck = new Date(rawDate);
									var todaysDateCheck = new Date();
									if (rawDateCheck.setHours(0,0,0,0) === todaysDateCheck.setHours(0,0,0,0)) {
										var niceDate = counter + 'Today';
									}
									// otherwise, use format Mon 5 Aug
									else {
										// get nice date
										var niceDate = counter + $filter('date')(rawDate, 'EEE d MMM');
									}

									// push the date
									$scope.labels.push(niceDate);

									// push the duration
									$scope.hours.push(logs[i]['duration']);
								}
								// else push empty labels and 0 duration
								else {
									$scope.labels.push(counter);
									$scope.hours.push(0);
								}
							}

						}

						// generate the chart
						$scope.generateChart($scope.labels, $scope.hours);

					}

					// if offline mode, get offline logs
					if ($rootScope.offlineMode) {
						result = {
							data: {
								logs: $$offline.getLogs()
							}
						}
						$scope.updateChart(result);
					}
					// else get logs from api
					else {
						// get last 7 logs
						$$api.logs.getLogs($localStorage.user.id).success(function (result) {
							$scope.updateChart(result);
						}).error(function (result, error) {
							// process connection error
							$$utilities.processConnectionError(result, error);
						});
					}


				/*
					>>> update today's total hours
				*/

					$scope.todaysTotalHours = -1;

					// get today's date in sql format yyyy-mm-dd
					var todaysDate = $$utilities.jsDateToSqlDate(new Date());

					$$api.user.totalHoursForDay($localStorage.user.id, todaysDate).success(function (result) {
						$scope.todaysTotalHours = result.data.duration;
					}).error(function (result, error) {
					});


				/*
					>>> update organisation summary
				*/

					$$api.organisations.summary($localStorage.user.organisation.id).success(function (result) {

						// we got what we wanted
						if (result.success) {
							$scope.totalUsers = result.data.totalUsers;
							$scope.totalVolunteeredMinutes = result.data.totalVolunteeredTime;
						}
						// we didn't
						else {
							$$shout("Couldn't retrieve organisation summary.");
						}

					}).error(function (result, error) {
						
						// process connection error
						$$utilities.processConnectionError(result, error);

					});

			}

		/*
			>> generate chart
		*/

			$scope.generateChart = function(labels, hours) {

				// destroy chart
				$('#logsChart').remove();
				$('.chart-container').append('<canvas id="logsChart" class="chart" width="400" height="100"></canvas>');

				// create chart
				var ctx = document.getElementById("logsChart");
				var logsChart = new Chart(ctx, {
				    type: 'bar',
				    data: {
				        // labels: ['Today', 'Wed 17 Aug', 'Tue 16 Aug', 'Mon 15 Aug', 'Sun 14 Aug', 'Sat 13 Aug', 'Fri 12 Aug'],
				        labels: labels,
				        datasets: [{
				            label: 'Hours',
				            // data: [7, 6, 7, 5, 6, 7, 4],
				            data: hours,
				            backgroundColor: $scope.barColor,
				            borderColor: $scope.barColor,
				            borderWidth: 1
				        }]
				    },
				    options: {
				    	tooltips: {
				    		enabled: false,
				    		custom: $scope.tooltipFunction
				    	},
				    	legend: {
				    		display: false
				    	},
				        scales: {
					       	xAxes: [
					       		{
					       			display: false
					       		}
					       	],
				            yAxes: [
				            	{
				                	display: false
				            	}
				            ]
				        }
				    }
				});

			}

		/*
			>> custom tooltip
		*/

			customTooltip = function(tooltip) {
				// Tooltip Element
				var tooltipEl = $('#chartjs-tooltip');

				if (!tooltipEl[0]) {
					$('body').append('<div id="chartjs-tooltip"></div>');
					tooltipEl = $('#chartjs-tooltip');
				}

				// Hide if no tooltip
				if (!tooltip.opacity) {
					tooltipEl.css({
						opacity: 0
					});
					$('.chartjs-wrap canvas')
						.each(function(index, el) {
							$(el).css('cursor', 'default');
						});
					return;
				}

				$(this._chart.canvas).css('cursor', 'pointer');

				// Set caret Position
				tooltipEl.removeClass('above below no-transform');
				if (tooltip.yAlign) {
					tooltipEl.addClass(tooltip.yAlign);
				} else {
					tooltipEl.addClass('no-transform');
				}

				// generate tooltip markup
				var tooltipMarkup = '',
					tooltipTitle = tooltip.title[0].substring(4), // remove e.g. [1] from start of string
					tooltipDuration = tooltip.body[0].lines[0];

				tooltipDuration = tooltipDuration.replace('Hours: ', '');

				// convert duration in to hours and minutes
				tooltipDurationString = $filter('hoursAndMinutesAsString')(tooltipDuration);

				// tooltipDuration = tooltipDuration + ' hours';
				tooltipMarkup += tooltipTitle + ': ';
				tooltipMarkup += '<strong>' + tooltipDurationString + '</strong>';
				$(tooltipEl).html(tooltipMarkup);

				// Find Y Location on page
				var top = 0;
				if (tooltip.yAlign) {
					if (tooltip.yAlign == 'above') {
						top = tooltip.y - tooltip.caretHeight - tooltip.caretPadding;
					} else {
						top = tooltip.y + tooltip.caretHeight + tooltip.caretPadding;
					}
				}

				var position = $(this._chart.canvas)[0].getBoundingClientRect();

				// Display, position, and set styles for font
				tooltipEl.css({
					opacity: 1,
					width: tooltip.width ? (tooltip.width + 'px') : 'auto',
					left: position.left + tooltip.x + 'px',
					// top: position.top + top + 'px',
					top: position.top - 30 + 'px',
					fontFamily: tooltip._fontFamily,
					fontSize: tooltip.fontSize,
					fontStyle: tooltip._fontStyle,
					padding: tooltip.yPadding + 'px ' + tooltip.xPadding + 'px',
				});
    		}



		/*
			>> on enter view
			   - fired every time view entered
		*/

			$scope.$on('$ionicView.enter', function() {

				// update total hours
				$scope.refreshDashboard();

			})


		/*
			>> on leave view
			   - fired every time view left
		*/

			$scope.$on('$ionicView.leave', function() {

				$scope.totalHours = -1;

			})


	})