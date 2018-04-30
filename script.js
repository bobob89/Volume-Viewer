'use strict';

(function(){

	var app = angular.module('MyApp', ['ngRoute', 'ngAnimate']);

	app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

		$locationProvider.html5Mode(true);

		$routeProvider.when('/',{
			controller: 'MainController',
			templateUrl: 'templates/main.html'
		})
		.when('/:pair', {
			controller: 'MainController',
			templateUrl: 'templates/main.html'
		})
		// .when('/glass', {
		// 	controller: 'GlassController',
		// 	templateUrl: 'templates/glass.html'
		// })
		.otherwise({
			redirectTo: '/'
		});
	}]);






})();