angular.module('app.routes', ['ionicUIRouter'])

.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider

		// register page
		.state('register', {
			url: '/register',
			templateUrl: 'templates/register.html',
			controller: 'RegisterController'
		})

		// tabs
		.state('tabs', {
			url: '/tab',
			abstract: true,
			templateUrl: 'templates/tabs.html'
		})

			// tabs - dashboard
			.state('tabs.dashboard', {
				url: '/dashboard',
				views: {
					'dashboard-tab': {
						templateUrl: 'templates/dashboard.html',
						controller: 'DashboardController'
					}
				}
			})

			// tabs - log hours
			.state('tabs.log-hours', {
				url: '/log-hours',
				views: {
					'log-hours-tab': {
						templateUrl: 'templates/log-hours.html',
						controller: 'LogHoursController'
					}
				}
			})

		// default page
		$urlRouterProvider.otherwise('/register');

});