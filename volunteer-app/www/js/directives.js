/*
* CONTENTS
*
* directives
*    organisation subheader
*/

/*
	> directives
*/

angular.module('app.directives', ['ngStorage'])

/*
	>> organisation subheader
*/

	.directive('organisationSubheader', ['$localStorage','$state', '$rootScope', 
	function($localStorage, $state, $rootScope){
		return {
			template: '<div class="bar bar-subheader bar-subheader-organisation"><h2 class="title" ng-bind="organisationName"></h2></div>'
		};
	}])
	.directive('convertToNumber', function() {
		return {
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {
				ngModel.$parsers.push(function(val) {
					return val != null ? parseInt(val, 10) : null;
				});
				ngModel.$formatters.push(function(val) {
					return val != null ? '' + val : null;
				});
			}
		};
	});