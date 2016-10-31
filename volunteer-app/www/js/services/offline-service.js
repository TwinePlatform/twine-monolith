/*
* CONTENTS
*
* offline service
*    enable offline mode
*    disable offline mode
*    new log
*    get logs
*    delete log
*    generate offline id
*/

/*
	> offline service
	  - handles all offline data interactions
*/

	angular.module('app.services').factory('$$offline', function($rootScope, $localStorage, $filter, $$utilities) {

		var $$offline = {

			/*
				>> enable offline mode
			*/

				enable: function() {
					$rootScope.offlineMode = true;
					$localStorage.offlineMode = true;
				},

			/*
				>> disable offline mode
			*/

				disable: function() {
					$rootScope.offlineMode = false;
					$localStorage.offlineMode = false;
				},

			/*
				>> new log
			*/

				newLog: function(data, needs_pushing) {

					// mark as needs_pushing if necessary
					if (needs_pushing) {
						data.needs_pushing = true;
					}

					// generate an offline id
					data.offline_id = $$offline.generateOfflineId();

					// add organisation id
					data.organisation_id = $localStorage.user.organisation.id;

					// set id to empty string if it doesn't exist
					if (data.id === undefined) {
						console.log('data.id undefined, set it to ""');
						data.id = '';
					}

					// push to $localStorage array
					$localStorage.offlineData.logs.push(data);
				},

			/*
				>> get logs
			*/

				getLogs: function() {
					var allLogs = $localStorage.offlineData.logs,
						filteredLogs = $filter('filter')(allLogs, {'organisation_id': $localStorage.user.organisation.id});
					return filteredLogs;
				},

			/*
				>> get log
			*/

				getLog: function(offline_id) {
					var logData = $filter('filter')($localStorage.offlineData.logs, {'offline_id': offline_id});
					var result = {
						data: logData[0]
					}
					return result;
				},

			/*
				>> edit log
			*/

				edit: function(idObject, data, needs_pushing) {

					// mark as needs_pushing if necessary
					if (needs_pushing) {
						data.needs_pushing = true;
					}

					// remove old item from $localStorage array, but grab offline_id first
					for (var i = 0; i < $localStorage.offlineData.logs.length; i++) {
					    if ($localStorage.offlineData.logs[i][idObject.idKey] === idObject.id) { 
					    	// grab offline id for later
					    	var offline_id = $localStorage.offlineData.logs[i].offline_id;
					    	console.log('offline_id: ', offline_id);
					    	// delete it
					        $localStorage.offlineData.logs.splice(i,1);
					        break;
					    }
					}

					// add offline_id to data if there isn't one
					if (idObject.idKey === 'id') {
						data.offline_id = offline_id;
					}

					// push new data back into $localStorage array
					$localStorage.offlineData.logs.push(data);
				},

			/*
				>> delete log
			*/

				deleteLog: function(idObject, needs_pushing) {

					// loop through the offline logs
					$.each($localStorage.offlineData.logs, function(i, el){

					    if (this[idObject.idKey] === idObject.id){

					    	// mark as deleted_at
					        this.deleted_at = $$utilities.getCurrentDateAndTimeAsString();

					        // mark as needs_pushing if necessary
					        if (needs_pushing) {
					        	this.needs_pushing = true;
					        }

					    }
					});
				},

			/*
				>> generate offline id
			*/

				generateOfflineId: function(offline_id) {
					return $localStorage.offlineData.logs.length + 1;
				},

			/*
				>> total hours
			*/

				totalHours: function(organisation_id) {

					var totalDuration = 0;

					// loop through all offline logs and add up duration
					for (var i = 0; i < $localStorage.offlineData.logs.length; i++) {
						if ($localStorage.offlineData.logs[i].organisation_id == organisation_id) {
							totalDuration += $localStorage.offlineData.logs[i].duration;
						}
					}

					return totalDuration;
				}

		}

		return $$offline;

	})