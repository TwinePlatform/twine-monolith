/*
* CONTENTS
*
* dashboard controller
*   total hours
*   setup chart
*   refresh dashboard
*/

/*
	> dashboard controller
*/

	angular.module('app').controller('DashboardController', ['$scope', '$stateParams', '$http', '$localStorage', '$rootScope', 
	function ($scope, $stateParams, $http, $localStorage, $rootScope) {

		/*
			>> total hours
		*/

			$scope.updateTotalHours = function() {

				$scope.totalHours = -1;

				$http({
					method: 'GET',
					url: api('logs/user/' + $localStorage.user.id + '/total')
				}).success(function (result) {
					
					console.log(result);
					$scope.totalHours = result.data.total;

				}).error(function (result, error) {
					
					// process connection error
					processConnectionError(result, error);

				});

			}

		/*
			>> setup chart
		*/

			window.count = 0;
			Chart.defaults.global.pointHitDetectionRadius = 1;

			var ctx = document.getElementById("myChart");
			var myChart = new Chart(ctx, {
			    type: 'bar',
			    data: {
			        labels: ['Today', 'Wed 17 Aug', 'Tue 16 Aug', 'Mon 15 Aug', 'Sun 14 Aug', 'Sat 13 Aug', 'Fri 12 Aug'],
			        datasets: [{
			            label: 'Hours',
			            data: [7, 6, 7, 5, 6, 7, 4],
			            // data: [1, 2, 3, 4, 5, 6, 7],
			            backgroundColor: '#0378B5',
			            borderColor: '#0378B5',
			            borderWidth: 1
			        }]
			    },
			    options: {
			    	tooltips: {
			    		enabled: false,
			    		custom: function(tooltip) {
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
								tooltipTitle = tooltip.title[0],
								tooltipHours = tooltip.body[0].lines[0];

							tooltipHours = tooltipHours.replace('Hours: ', '');
							tooltipHours = tooltipHours + ' hours';
							tooltipMarkup += tooltipTitle + ': ';
							tooltipMarkup += '<strong>' + tooltipHours + '</strong>';
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


		/*
			>> on enter view
			   - fired every time view entered
		*/

			$scope.$on('$ionicView.enter', function() {

				// update total hours
				$scope.updateTotalHours();

			})


		/*
			>> on leave view
			   - fired every time view left
		*/

			$scope.$on('$ionicView.leave', function() {

				$scope.totalHours = -1;

			})




		/*
			>> refresh dashboard
			   - (if 'refreshDashboard' is broadcast from another controller)
		*/

			/*$scope.$on('refreshDashboard', function() {

				console.log('refreshDashboard');

				// update total hours
				$scope.updateTotalHours();

			});*/


	}])