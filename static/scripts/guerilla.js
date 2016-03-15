/*!
 * guerilla-mini
 * Copyright(c) 2015 Mini Computing, LLC
 * MIT Licensed
 */
'use strict';

// Create our app and assign it to the variable guerilla
// We inject our dependencies as well
var guerilla = angular.module('guerilla', ['pageslide-directive', 'ui.router', 'ngWebSocket'])

/**
 * Some routing configuration
 * 
 * $locationProvider is to enable html5 and get rid of the # in route
 * $stateProvider is ui.router specific routing, instead of $routeProvider
 * $urlRouterProvider is for the default route
 *
 * More info at https://github.com/angular-ui/ui-router
 */
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	// For any unmatched url, redirect to /home
	$urlRouterProvider.otherwise("/home");
   
	/**
	 *	Since the ui-view directive is outside the mainController on index.html
	 *	it matches to the otherwise route. If we route to "/" it will interfere
	 *	with mainController.
	 */ 	
	// ui.router uses States instead of routes, so we need the stateProvider 
	$stateProvider
		.state('home', {
		  	url: "/home",
		  	templateUrl: "partials/home.html",
		  	controller: "homeController"
		})
		.state('config', {
		  	url: "/config",
		  	templateUrl: "partials/config.html",
		  	controller: "configController"
		})
		.state('explorer', {
		  	url: "/explorer",
		  	templateUrl: "partials/explorer.html",
		  	controller: "explorerController"
		})
		.state('explorer.tx', {
		  	url: "/tx/:txid",
		  	templateUrl: "partials/explorerParts/transaction.html",
		  	controller: "explorerController"
		});
});