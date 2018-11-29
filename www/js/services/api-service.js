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

		function transformResponse (response, headers, status) {
			var res = JSON.parse(response);
			return status < 400
				? Object.assign({}, res, { data: res.result })
				: res;
		};

		function transformDuration (_duration) {
			var duration = _duration || {};
			return Math.floor(
				(duration.days || 0) * 24 * 60
			+ (duration.hours || 0) * 60
			+ (duration.minutes || 0)
			+ (duration.seconds || 0) / 60
			);
		}

		function transformLog (log) {
			return Object.assign({}, log, {
				date_of_log: log.startedAt,
				duration: transformDuration(log.duration),
			})
		}
		function transformLogResponse (res, headers, status) {
			return status >= 400
				? res
				: Array.isArray(res.data)
					? Object.assign(res, { data: res.data.map(transformLog) })
					: Object.assign(res, { data: transformLog(res.data) });
		}

		function transformDurationResponse (res, headers, status) {
			return status >= 400
				? res
				: res.data && typeof res.data === 'object'
					? Object.assign(res, { data: { total: transformDuration(res.data.total) } })
					: res;
		}


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
								transformResponse: transformResponse,
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
								transformResponse: function (r, h, s) {
									return transformLogResponse(transformResponse(r, h, s), h, s);
								}
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
								transformResponse: function (r, h, s) {
									return transformLogResponse(transformResponse(r, h, s), h, s)
								}
							});
						},

						getAdminLogs : function () {
							var qs = ['id', 'userId', 'userName', 'duration', 'project', 'activity', 'startedAt', 'modifiedAt', 'createdAt', 'deletedAt', 'organisationId', 'organisationName']
								.map(function (s) { return 'fields[]=' + s; })
								.join('&');

							return $http({
								method: 'GET',
								url: $$api.url('community-businesses/me/volunteer-logs?' + qs),
								headers: { Authorization: $$api.token.get() },
								transformResponse: function (r, h, s) {
									return transformLogResponse(transformResponse(r, h, s), h, s)
								}
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
								transformResponse: function (r, h, s) {
									return transformLogResponse(transformResponse(r, h, s), h, s);
								}
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
								transformResponse: function (r, h, s) {
									return transformLogResponse(transformResponse(r, h, s), h, s);
								}
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
								transformResponse: transformResponse,
							});
						},


				},

			/*
				>> Projects
			*/

				projects: {

					/*
						>>> delete
					*/

						delete: function(id) {
							return $http({
								method: 'DELETE',
								url: $$api.url('community-businesses/me/volunteers/projects/' + id),
								headers: { Authorization: $$api.token.get() },
							});
						},

					/*
						>>> get Projects
					*/

						getProjects: function() {
							return $http({
								method: 'GET',
								url: $$api.url('community-businesses/me/volunteers/projects'),
								headers: { Authorization: $$api.token.get() },
							});
						},

					/*
						>>> get Project
					*/

						getProject: function(id) {
							return $http({
								method: 'GET',
								url: $$api.url('community-businesses/me/volunteers/projects/' + id),
								headers: { Authorization: $$api.token.get() },
							});
						},

					/*
						>>> edit Project
					*/

						edit: function(id, data) {
							return $http({
								method: 'PUT',
								url: $$api.url('community-businesses/me/volunteers/projects/' + id),
								data: data,
								headers: { Authorization: $$api.token.get() },
							});
						},

					/*
						>>> new Project
					*/

						new: function(data) {
							return $http({
								method: 'POST',
								url: $$api.url('community-businesses/me/volunteers/projects'),
								data: data,
								headers: { Authorization: $$api.token.get() },
							});
						},

					/*
						>>> sync
					*/

						// sync: function(data) {
						// 	return $http({
						// 		method: 'POST',
						// 		url: $$api.url('meetings/sync'),
						// 		data: data,
						// 		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
						// 	});
						// },

				},

			/*
				>> user
			*/

				user: {

					/*
						>>> get
					*/

						get: function(_userId) {
							var userId = _userId || 'me';
							return $http({
								method: 'GET',
								url: $$api.url('users/' + userId),
								headers: { Authorization: $$api.token.get() }
							});
						},

						roles: function () {
							return $http({
								method: 'GET',
								url: $$api.url('users/me/roles'),
								headers: { Authorization: $$api.token.get() },
							});
						},

						save: function (data) {
							return $http({
								method: 'PUT',
								url: $$api.url('users/me'),
								data: {
									name: data.name,
									email: data.email,
									phoneNumber: data.phoneNumber,
									password: data.password,
									birthYear: data.yearOfBirth,
									gender: data.gender,
								},
								headers: { Authorization: $$api.token.get() },
								transformResponse: transformResponse,
							});
						},

					/*
						>>> login
					*/

						login: function (data) {
							return $http({
								method: 'POST',
								url: $$api.url('users/login'),
								data: {
									email: data.email,
									password: data.password,
									type: 'body', restrict: ['VOLUNTEER', 'VOLUNTEER_ADMIN', 'CB_ADMIN'] }
							})
							.then(function (response) {
								$$api.token.set(response.data.result.token);
								return response;
							});
						},

					/*
						>>> register user
					*/

						register: function (data) {
							return $http({
								method: 'POST',
								url: $$api.url('users/register/volunteers'),
								data: data,
							});
						},

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
								transformResponse: function (r, h, s) {
									return transformDurationResponse(transformResponse(r, h, s), h, s);
								},
							});
						},

					/*
						>>> total hours for a day
					*/

						totalHoursForDay: function(_, _date) {
							var date = new Date(_date || new Date()); // clone or parse date string
							date.setHours(0, 0, 0, 0);
							var start = date.toISOString();
							date.setHours(23, 59, 59, 999);
							var end = date.toISOString();

							return $http({
								method: 'GET',
								url: $$api.url('users/volunteers/me/volunteer-logs/summary?since=' + start + '&until=' + end),
								headers: { Authorization: $$api.token.get() },
								transformResponse: function (r, h, s) {
									return transformLogResponse(transformResponse(r, h, s), h, s);
								},
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
						url: $$api.url('users/volunteers/' + id),
						headers: { Authorization: $$api.token.get() },
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
								transformResponse: transformResponse,
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
												transformResponse: transformResponse,
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
								transformResponse: transformResponse,
							});
						},

						organisations: function (regionId) {
							return $http({
								method: 'GET',
								url: $$api.url('regions/' + regionId + '/community-businesses')
							});
						},

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
								transformResponse: transformResponse
							});
						},

					/*
						>>> summary
					*/

						summary: function() {
							var since = new Date();
							since.setDate(since.getDate() - 7);

							return $http({
								method: 'GET',
								url: $$api.url('community-businesses/me/volunteer-logs/summary?since=' + since.toISOString()),
								headers: { Authorization: $$api.token.get() },
								transformResponse: transformResponse
							})
						}

				},

		}

		return $$api;

	})
