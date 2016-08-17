/*
* CONTENTS
*
* register page
* login page
* tabs
*   dashboard
*    dashboard - log hours
*   view logs
*    view logs - edit log
*   settings
*    settings - terms & conditions
*/

angular.module('app.routes', ['ionicUIRouter'])

.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider

		// > register page
		.state('register', {
			url: '/register',
			templateUrl: 'templates/register.html',
			controller: 'RegisterController'
		})

		// > login page
		.state('login', {
			url: '/login',
			templateUrl: 'templates/login.html',
			controller: 'LoginController'
		})

		// > tabs
		.state('tabs', {
			url: '/tab',
			abstract: true,
			templateUrl: 'templates/tabs.html'
		})

			// >> dashboard
			.state('tabs.dashboard', {
				url: '/dashboard',
				views: {
					'dashboard-tab': {
						templateUrl: 'templates/dashboard.html',
						controller: 'DashboardController'
					}
				}
			})

				// >>> dashboard - log hours
				.state('tabs.log-hours', {
					url: '/dashboard/log-hours',
					views: {
						'dashboard-tab': {
							templateUrl: 'templates/log-hours.html',
							controller: 'LogHoursController'
						}
					}
				})

			// >> view logs
			.state('tabs.view-logs', {
				url: '/view-logs',
				views: {
					'view-logs-tab': {
						templateUrl: 'templates/view-logs.html',
						controller: 'ViewLogsController'
					}
				}
			})

				// >>> view logs - edit log
				.state('tabs.edit-log', {
					url: '/edit-log/:id',
					views: {
						'view-logs-tab': {
							templateUrl: 'templates/edit-log.html',
							controller: 'ViewLogsController'
						}
					}
				})

			// >> settings
			.state('tabs.settings', {
				url: '/settings',
				views: {
					'settings-tab': {
						templateUrl: 'templates/settings.html',
						controller: 'SettingsController'
					}
				}
			})

				// >>> settings - terms & conditions
				.state('tabs.terms-and-conditions', {
					url: '/terms-and-conditions',
					views: {
						'settings-tab': {
							templateUrl: 'templates/terms-and-conditions.html'
						}
					}
				})



		// default page
		$urlRouterProvider.otherwise('/register');

});