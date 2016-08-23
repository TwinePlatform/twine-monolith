/*
* CONTENTS
*
* view logs controller
*   populate logs
*   edit log
*   delete log
*/

/*
	> view logs controller
*/

	angular.module('app').controller('ViewLogsController', ['$scope', '$stateParams', '$state',
	function ($scope, $stateParams, $state) {

		/*
			>> populate logs
		*/

			$scope.logs = [
				{
					id: 1,
					hours: 7,
					date: '2016-07-28',
					organisation: 'Regather Co-op'
				},
				{
					id: 2,
					hours: 6,
					date: '2016-07-27',
					organisation: 'Regather Co-op'
				},
				{
					id: 3,
					hours: 7,
					date: '2016-07-26',
					organisation: 'Leeds Community Homes'
				},
				{
					id: 4,
					hours: 5,
					date: '2016-07-25',
					organisation: 'Regather Co-op'
				},
				{
					id: 5,
					hours: 3,
					date: '2016-07-24',
					organisation: 'Sheffield Renewables'
				}
			];


		/*
			>> edit log
		*/

			$scope.logId = $state.params.id;


			// >>> check for new date and update date input value
			//	   (there was an issue with using value or ng-value attributes)

			setTimeout(function(){

				$logDate = $('input.log-date');

				if ($logDate.val() !== $logDate.data('value')) {
					$logDate.val($logDate.data('value'));
				}

			}, 100);

		/*
			>> delete log
		*/
		
			$scope.delete = function(log) {
				var index = $scope.logs.indexOf(log);
				$scope.logs.splice(index, 1);
			}

	}])