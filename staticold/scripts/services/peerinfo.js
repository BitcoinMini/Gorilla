/**
 *  scripts/services/peerinfo.js
 *
 *  
 *  
 */

angular.module('guerilla')
	.controller(
		'peerinfo', 
		function ($scope, $http, $q) {
			
			$http.get('http://192.168.0.160:8444/api/getpeerinfo')
	            .then(function (response) {
	                var peers = response.data.peerinfo;

	                
	            });
}