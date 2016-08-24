/*
	global variables & functions used throughout
*/

	// api urls
	var apiBaseUrl = 'http://powertochangeadmin.stage2.reason.digital/api/v1/';

	// api url generator
	var api = function(url) {
		return apiBaseUrl + url;
	}
