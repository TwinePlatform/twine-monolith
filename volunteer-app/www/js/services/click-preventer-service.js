/*
* CONTENTS
*
* click preventer service
*    show
*    hide
*/

/*
	> click preventer service
	
	  sometimes in cordova apps, a click (or tap) will fire twice, which means you will sometimes activate or
	  focus an element that you didn't want to. e.g. you tap Close on a popup, then the text input right
	  beneath where you tapped gets focussed after the popup closes. this service prevents that second 'ghost'
	  tap from activating/focussing anything
*/

	angular.module('app.services').factory('$$clickPreventer', function() {

		return {

			/*
				>> show
			*/

				show: function() {
					$('.click-preventer').removeClass('ng-hide');
				},

			/*
				>> hide
			*/

				hide: function() {
					setTimeout(function(){
						$('.click-preventer').addClass('ng-hide');
					}, 300);
				}

		}

	})