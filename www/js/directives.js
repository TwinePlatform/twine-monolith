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
	}]);