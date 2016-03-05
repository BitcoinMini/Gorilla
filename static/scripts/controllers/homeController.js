/**
 *  scripts/controllers/homeController.js
 *
 *  A controller for the ui-view on the home screen
 *  
 */
'use strict'; 

angular.module('guerilla')
.controller(
    'homeController', 
    function( $scope, $rootScope, $http, $q ) {

        /**
         *  Variables
         */
        $scope.tileinfo = [];  // for the menu information
        $scope.modalValues = []; // for all bitcoin modal values
        $scope.modalLoading = false; // for loader on modals
        $scope.result = [];
        $scope.listResults = [];
        $scope.modalResult = false; // for modal results
        $scope.modalList = false;
        $scope.modalAddNew = false;
        $scope.modalDump = false;
        $scope.modalSign = false;
        $scope.modalVerify = false;

        // run the loading function
        moreStats();

        // Load all the stats needed when page loads
        function moreStats() {

            // build array of get requests from our APIs
            $q.all([ 
                $http.get('http://'+ window.location.hostname +':8081/os/system/all'),
                $http.get('http://'+ window.location.hostname +':8081/net/stat'),
                $http.get('http://'+ window.location.hostname +':8081/whoami'),
                $http.get('http://'+ window.location.hostname +':8081/gorillaver')
            ])

            // do this after all the get requests are completed
            .then(function( results ) {

                // create an empty array for the results
                var data = [];
                // add all results to the array one at a time
                angular.forEach( results, function( result ) {
                    data = data.concat( result.data );
                });
                
                // The different numbers (ie data[2]) correspond to the different get requests
                // Now let's set some variables to push info to the DOM
                // RAM
                $scope.tileinfo.ramtotal = (data[0].data.memory.total/1000000).toFixed(3);
                $scope.tileinfo.ramfree = (data[0].data.memory.free/1000000).toFixed(3);
                // download upload
                $scope.tileinfo.download = (data[1].data.interfaces[0].traffic.months[0].rx*1e-6).toPrecision(5); //convert from kilobytes to gigabytes
                $scope.tileinfo.free = (data[1].data.interfaces[0].traffic.months[0].tx*1e-6).toPrecision(5); //convert from kilobytes to gigabytes
                // username
                $scope.tileinfo.username = data[2].data;
                // gorilla version
                $scope.tileinfo.gorillaver = data[3].data;

                // set an infinite loop
                var loop2 = setInterval( moreStats, 60000 ); // 10 mins
            }); // .then()
        } // moreStats()

        
        //Make modals draggable
        // $('.dragmod').draggable({handle: '.modal-header'});
        
        // add a new address
        $scope.newAdd = function() {

            // show loading in modal header
            $scope.modalLoading = true;

            // call for a newadd with the value from the input box for label
            $http.post('http://'+ window.location.hostname +':8081/btc/newadd', { acct: $scope.modalValues.newAddLabel })
                // when complete call this function
                .then(function(result) {

                    $scope.result.label = "New Address";
                    $scope.result.val   = result.data.add;
                    $scope.result.acct  = result.config.data.acct;
                    $scope.modalResult  = true;
                    $scope.modalLoading = false;
                });
        }

        // list addresses
        $scope.listadd = function() {

            // show loading in modal header
            $scope.modalLoading = true;

            

            // call for a newadd with the value from the input box for label
            $http.get('http://'+ window.location.hostname +':8081/btc/getadds')
                // when complete call this function
                .then(function(result) {
                    
                    $scope.listResults = result.data;
                    $scope.modalResult  = true;
                    $scope.modalLoading = false;
                });
        }

        function listForDump() {
            // call for a newadd with the value from the input box for label
            $http.get('http://'+ window.location.hostname +':8081/btc/getadds')
                // when complete call this function
                .then(function(result) {
                    
                    $scope.listResults = result.data;
                    $scope.modalResult  = true;
                    $scope.modalLoading = false;
                });
        }

        // Dump PrivKey
        $scope.dumpkey = function() {

            // show loading in modal header
            $scope.modalLoading = true;

            // clear the interval during the dump process, we reset it after
            clearInterval(loop2);

            $http.post('http://'+ window.location.hostname +':8081/btc/dumpkey', {add: $scope.modalValues.DumpKeyLabel} )
                .then(function(privkey) {
                    $scope.result.label = "Private Key";
                    $scope.result.val   = privkey;
                    $scope.modalResult  = true;
                    $scope.modalLoading = false;
                    // now the callback
                }), function() { 
                    // reset the interval
                    loop2 = setInterval( moreStats, 60000 ); // 10 mins
                };            
        }

        // Sign Message
        $scope.signMessage = function() {
            
            // show loading in modal header
            $scope.modalLoading = true;

            // clear the interval during the dump process, we reset it after
            clearInterval(loop2);

            $http.post('http://'+ window.location.hostname +':8081/btc/signmessage',{add: $scope.modalValues.SignLabel, msg: $scope.modalValues.Message})
                .then(function(result){
                    $scope.result.label = "Signature";
                    $scope.result.val   = result.sig;
                    $scope.modalResult  = true;
                    $scope.modalLoading = false;    
                }), function() { 
                    // reset the interval
                    loop2 = setInterval( moreStats, 60000 ); // 10 mins
                };
        }

        // Verify Message
        $scope.verifyMessage = function() {
            
            // show loading in modal header
            $scope.modalLoading = true;

            // clear the interval during the dump process, we reset it after
            clearInterval(loop2);
            
            $http.post('http://'+ window.location.hostname +':8081/btc/verifymessage',
                {add: $scope.modalValues.verifyAddress, msg: $scope.modalValues.verifyMessage, sig: $scope.modalValues.verifySignature})
                .then(function(result){
                    if(result == true) {
                        $scope.result.verify = "Message Validated True";
                    } else {
                        $scope.result.verify = "Error, see console log";
                        console.log(result);
                    }
                    $scope.modalResult  = true;
                    $scope.modalLoading = false;    
                }), function() { 
                    // reset the interval
                    loop2 = setInterval( moreStats, 60000 ); // 10 mins
                };
        }
        
    });

