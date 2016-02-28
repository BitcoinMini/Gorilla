/**
 *  scripts/controllers/configController.js
 *
 *  A controller for viewing and updating config
 *  
 */
'use strict';

angular.module('guerilla').controller(
    'configController', 
    function( $scope, $http ) {

    	$scope.config = [];
    	$scope.notifications = [];
    	$scope.saving = [];

    	configLoad();

    	function configLoad() {
    		$http.get('http://'+ window.location.host +'/admin')
            .then(function (response) {

                $scope.config = response.data;
                if ($scope.config.email.notifications) {
                	$scope.notifications.email = true; } else { $scope.notifications.email = false; }
            });
    	}
    	

        $scope.editEmail = function () {
        	$scope.saving.email = true;
        	var newEmail = $scope.edit.email;
        	$http.get('http://'+ window.location.host +'/admin/edit/email/'+newEmail)
            .then(function () {
				$scope.saving.email = false;
				configLoad();
            });
        }

        $scope.emailNotifications = function () {

        	if($scope.notifications.email == 'checked') {
        		$scope.saving.emailNotification = true;
        		$http.get('http://'+ window.location.host +'/admin/edit/email/notifications/disable')
	        		.then(function () {
	        			$scope.notifications.email == '';
	        			$scope.saving.emailNotification = false;
	        			configLoad();
	            	});
        	}
        	if($scope.notifications.email == '') {
        		$scope.saving.emailNotification = true;
        		$http.get('http://'+ window.location.host +'/admin/edit/email/notifications/enable')
	        		.then(function () {
	        			$scope.notifications.email == 'checked';
	        			$scope.saving.emailNotification = false;
	        			configLoad();
	            	});
        	}
           
        }

        $scope.editTimeout = function () {
            $scope.saving.timeout = true;
            var newTimeout = $scope.edit.timeout;
            $http.get('http://'+ window.location.host +'/admin/edit/timeout/'+newTimeout)
            .then(function () {
                $scope.saving.timeout = false;
                configLoad();
            });
        }

    });

