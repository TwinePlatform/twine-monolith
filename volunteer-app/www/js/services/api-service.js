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

		const transformResponse = (response, headers, status) => {
			const res = JSON.parse(response);
			return status < 400
				? { ...res, data: res.result }
				: res;
		};

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
				  Generates an api url
			*/

				url: function(url) {
					return $rootScope.options.apiBaseUrl[$rootScope.options.environment] + url;
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

						roles: () =>
							$http({
								method: 'GET',
								url: $$api.url('users/me/roles'),
								headers: { Authorization: $$api.token.get() },
							}),

					/*
						>>> login
					*/

						login: ({ email, password }) =>
							$http({
								method: 'POST',
								url: $$api.url('users/login'),
								data: { email, password, type: 'body', restrict: ['VOLUNTEER', 'VOLUNTEER_ADMIN'] }
							})
							.then((response) => {
								$$api.token.set(response.data.result.token);
								return response;
							}),

					/*
						>>> save user
					*/

						save: function(userId, data) {
							return $http({
								method: 'PUT',
								url: $$api.url('users/me'),
								data: data,
								headers: { Authorization: $$api.token.get() },
							});
						},

					/*
						>>> register user
					*/

						register: (data) =>
							$http({
								method: 'POST',
								url: $$api.url('users/register/volunteer'),
								data: data,
							})
							.then(function (response) {
								$$api.token.set(response.result.token);
								return response
							}),

					/*
						>>> total hours
					*/

						totalHours: function(userId, days) {
							// by default just grab overall total hours
							var qs = '';

							// if days have been specified, grab last x days
							if (days) {
								var now = new Date();
								now.setDate(now.getDate() - days);
								qs = '?since=' + now.toDateString();
							}

							return $http({
								method: 'GET',
								url: $$api.url('users/me/volunteer-logs/aggregates' + qs),
								headers: { Authorization: $$api.token.get() },
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
								url: $$api.url('genders'),
								transformResponse,
							});
						}

				},

			/*
				>> meetingTypes
			*/

				meetingTypes: {

					/*
						>>> get meetingTypes
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

				new: function (data) {
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
									>>> get activities
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
								url: $$api.url('regions'),
								transformResponse,
							});
						},

						organisations: (regionId) =>
							$http({
								method: 'GET',
								url: $$api.url(`regions/${regionId}/organisations`)
							})

				},

			/*
				>> organisations
			*/

				organisations: {

					/*
						>>> get organisations
					*/

						get: function() {
							return $http({
								method: 'GET',
								url: $$api.url('community-businesses/me'),
								headers: { Authorization: $$api.token.get() },
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
