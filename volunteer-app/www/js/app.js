/*
* CONTENTS
*
* app
*   log $localStorage
*   device detection
*   set organisation subheader title
*   hide accessory bar
*   app paused (in background)
*   app resumed
*/

/*
	> app
*/

	angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives','app.services','app.filters','ngStorage',])
	.run(function($ionicPlatform, $localStorage, $rootScope) {
		$ionicPlatform.ready(function() {

			/*
				>> log $localStorage
			*/

				console.log('$localStorage: ', $localStorage);


			/*
				>> device detection
			*/

				$rootScope.isIOS = ionic.Platform.isIOS();
				$rootScope.isAndroid = ionic.Platform.isAndroid();

			/*
				>> set organisation subheader title
			*/

				if ($localStorage.user) {
					$rootScope.organisationName = $localStorage.user.organisation.name;
				}


			/*
				>> hide accessory bar
			*/

				if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
					cordova.plugins.Keyboard.disableScroll(true);
				}
				if (window.StatusBar) {
					// org.apache.cordova.statusbar required
					StatusBar.styleBlackTranslucent();
				}


			/*
				>> app paused (in background)
			*/

				$rootScope.appPaused = false;
				document.addEventListener('pause', function() {
					$rootScope.appPaused = true;
			    }, false);


		    /*
		    	>> app resumed
		    */

				document.addEventListener('resume', function() {
					$rootScope.appPaused = false;
			    }, false);

		});
	})

	// controllers module
	angular.module('app.controllers', [])