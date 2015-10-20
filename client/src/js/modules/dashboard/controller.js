'use strict';
var DashboardController = app.controller("DashboardController", function($scope, $log, $location) {
    $log.debug("DashboardController init");


    // this will be moved to a directive
    $scope.logout = function() {
        $location.url("/logout");
    }
})

