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

		const transformDuration = (duration = {}) =>
			Math.floor(
				(duration.days || 0) * 24 * 60
			+ (duration.hours || 0) * 60
			+ (duration.minutes || 0)
			+ (duration.seconds || 0) / 60
			);

		const transformLog = (log) => ({
			...log,
			date_of_log: log.startedAt,
			duration: transformDuration(log.duration),
		})

		const transformLogResponse = (res, headers, status) =>
			status >= 400
				? res
				: Array.isArray(res.data)
					? { ...res, data: res.data.map(transformLog) }
					: { ...res, data: transformLog(res.data) };

		const transformDurationResponse = (res, headers, status) =>
			status >= 400
				? res
				: res.data && typeof res.data === 'object'
					? { ...res, data: { total: transformDuration(res.data.total) } }
					: res;


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
							var urlPrefix = $rootScope.isAdmin
								? 'community-businesses/me/volunteer-logs/'
								: 'users/volunteers/me/volunteer-logs/';
							return $http({
								method: 'DELETE',
								url: $$api.url(urlPrefix + id),
								headers: { Authorization: $$api.token.get() },
								transformResponse,
							});
						},

					/*
						>>> get logs
					*/

						getLogs: function() {
							return $http({
								method: 'GET',
								url: $$api.url('users/volunteers/me/volunteer-logs'),
								headers: { Authorization: $$api.token.get() },
								transformResponse: (r, h, s) => transformLogResponse(transformResponse(r, h, s), h, s)
							});
						},

					/*
						>>> get log
					*/

						getLog: function(logId) {
							var urlPrefix = $rootScope.isAdmin
								? 'community-businesses/me/volunteer-logs/'
								: 'users/volunteers/me/volunteer-logs/';
							return $http({
								method: 'GET',
								url: $$api.url(urlPrefix + logId),
								headers: { Authorization: $$api.token.get() },
								transformResponse: (r, h, s) => transformLogResponse(transformResponse(r, h, s), h, s)
							});
						},

						getAdminLogs : function () {
							return $http({
								method: 'GET',
								url: $$api.url('community-businesses/me/volunteer-logs'),
								headers: { Authorization: $$api.token.get() },
								transformResponse: (r, h, s) => transformLogResponse(transformResponse(r, h, s), h, s)
							});
						},

					/*
						>>> edit log
					*/

						edit: function(logId, data) {
							var urlPrefix = $rootScope.isAdmin
								? 'community-businesses/me/volunteer-logs/'
								: 'users/volunteers/me/volunteer-logs/';
							return $http({
								method: 'PUT',
								url: $$api.url(urlPrefix + logId),
								data: data,
								headers: { Authorization: $$api.token.get() },
								transformResponse: (r, h, s) => transformLogResponse(transformResponse(r, h, s), h, s)
							});
						},

					/*
						>>> new log
					*/

						new: function(data) {
							return $http({
								method: 'POST',
								url: $$api.url('community-businesses/me/volunteer-logs'),
								data: data,
								headers: { Authorization: $$api.token.get() },
								transformResponse: (r, h, s) => transformLogResponse(transformResponse(r, h, s), h, s)
							});
						},

					/*
						>>> sync
					*/

						sync: function(data) {
							return $http({
								method: 'POST',
								url: $$api.url('community-businesses/me/volunteer-logs/sync'),
								data: data,
								headers: { Authorization: $$api.token.get() },
								transformResponse,
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

						get: function(userId = 'me') {
							return $http({
								method: 'GET',
								url: $$api.url('users/' + userId),
								headers: { Authorization: $$api.token.get() }
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
								data: { email, password, type: 'body', restrict: ['VOLUNTEER', 'VOLUNTEER_ADMIN', 'ORG_ADMIN'] }
							})
							.then((response) => {
								$$api.token.set(response.data.result.token);
								return response;
							}),

					/*
						>>> register user
					*/

						register: (data) =>
							$http({
								method: 'POST',
								url: $$api.url('users/register/volunteers'),
								data: data,
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
								qs = '?since=' + now.toISOString();
							}

							return $http({
								method: 'GET',
								url: $$api.url('users/volunteers/me/volunteer-logs/summary' + qs),
								headers: { Authorization: $$api.token.get() },
								transformResponse: (r, h, s) => transformDurationResponse(transformResponse(r, h, s), h, s),
							});
						},

					/*
						>>> total hours for a day
					*/

						totalHoursForDay: function(_, _date = new Date()) {
							var date = new Date(_date); // clone or parse date string
							date.setHours(0, 0, 0, 0);
							var start = date.toISOString();
							date.setHours(23, 59, 59, 999);
							var end = date.toISOString();

							return $http({
								method: 'GET',
								url: $$api.url(`users/volunteers/me/volunteer-logs/summary?since=${start}&until=${end}`),
								headers: { Authorization: $$api.token.get() },
								transformResponse: (r, h, s) => transformLogResponse(transformResponse(r, h, s), h, s),
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

        getVolunteers: function() {
          return $http({
            method: 'GET',
						url: $$api.url('community-businesses/me/volunteers/'),
						headers: { Authorization: $$api.token.get() },
          });
        },

        /*
          >>> get Volunteer
        */

        getVolunteer: function(volunteerId) {
          return $http({
            method: 'GET',
						url: $$api.url('users/volunteers/' + volunteerId),
						headers: { Authorization: $$api.token.get() },
          });
        },

        /*
          >>> edit Volunteer
        */

        edit: function(volunteerId, data) {
          return $http({
            method: 'PUT',
            url: $$api.url('users/volunteers/' + volunteerId),
            data: data,
            headers: { Authorization: $$api.token.get() }
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
												url: $$api.url('volunteer-activities'),
												transformResponse,
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
								url: $$api.url(`regions/${regionId}/community-businesses`)
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
								transformResponse
							});
						},

					/*
						>>> summary
					*/

						summary: function() {
							return $http({
								method: 'GET',
								url: $$api.url('community-businesses/me/volunteer-logs/summary'),
								headers: { Authorization: $$api.token.get() },
								transformResponse
							})
						}

				},

		}

		return $$api;

	})
