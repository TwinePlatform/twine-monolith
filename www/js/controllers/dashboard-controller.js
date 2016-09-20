/*
* CONTENTS
*
* dashboard controller
*   refresh dashboard
*    update overall total hours
*    update last 7 days hours
*    update last 30 days hours
*    update chart and today's hours
*   generate chart
*   custom tooltip
*   on enter view
*   on leave view
*/

/*
	> dashboard controller
*/

	angular.module('app').controller('DashboardController', ['$scope', '$stateParams', '$http', '$localStorage', '$rootScope', '$filter', 
	function ($scope, $stateParams, $http, $localStorage, $rootScope, $filter) {

		/*
			>> refresh dashboard
		*/

			$scope.refreshDashboard = function() {


				/*
					>>> update overall total hours
				*/

					$scope.totalHours = -1;

					$http({
						method: 'GET',
						url: api('logs/user/' + $localStorage.user.id + '/total')
					}).success(function (result) {
						
						$scope.totalHours = result.data.total;
						$scope.totalHoursString = getHoursAndMinutesAsString(result.data.total);

					}).error(function (result, error) {
						
						// process connection error
						processConnectionError(result, error);

					});


				/* 
					>>> update last 7 days hours
				*/

					$scope.last7DaysHours = -1;

					$http({
						method: 'GET',
						url: api('logs/user/' + $localStorage.user.id + '/total/days/7')
					}).success(function (result) {
						
						$scope.last7DaysHours = getHoursAndMinutesAsString(result.data.total);

					}).error(function (result, error) {
						
						// process connection error
						processConnectionError(result, error);

					});

				/*
					>>> update last 30 days hours
				*/

					$scope.last30DaysHours = -1;

					$http({
						method: 'GET',
						url: api('logs/user/' + $localStorage.user.id + '/total/days/30')
					}).success(function (result) {
						
						$scope.last30DaysHours = getHoursAndMinutesAsString(result.data.total);

					}).error(function (result, error) {
						
						// process connection error
						processConnectionError(result, error);

					});

				/*
					>>> update chart and today's hours
				*/

					$scope.todaysTotalHours = -1;

					// get last 7 logs
					$http({
						method: 'GET',
						url: api('logs/user/' + $localStorage.user.id)
					}).success(function (result) {
						
						// arrays and variables
						$scope.labels = [];
						$scope.hours = [];
						$scope.barColor = '#0378B5';
						$scope.tooltipFunction = customTooltip;

						// get logs
						var logs = result.data.logs;

						// sort the logs by date_of_log in reverse
						logs = logs.sort(sortBy(
							'date_of_log' 	// field to sort by
						));

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

										// add to todays total hours
										$scope.todaysTotalHours += logs[i].duration;
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

							// add 1 to todaysTotalHours (it starts on -1)
							$scope.todaysTotalHours++;
							$scope.todaysTotalHoursString = getHoursAndMinutesAsString($scope.todaysTotalHours);

						}

						// generate the chart
						$scope.generateChart($scope.labels, $scope.hours);

					}).error(function (result, error) {
						
						// process connection error
						processConnectionError(result, error);

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
				tooltipDurationString = getHoursAndMinutesAsString(parseInt(tooltipDuration));

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


	}])