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

					// push to $localStorage array
					$localStorage.offlineData.logs.push(data);
				},

			/*
				>> get logs
			*/

				getLogs: function() {
					return $localStorage.offlineData.logs;
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
				}

		}

		return $$offline;

	})