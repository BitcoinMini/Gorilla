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
        $scope.tileinfo     = []; // for the menu information
        $scope.modalValues  = []; // for all bitcoin modal values
        $scope.modalLoading = false; // for loader on modals
        $scope.new          = []; // for newAdd()
        $scope.list         = []; // for listAdds()
        $scope.dump         = []; // for dumpkey()
        $scope.sign         = []; // for signMessage()
        $scope.verify       = []; // for verifyMessage()
        $scope.listResults  = [];
        $scope.modalResult  = false; // for modal results

        // run the loading function
        moreStats();
        // set an infinite loop
        var loop2 = setInterval( moreStats, 60000 ); // 10 mins

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

            }); // .then()
        } // moreStats()
        
        /**
         * newAdd() - add a new address
         *
         * Here we take the info from the addressNew modal and create a new address
         * TODO: delete addresses some how
         */
        $scope.newAdd = function() {

            // show loading in modal header
            $scope.modalLoading = true;

            // call for a newadd with the value from the input box for label
            $http.post('http://'+ window.location.hostname +':8081/btc/newadd', { acct: $scope.modalValues.newAddLabel })
                // when complete call this function
                .then(function(res) {
                    console.log(res);
                    $scope.new.label    = "New Address";
                    $scope.new.val      = res.data;
                    $scope.new.acct     = res.config.data.acct;
                    $scope.new.result   = true;  // show the results div
                    $scope.modalLoading = false;
                });
        }

        /**
         * listadd() - list all addresses
         *
         * Here we just list all the addresses, their account label and balance
         * TODO: delete addresses some how
         */
        $scope.listadd = function() {

            // show loading in modal header
            $scope.modalLoading = true;

            // call for all addresses
            $http.get('http://'+ window.location.hostname +':8081/btc/getadds')
                // when complete call this function
                .then(function(res) {
                    $scope.list         = res.data;
                    //$scope.list.result  = true;
                    $scope.modalLoading = false;
                });
        }

        /**
         * dumpkey() - dump the private key
         *
         * Here we dump the private key for a selected address
         * TODO: delete addresses some how
         */
        $scope.dumpkey = function() {

            // show loading in modal header
            $scope.modalLoading = true;

            // clear the interval during the dump process, we reset it after
            // we have to do this because the dumpkey process can take a while and 
            // we don't want it interupted
            clearInterval(loop2);

            $http.post('http://'+ window.location.hostname +':8081/btc/dumpkey', {add: $scope.modalValues.DumpKeyLabel} )
                .then(function(privkey) {
                    console.log(privkey);
                    $scope.dump.label   = "Private Key";
                    $scope.dump.val     = privkey;
                    $scope.dump.result  = true;
                    $scope.modalLoading = false;
                    // now the callback
                }), function() { 
                    // reset the interval
                    loop2 = setInterval( moreStats, 60000 ); // 10 mins
                };            
        }

        /**
         * signMessage()
         *
         * Here we sign a message with a certain address's key
         * TODO: print
         */
        $scope.signMessage = function() {
            
            // show loading in modal header
            $scope.modalLoading = true;

            // clear the interval during the dump process, we reset it after
            // we have to do this because the dumpkey process can take a while and 
            // we don't want it interupted
            clearInterval(loop2);

            $http.post('http://'+ window.location.hostname +':8081/btc/signmessage',{ msg: $scope.modalValues.Message, add: $scope.modalValues.SignAdd })
                .then(function(res){

                    $scope.sign.label = "Signature";
                    $scope.sign.val   = res.data.sig;
                    $scope.sign.msg   = res.data.msg;
                    $scope.sign.addrlabel = "Address used";
                    $scope.sign.addr  = res.data.add;
                    $scope.sign.result  = true;
                    $scope.modalLoading = false;    
                }), function() { 
                    // reset the interval
                    loop2 = setInterval( moreStats, 60000 ); // 10 mins
                };
        }

        /**
         * verifyMessage() - verify message
         *
         * Here we verify if a message was signed by a certain key
         */
        $scope.verifyMessage = function() {
            
            // show loading in modal header
            $scope.modalLoading = true;

            // clear the interval during the dump process, we reset it after
            // we have to do this because the dumpkey process can take a while and 
            // we don't want it interupted
            clearInterval(loop2);
            
            $http.post('http://'+ window.location.hostname +':8081/btc/verifymessage',
                {add: $scope.modalValues.verifyAddress, msg: $scope.modalValues.verifyMessage, sig: $scope.modalValues.verifySignature})
                .then(function(res){
                    if(res == true) {
                        $scope.verify = "Message Validated True";
                    } else {
                        $scope.verify = "Error, see console log";
                    }
                    $scope.verify.result  = true;
                    $scope.modalLoading = false;    
                }), function() { 
                    // reset the interval
                    loop2 = setInterval( moreStats, 60000 ); // 10 mins
                };
        }

        // Misc functions for modals
        // This is to load all the addresses in the select menus
        $scope.listAll = function() {
            // call for a newadd with the value from the input box for label
            $http.get('http://'+ window.location.hostname +':8081/btc/getadds')
                // when complete call this function
                .then(function(res) {
                    $scope.listResults = res.data;
                    //$scope.modalResult  = true;
                    $scope.modalLoading = false;
                });
        }
        // clear individual modals results
        $scope.clearNew = function() { $scope.new = ''; }
        $scope.clearDump = function() { $scope.dump = ''; }
        $scope.clearSign = function() { $scope.sign = ''; }
        $scope.clearVerify = function() { $scope.verify = ''; }
        
    });

