// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives','app.services','ngStorage',])

.run(function($ionicPlatform, $localStorage, $rootScope) {
	$ionicPlatform.ready(function() {

		// log localstorage first
		console.log('$localStorage: ', $localStorage);

		// device detection
		$rootScope.isIOS = ionic.Platform.isIOS();
		$rootScope.isAndroid = ionic.Platform.isAndroid();

		// set organisation subheader title
		if ($localStorage.user) {
			$rootScope.organisationName = $localStorage.user.organisation.name;
		}

		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleBlackTranslucent();
		}

		// app paused (in background)
		$rootScope.appPaused = false;
		document.addEventListener('pause', function() {
			$rootScope.appPaused = true;
	    }, false);

	    // app resumed
		document.addEventListener('resume', function() {
			$rootScope.appPaused = false;
	    }, false);

	});
})

// controllers module
angular.module('app.controllers', [])