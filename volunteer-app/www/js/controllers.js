/*
* CONTENTS
*
* register
*   store the form data
*   populate the projects dropdown
*   loop through the results and push only required items to $scope.projects
*   populate the year of birth dropdown (current year going down to (current year - 110))
*   process the form
* login
* dashboard
* log hours
* view logs
* settings
*/

angular.module('app.controllers', [])

// > register
.controller('RegisterController', ['$scope', '$stateParams', '$http', 
function ($scope, $stateParams, $http) {

	// >> store the form data
	$scope.formData = {};

	// >> populate the projects dropdown
	$scope.projects = [];
	$http({
		method: 'GET',
		url: 'http://powertochangeadmin.stage2.reason.digital/api/v1/projects'
	}).success(function (result) {
		console.log(result.data);
		$scope.projects = result.data;
		// >> loop through the results and push only required items to $scope.projects
		for (var i = 0, len = result.data.length; i < len; i++) {
			$scope.projects[i] = {id: result.data[i].id, name: result.data[i].name};
		}
	});

	// >> populate the year of birth dropdown (current year going down to (current year - 110))
	$scope.years = [];
	var highestYear = new Date().getFullYear(),
		lowestYear = highestYear - 110;
	while(highestYear >= lowestYear) {
		$scope.years.push(highestYear--);
	}

	// >> process the form
	$scope.processForm = function() {

		$http({
			method: 'POST',
			url: 'http://powertochangeadmin.stage2.reason.digital/api/v1/users',
			data: $.param($scope.formData),
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		}).success(function(data) {

			console.log(data);

			if (!data.success) {
				// if not successful, bind errors to error variables
				// $scope.errorName = data.errors.name;
				// $scope.errorSuperhero = data.errors.superheroAlias;
			}
			else {
				// if successful, bind success message to message
				$scope.message = data.message;
			}

		});

	};

}])

// > login
.controller('LoginController', ['$scope', '$stateParams',
function ($scope, $stateParams) {

}])

// > dashboard
.controller('DashboardController', ['$scope', '$stateParams',
function ($scope, $stateParams) {

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

}])

// > log hours
.controller('LogHoursController', ['$scope', '$stateParams',
function ($scope, $stateParams) {

	// get today's date
	$scope.today = new Date();

}])
   
// > view logs
.controller('ViewLogsController', ['$scope', '$stateParams', '$state',
function ($scope, $stateParams, $state) {

	// logs
	$scope.logs = [
		{
			id: 1,
			hours: 7,
			date: '2016-07-28',
			project: 'Regather Co-op'
		},
		{
			id: 2,
			hours: 6,
			date: '2016-07-27',
			project: 'Regather Co-op'
		},
		{
			id: 3,
			hours: 7,
			date: '2016-07-26',
			project: 'Leeds Community Homes'
		},
		{
			id: 4,
			hours: 5,
			date: '2016-07-25',
			project: 'Regather Co-op'
		},
		{
			id: 5,
			hours: 3,
			date: '2016-07-24',
			project: 'Sheffield Renewables'
		}
	];

	// edit log
	$scope.logId = $state.params.id;

	// delete log
	$scope.delete = function(log) {
		var index = $scope.logs.indexOf(log);
		$scope.logs.splice(index, 1);
	}

}])

// > settings
.controller('SettingsController', ['$scope', '$stateParams',
function ($scope, $stateParams) {

}])