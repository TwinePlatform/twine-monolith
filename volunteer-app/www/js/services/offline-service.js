/*
* CONTENTS
*
* offline service
*    check connection
*    enable offline mode
*    disable offline mode
*    new log
*    get logs
*    get log
*    edit log
*    delete log
*    save logs
*    generate offline id
*    total hours
*/

/*
	> offline service
	  - handles all offline data interactions
*/

	angular.module('app.services').factory('$$offline', function(
		$rootScope, $localStorage, $filter, 
		$$utilities
	) {

		var $$offline = {

			/*
				>> check connection
			*/

				checkConnection: function() {

					var connectionAvailable;

					if (window.cordova) {
						var networkState = navigator.connection.type;


					    var states = {};
					    states[Connection.UNKNOWN]  = 'Unknown connection';
					    states[Connection.ETHERNET] = 'Ethernet connection';
					    states[Connection.WIFI]     = 'WiFi connection';
					    states[Connection.CELL_2G]  = 'Cell 2G connection';
					    states[Connection.CELL_3G]  = 'Cell 3G connection';
					    states[Connection.CELL_4G]  = 'Cell 4G connection';
					    states[Connection.CELL]     = 'Cell generic connection';
					    states[Connection.NONE]     = 'No network connection';

					    if (networkState !== Connection.NONE) {
					    	connectionAvailable = true;
					    }
					    else {
					    	connectionAvailable = false;
					    }

					}

					else {
						connectionAvailable = navigator.onLine;
					}

				    return connectionAvailable;
				    
				},

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
					    	// delete it
					        $localStorage.offlineData.logs.splice(i,1);
					        break;
					    }
					}

					// add offline_id to data if there isn't one
					if (idObject.idKey === 'id') {
						data.offline_id = offline_id;
					}

					// remove delete_at attribute if equal to nothing (as this was causing logs to be deleted at the server side on subsequent syncs)
					if (data.deleted_at === null) {
						delete data.deleted_at;
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
				>> save logs
			*/

				saveLogs: function(logs) {

					// clear offline logs data
					$localStorage.offlineData.logs = [];

					// filter out deleted logs
					logs = $filter('filter')(logs, {
						'deleted_at': null
					});

					// filter by organisation id
					logs = $filter('filter')(logs, { 
						'organisation_id': $localStorage.user.organisation_id
					});

					// loop through each log in the response and put back into offline data with a unique offline_id
					for (i = 0; i < logs.length; i++) {

						// duplicate the current log
						var newOfflineLog = logs[i];

						// add an offline_id to the log
						newOfflineLog.offline_id = i + 1;

						// remove delete_at attribute if equal to nothing (as this was causing logs to be deleted at the server side on subsequent syncs)
						if (newOfflineLog.deleted_at === null) {
							delete newOfflineLog.deleted_at;
						}

						// push the log to $localStorage
						$localStorage.offlineData.logs.push(newOfflineLog);

					}

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