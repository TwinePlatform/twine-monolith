/*
* CONTENTS
*
* api service
*    url
*    logs
*      delete
*      get logs
*      get log
*      edit log
*      new log
*      sync
*    user
*      get
*      login
*      save user
*      register user
*      total hours
*      total hours for a day
*    genders
*      get genders
*    regions
*      get regions
*    organisations
*      get organisations
*      summary
*/

/*
	> api service
	  - handles all interactions with the api
*/

	angular.module('app.services').factory('$$api', function($http, $rootScope, $localStorage) {

		var $$api = {

			/*
			  >> token
			    Grabs token from localStorage
			 */
			token: {
				get: function () {
					return $localStorage.token;
				},

				set: function (tkn) {
					$localStorage.token = tkn;
				},

				clear: function () {
					delete $localStorage.token;
				}
			},

			/*
				>> url
				  generates an api url e.g. 'user' returns 'http://powertochangeadmindev.stage2.reason.digital/api/v1/user'
	              the environment can be set in options in options.js
			*/

				url: function(url) {
					return $rootScope.options.apiBaseUrl[$rootScope.options.environment] + url;
					// return 'http://powertochangeadmindev.stage2.reason.digital/api/v1/' + url;
				},

			/*
				>> logs
			*/

				logs: {

					/*
						>>> delete
					*/

						delete: function(id) {
							return $http({
								method: 'DELETE',
							  	url: $$api.url('logs/' + id)
							});
						},

					/*
						>>> get logs
					*/

						getLogs: function(userId) {
							return $http({
								method: 'GET',
								url: $$api.url('logs/user/' + userId)
							});
						},

					/*
						>>> get log
					*/

						getLog: function(logId) {
							return $http({
								method: 'GET',
								url: $$api.url('logs/' + logId)
							});
						},

						getAdminLogs : function (userId) {
							return $http({
								method: 'GET',
								url: $$api.url('logs/admin/' + userId)
							});
						},

					/*
						>>> edit log
					*/

						edit: function(logId, data) {
							return $http({
								method: 'PUT',
								url: $$api.url('logs/' + logId),
								data: data,
								headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
							});
						},

					/*
						>>> new log
					*/

						new: function(data) {
							return $http({
								method: 'POST',
								url: $$api.url('logs'),
								data: data,
								headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
							});
						},

					/*
						>>> sync
					*/

						sync: function(data) {
							return $http({
								method: 'POST',
								url: $$api.url('logs/sync'),
								data: data,
								headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
							});
						},


				},

			/*
				>> Meetings
			*/

				meetings: {

					/*
						>>> delete
					*/

						delete: function(id) {
							return $http({
								method: 'DELETE',
							  	url: $$api.url('meetings/' + id)
							});
						},

					/*
						>>> get Meetings
					*/

						getMeetings: function(userId) {
							return $http({
								method: 'GET',
								url: $$api.url('meetings/user/' + userId)
							});
						},

					/*
						>>> get Meeting
					*/

						getMeeting: function(meetingId) {
							return $http({
								method: 'GET',
								url: $$api.url('meetings/' + meetingId)
							});
						},

					/*
						>>> edit Meeting
					*/

						edit: function(meetingId, data) {
							return $http({
								method: 'PUT',
								url: $$api.url('meetings/' + meetingId),
								data: data,
								headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
							});
						},

					/*
						>>> new Meeting
					*/

						new: function(data) {
							return $http({
								method: 'POST',
								url: $$api.url('meetings'),
								data: data,
								headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
							});
						},

					/*
						>>> sync
					*/

						sync: function(data) {
							return $http({
								method: 'POST',
								url: $$api.url('meetings/sync'),
								data: data,
								headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
							});
						},


				},

			/*
				>> user
			*/

				user: {

					/*
						>>> get
					*/

						get: function(userId) {
							return $http({
								method: 'GET',
								url: $$api.url('users/' + userId),
								headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
							});
						},

					/*
						>>> login
					*/

						login: function(data) {
							return $http({
								method: 'POST',
								url: $$api.url('users/login'),
								data: data,
								headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
							});
						},

					/*
						>>> save user
					*/

						save: function(userId, data) {
							return $http({
								method: 'PUT',
								url: $$api.url('users/' + userId),
								data: data,
								headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
							});
						},

					/*
						>>> register user
					*/

						register: function(data) {
							return $http({
								method: 'POST',
								url: $$api.url('users'),
								data: data,
								headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
							});
						},

					/*
						>>> total hours
					*/

						totalHours: function(userId, days) {
							// if days have been specified, grab last x days
							if (days) {
								var url = $$api.url('logs/user/' + userId + '/total/days/' + days)
							}
							// else just grab overall total hours
							else {
								var url = $$api.url('logs/user/' + userId + '/total')
							}
							return $http({
								method: 'GET',
								url: url
							});
						},

					/*
						>>> total hours for a day
					*/

						totalHoursForDay: function(userId, date) {
							var url = $$api.url('logs/user/' + userId + '/total/date/' + date)
							return $http({
								method: 'GET',
								url: url
							});
						}

				},

      /*
        >> Volunteers
      */

      volunteers: {

        /*
          >>> delete
        */

        delete: function(id) {
          return $http({
            method: 'DELETE',
            url: $$api.url('volunteers/' + id)
          });
        },

        /*
          >>> get Volunteers
        */

        getVolunteers: function(organisationId) {
          return $http({
            method: 'GET',
            url: $$api.url('volunteers/organisation/' + organisationId)
          });
        },

        /*
          >>> get Volunteer
        */

        getVolunteer: function(volunteerId) {
          return $http({
            method: 'GET',
            url: $$api.url('volunteers/' + volunteerId)
          });
        },

        /*
          >>> edit Volunteer
        */

        edit: function(volunteerId, data) {
          return $http({
            method: 'PUT',
            url: $$api.url('volunteers/' + volunteerId),
            data: data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          });
        },

        /*
          >>> new Volunteer
        */

        new: function(data) {
          return $http({
            method: 'POST',
            url: $$api.url('volunteers'),
            data: data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          });
        },


      },

			/*
				>> genders
			*/

				genders: {

					/*
						>>> get genders
					*/

						get: function() {
							return $http({
								method: 'GET',
								url: $$api.url('genders')
							});
						}

				},

			/*
				>> meetingTypes
			*/

				meetingTypes: {

					/*
						>>> get genders
					*/

						get: function() {
							return $http({
								method: 'GET',
								url: $$api.url('meetingTypes')
							});
						}

				},

            /*
                >> meetingTypes
            */

            outreach: {

                /*
                    >>> get outreach types
                */

                get : function (id) {
                    return $http({
                        method: 'GET',
                        url: $$api.url('outreaches/' + id)
                    });
                },

                getByType : function (outreach_type, organisationId) {
					return $http({
						method: 'GET',
						url: $$api.url('outreaches/' + organisationId + '/bytype/' + outreach_type)
					});
                },

                delete: function(id) {
                    return $http({
                        method: 'DELETE',
                        url: $$api.url('outreaches/' + id)
                    });
                },

                edit: function(meetingId, data) {
                    return $http({
                        method: 'PUT',
                        url: $$api.url('outreaches/' + meetingId),
                        data: data,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    });
                },

				new : function (data) {
                    return $http({
                        method: 'POST',
                        url: $$api.url('outreaches'),
                        data: data,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    });
                },

                getTypes: function() {
                    return $http({
                        method: 'GET',
                        url: $$api.url('outreachTypes')
                    });
                },

                getChildTypes: function(outreach_id) {
                    return $http({
                        method: 'GET',
                        url: $$api.url('outreachChildTypes/parent/' + outreach_id)
                    });
                }

            },

            /*
                >> Activities
            */

            activities: {

                /*
                    >>> get genders
                */

                get: function() {
                    return $http({
                        method: 'GET',
                        url: $$api.url('activities')
                    });
                }

            },

			/*
				>> regions
			*/

				regions: {

					/*
						>>> get regions
					*/

						get: function() {
							return $http({
								method: 'GET',
								url: $$api.url('regions')
							});
						}

				},

			/*
				>> organisations
			*/

				organisations: {

					/*
						>>> get organisations
					*/

						get: function(regionId) {
							return $http({
								method: 'GET',
								url: $$api.url('regions/' + regionId + '/organisations')
							});
						},

					/*
						>>> summary
					*/

						summary: function(organisationId) {
							return $http({
								method: 'GET',
								url: $$api.url('organisations/' + organisationId + '/summary')
							})
						}

				},

		}

		return $$api;

	})
