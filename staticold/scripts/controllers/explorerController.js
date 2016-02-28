/**
 *  scripts/controllers/explorerController.js
 *
 *  A controller for viewing block explorer
 *  
 */
'use strict';

angular.module('guerilla').controller(
    'explorerController', 
    function( $scope, $http, $rootScope, $state ) {

        $scope.explorer = [];

    	explorerLoad();
        var explorerLoop = setInterval( explorerLoad, 60000 ); // 10 mins

    	function explorerLoad() {
    		$http.get('http://btc.blockr.io/api/v1/coin/info')
            .then(function (response) {

                $scope.explorer = response.data.data;

                $scope.explorer.last_block.time_utc = ($scope.explorer.last_block.time_utc).replace('T',' ');
                $scope.explorer.last_block.difficulty = ($scope.explorer.last_block.difficulty/1000000000).toFixed(3);
                $scope.explorer.next_difficulty.difficulty = ($scope.explorer.next_difficulty.difficulty/1000000000).toFixed(3);
                $scope.explorer.next_difficulty.perc = ($scope.explorer.next_difficulty.perc).toFixed(2);

            });
    	}

        // Txn websocket by SmartBit
        ////////////////////////////////////////////////////////////////
        var txnWS = [];
        var liveTxn  = [];
        var n = 0;
        var paused = false;

        setInterval(resetCounter, 1000*60*10); // 10 mins

        // Start bitfinex websocket
        var txnWS = new WebSocket('wss://ws.smartbit.com.au/v1/blockchain');
        // Open the connection and pass the needed request
        // Learn More http://docs.bitfinex.com/#websocket

        txnWS.onopen = function(){
            txnWS.send(JSON.stringify({type: "new-transaction"}));
        }
        // Upon recieving a new message
        txnWS.onmessage = function(msg) {
            var liveTxns = JSON.parse(msg.data);

            liveTxn.id   = (liveTxns.payload.txid).substring(0, 50) +'...';
            liveTxn.amount   = (liveTxns.payload.input_amount_int/100000000).toFixed(4);

            var ul = document.getElementById('live-transactions'),
                li = document.createElement('li');

            li.innerHTML = '<div class="txn"><div class="txn-id"><span class="elabel">TXID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="transaction-text">'+ liveTxn.id +'</span></div><div class="txn-amount"><span class="elabel">AMOUNT&nbsp;&nbsp;</span><span class="transaction-text">'+ liveTxn.amount +'</span></div></div>';

            if(!paused) {
                ul.insertBefore(li, ul.firstChild);

                if(document.getElementById('live-transactions').children.length > 10) {
                    var last = ul.lastElementChild;
                    ul.removeChild(last);
                }
            }
            n++;
            // websockets come through the rootscope
            // display the count of transactions
            $rootScope.$apply(function() { $scope.txn = n; });
            
        };
        // To close the connection, we don't use this really
        txnWS.onclose = function() { console.log('live txn connection is closed'); }
        
        $scope.live = true;
        $scope.pauseTxns = function () {
            $scope.live = false;
            $scope.paused = true;

            paused = true;
        }
        $scope.startTxns = function () {
            $scope.paused = false;
            $scope.live = true;

            paused = false;
        }
        
        function resetCounter() { n = 0; }


        $scope.transactionLoad = function() {
            $http.get('http://'+ window.location.host +'/explorer/txdata/' + $scope.search)
            .then(function (response) {

                $scope.tx = response.data.data;

                $state.go('/tx/' + $scope.search);
            });
        }
        

});

