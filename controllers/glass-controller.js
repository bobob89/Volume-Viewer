 "use strict";

(function(){

	var app = angular.module('MyApp');

	app.controller('GlassController', ['$scope','$http', function($scope, $http){
		console.log('fsdfsdfs');




		// const WS = require('ws');
		// const ws = new WS('wss://api.bitfinex.com/ws/2');

		// ws.on('open', function open () {
		//   ws.send(JSON.stringify({ event: 'conf', flags: 131072 }))
		//   ws.send(JSON.stringify({ event: 'subscribe', channel: 'book', pair: pair, prec: 'P0' }))
		// });

		// ws.on('message', function (msg) {
		//   console.log('New message: ', msg);
		// });

		var wss = new WebSocket('wss://api.bitfinex.com/ws/2');
		wss.onmessage = function (res) {
			console.log(res.data);
		};

		// wss.onopen = function() {
		// 	wss.send(JSON.stringify({"event":"subscribe", "channel":"trades", "pair": "BTCUSD"}));
		// };

		wss.onopen = function() {
			wss.send(JSON.stringify({
				"event": "conf", "flags": "131072"
			}));
			wss.send(JSON.stringify({
				"event":"subscribe", 
				"channel":"book", 
				"pair": "BTCUSD",
			    "prec":"P0",
			    "freq":"F0",
				"length":"25"
			}));


			
		};

		// $scope.bookId = $routeParams.id;

		// var data = {
		// 	id: $scope.bookId
		// };

		// $http.post('book.php', data).
		// 	success(function(res, status){
		// 		console.log(res);
		// 		console.log(status);
		// 		$scope.book = res;
		// 	}).	
		// 	error(function(res, status){
		// 		alert('Error!');
		// 		// console.log(res);
		// 		// console.log(status);
		// 	});
	}]);
})();