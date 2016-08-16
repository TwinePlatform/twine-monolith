angular.module('app.routes', ['ionicUIRouter'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.dashboard'
      2) Using $state.go programatically:
        $state.go('tabsController.dashboard');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /page1/tab1/dashboard
      /page1/tab4/dashboard
  */
  .state('tabsController.dashboard', {
    url: '/dashboard',
    views: {
      'tab1': {
        templateUrl: 'templates/dashboard.html',
        controller: 'dashboardCtrl'
      },
      'tab4': {
        templateUrl: 'templates/dashboard.html',
        controller: 'dashboardCtrl'
      }
    }
  })

  /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.dashboardLogHours'
      2) Using $state.go programatically:
        $state.go('tabsController.dashboardLogHours');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /page1/tab1/dashboard/log-hours
      /page1/tab4/dashboard/log-hours
  */
  .state('tabsController.dashboardLogHours', {
    url: '/dashboard/log-hours',
    views: {
      'tab1': {
        templateUrl: 'templates/dashboardLogHours.html',
        controller: 'dashboardLogHoursCtrl'
      },
      'tab4': {
        templateUrl: 'templates/dashboardLogHours.html',
        controller: 'dashboardLogHoursCtrl'
      }
    }
  })

  .state('tabsController.logHours', {
    url: '/log-hours',
    views: {
      'tab2': {
        templateUrl: 'templates/logHours.html',
        controller: 'logHoursCtrl'
      }
    }
  })

  .state('tabsController.editLog', {
    url: '/edit-log',
    views: {
      'tab3': {
        templateUrl: 'templates/editLog.html',
        controller: 'editLogCtrl'
      }
    }
  })

  .state('tabsController.viewLogs', {
    url: '/view-logs',
    views: {
      'tab3': {
        templateUrl: 'templates/viewLogs.html',
        controller: 'viewLogsCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.settings', {
    url: '/settings',
    views: {
      'tab4': {
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'registerCtrl'
  })

  .state('tabsController.termsConditions', {
    url: '/terms-and-conditions',
    views: {
      'tab4': {
        templateUrl: 'templates/termsConditions.html',
        controller: 'termsConditionsCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/register')

  

});