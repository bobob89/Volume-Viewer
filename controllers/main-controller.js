 "use strict";

(function(){

	var app = angular.module('MyApp');

	app.controller('MainController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){

		$scope.amount = 0 , $scope.price = 0;
		$scope.buys = [];
		$scope.sells = [];
		$scope.allDeals = [];
		$scope.limitAmount = 5;
		$scope.fee1 = 0.002;
		$scope.fee2 = 0.002;
		$scope.minOutPrice = 0;
		$scope.volume = 0.1;
		$scope.calcPrice = 8000;
		$scope.calcVolume  = 0.1;
		$scope.totalBuy = 0;
		$scope.totalSell = 0;

		$scope.totalBigBuy = 0;
		$scope.totalBigSell = 0;

		$scope.tableLimit = 40;
		$scope.traidPairDefault = "BTCUSD";
		$scope.traidPair = angular.isDefined($routeParams.pair) ? $routeParams.pair : $scope.traidPairDefault;
		$scope.timeNow = timestmp(new Date()); 
		$scope.listOfDeal = {};
		// console.log($scope.timeNow);

		// $scope.traidPair = $routeParams.pair;


		$scope.resetAll = function(){
			$scope.amount = 0; 
			$scope.price = 0;
			$scope.totalBuy = 0;
			$scope.totalSell = 0;
			$scope.buys = [];
			$scope.sells = [];
			$scope.allDeals = [];
			$scope.timeNow = timestmp(new Date()); 
			$scope.totalBigBuy = 0;
			$scope.totalBigSell = 0;
			$scope.listOfDeal = {};
		};


		$scope.resetCounter = function(){
			$scope.listOfDeal = {};
		};


// BTCUSD LTCUSD LTCBTC ETHUSD ETHBTC ETCBTC ETCUSD RRTUSD RRTBTC ZECUSD ZECBTC 
// XMRUSD XMRBTC DSHUSD DSHBTC BTCEUR XRPUSD XRPBTC IOTUSD IOTBTC IOTETH EOSUSD 
// EOSBTC EOSETH SANUSD SANBTC SANETH OMGUSD OMGBTC OMGETH BCHUSD BCHBTC BCHETH 
// NEOUSD NEOBTC NEOETH ETPUSD ETPBTC ETPETH QTMUSD QTMBTC QTMETH AVTUSD AVTBTC 
// AVTETH EDOUSD EDOBTC EDOETH BTGUSD BTGBTC DATUSD DATBTC DATETH QSHUSD QSHBTC 
// QSHETH YYWUSD YYWBTC YYWETH GNTUSD GNTBTC GNTETH SNTUSD SNTBTC SNTETH IOTEUR 
// BATUSD BATBTC BATETH MNAUSD MNABTC MNAETH FUNUSD FUNBTC FUNETH ZRXUSD ZRXBTC 
// ZRXETH TNBUSD TNBBTC TNBETH SPKUSD SPKBTC SPKETH TRXUSD TRXBTC TRXETH RCNUSD 
// RCNBTC RCNETH RLCUSD RLCBTC RLCETH AIDUSD AIDBTC AIDETH SNGUSD SNGBTC SNGETH 
// REPUSD REPBTC REPETH ELFUSD ELFBTC ELFETH


		var wss = new WebSocket('wss://api.bitfinex.com/ws/2');
		wss.onmessage = function (res) {

			if (angular.isDefined(getPriceAndAmount(res.data))) {
				var priceAndAmountObj = getPriceAndAmount(res.data);

				$scope.$apply (function () {
					$scope.amount = priceAndAmountObj.amount;
			    	$scope.price = priceAndAmountObj.price;
			    	$scope.dateTime = priceAndAmountObj.dateTime;
			    	$scope.timestamp = priceAndAmountObj.timestamp;

			    	allDeal ($scope.amount, $scope.price, $scope.dateTime);
    				dealCounter($scope.amount, $scope.timestamp);
    				checkNoBotDeal($scope.timestamp);
    				console.log($scope.listOfDeal);
					// $scope.listOfDeal.forEach(function(deal, i, listOfDeal) {
					// 	console.log(deal);

					//   // alert( i + ": " + item + " (массив:" + arr + ")" );
					// });



			    	// console.log("Amount: " + $scope.amount + " Price: " + $scope.price);
			    	if ($scope.amount > 0) {
			    		setBuy ($scope.amount, $scope.price, $scope.limitAmount, $scope.dateTime);
			    	}
			    	else {
			    		setSell ($scope.amount, $scope.price, $scope.limitAmount, $scope.dateTime);
			    	}
				});
			};
		};
		wss.onopen = function() {
			wss.send(JSON.stringify({"event":"subscribe", "channel":"trades", "pair": $scope.traidPair}));
		};

		function getPriceAndAmount(dataFromBTFNX){
			var arr = dataFromBTFNX.split(',');

			// console.log(1522950706474);
			// console.log(arr[3]);

			if (arr[1] == '"tu"') {
				var amount = Number(arr[4]);
				var price = Number(arr[5].slice(0, -2));
				var dateTime = timestmp(Number(arr[3]));
				var timestamp = Number(arr[3]);

				var dataObj = {
					dateTime: dateTime,
					amount: amount,
					price: price,
					timestamp: timestamp
				};
				return dataObj;
			}
		}


		function allDeal (amount, price, dateTime){
			var data = {
				dateTime: dateTime,
				amount: amount,
				price: price
			};

			if ($scope.allDeals.length > $scope.tableLimit) {
				$scope.allDeals.splice(0, 1);
			}
			$scope.allDeals.push(data);
			counter(amount);
		}

		function checkNoBotDeal(timestamp){
			for (var deal of Object.keys($scope.listOfDeal)) {
				var dealTime = $scope.listOfDeal[deal].time / 1000;
				var timeLast = timestamp / 1000;

				if (((timeLast - dealTime) > 10) && $scope.listOfDeal[deal].amount <= 3 ) {
					console.log("need to delete: " + $scope.listOfDeal[deal]);
					delete $scope.listOfDeal[deal];
				}
				
				// console.log(deal);
			}
		}


		function dealCounter(amount, dateTime) {
		    if ($scope.listOfDeal["am"+amount] == null) {
		        $scope.listOfDeal["am"+amount] = {};  
		        $scope.listOfDeal["am"+amount].amount = 1; 
		        $scope.listOfDeal["am"+amount].time = dateTime;  
		        $scope.listOfDeal["am"+amount].amountName = amount;  
		        $scope.listOfDeal["am"+amount].humanTime = timestmp(dateTime);  

		    } else {
		        $scope.listOfDeal["am"+amount].amount += 1;
		        $scope.listOfDeal["am"+amount].time = dateTime;  
		    }
		    
		}

		function setBuy (amount, price, limit, dateTime) {
	    	if ($scope.amount >= limit){
				var data = {
					dateTime: dateTime,
					amount: amount,
					price: price
				};
				if ($scope.buys.length > $scope.tableLimit) {
					$scope.buys.splice(0, 1);
				}
				$scope.buys.push(data);
				$scope.totalBigBuy = $scope.totalBigBuy + amount;
	    	}
		}

		function setSell (amount, price, limit, dateTime) {
	    	if ($scope.amount <= -limit){
				var data = {
					dateTime: dateTime,
					amount: amount,
					price: price
				};
				if ($scope.sells.length > $scope.tableLimit) {
					$scope.sells.splice(0, 1);
				}
				$scope.sells.push(data);
				$scope.totalBigSell = $scope.totalBigSell + Math.abs(amount);
	    	}
		}


		function timestmp(ms) {
		    return new Date(ms).toISOString().slice(11, -5);
		}

		function counter(amount) {
			if (amount > 0) {
				$scope.totalBuy = $scope.totalBuy + amount;
			}
			else {
				$scope.totalSell = $scope.totalSell + Math.abs(amount);
			}

		}



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