/*
* CONTENTS
*
* register page
* login page
* tabs
*    dashboard
*      dashboard - new log
*    view logs
*      view logs - edit log
*    settings
*      settings - terms & conditions
*/

angular.module('app.routes', ['ionicUIRouter'])

    .config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

        $ionicConfigProvider.tabs.position('bottom');

        $stateProvider

        // > register page
            .state('register', {
                cache: false,
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
            // >>> dashboard - new log
            .state('tabs.view-logs.new-log', {
                cache: false,
                url: '/new-log',
                views: {
                    'view-logs-hours-tab@tabs.view-logs': {
                        templateUrl: 'templates/new-log.html',
                        controller: 'NewLogController'
                    }
                }
            })
            .state('tabs.new-log',{
            cache: false,
            url: '/new-log',
            views: {
                'dashboard-tab': {
                    templateUrl: 'templates/new-log.html',
                    controller: 'NewLogController'
                }
            }
            })
            // >> view logs
            .state('tabs.view-logs', {
                cache: false,
                url: '/view-logs',
                views: {
                    'view-logs-tab': {
                        templateUrl: 'templates/view-logs.html'
                    }
                }
            })
            // >> view logs - hours
            .state('tabs.view-logs.hours', {
                cache: false,
                url: '/hours',
                views: {
                    'view-logs-hours-tab@tabs.view-logs': {
                        templateUrl: 'templates/view-logs-hours.html',
                        controller: 'ViewLogsHoursController'
                    }
                }
            })

            // >> view logs - meetings
            .state('tabs.view-logs.meetings', {
                cache: false,
                url: '/meetings',
                views: {
                    'view-logs-meetings-tab@tabs.view-logs': {
                        templateUrl: 'templates/view-logs-meetings.html',
                        controller: 'ViewLogsMeetingsController'
                    }
                }
            })
            // >>> view logs - meetings - new log
            .state('tabs.view-logs.new-meeting-log', {
                cache: false,
                url: '/new-meeting-log',
                views: {
                    'view-logs-meetings-tab@tabs.view-logs': {
                        templateUrl: 'templates/new-meeting-log.html',
                        controller: 'NewMeetingLogController'
                    }
                }
            })
            // >>> view logs - meetings - new log
            .state('tabs.edit-meeting', {
                cache: false,
                url: '/edit-meeting/:id',
                views: {
                    'view-logs-meetings-tab@tabs.view-logs': {
                        templateUrl: 'templates/edit-meeting.html',
                        controller: 'EditMeetingController'
                    }
                }
            })

            // >>> view logs - edit log
            .state('tabs.edit-log', {
                cache: false,
                url: '/edit-log/:id',
                views: {
                    'view-logs-hours-tab@tabs.view-logs': {
                        templateUrl: 'templates/edit-log.html',
                        controller: 'EditLogController'
                    }
                }
            })

            // >>> view logs - edit log offline
            .state('tabs.edit-log-offline', {
                cache: false,
                url: '/edit-log-offline/:offline_id',
                views: {
                    'view-logs-tab': {
                        templateUrl: 'templates/edit-log.html',
                        controller: 'EditLogController'
                    }
                }
            })

            // >> volunteers
            .state('tabs.view-volunteers', {
                // cache: 'false',
                url: '/volunteers',
                views: {
                    'view-volunteers-tab': {
                        templateUrl: 'templates/view-volunteers.html',
                        controller: 'ViewVolunteersController'
                    }
                }
            })
            // > new volunteer
            .state('tabs.new-volunteer', {
                cache: false,
                url: '/new-volunteer',
                views: {
                    'view-volunteers-tab': {
                        templateUrl: 'templates/new-volunteer.html',
                        controller: 'NewVolunteerController'
                    }
                }
            })

            // >>> edit volunteer
            .state('tabs.edit-volunteer', {
                cache: false,
                url: '/edit-volunteer/:id',
                views: {
                    'view-volunteers-tab': {
                        templateUrl: 'templates/edit-volunteer.html',
                        controller: 'EditVolunteerController'
                    }
                }
            })

            // >> settings
            .state('tabs.settings', {
                // cache: 'false',
                url: '/settings',
                views: {
                    'settings-tab': {
                        templateUrl: 'templates/settings.html',
                        controller: 'SettingsController'
                    }
                }
            })

            // >>> settings - profile
            .state('tabs.profile', {
                url: '/profile',
                views: {
                    'settings-tab': {
                        templateUrl: 'templates/profile.html',
                        controller: 'ProfileController'
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
