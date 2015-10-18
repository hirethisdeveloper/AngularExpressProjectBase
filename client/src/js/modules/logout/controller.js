'use strict';
var LogoutController = app.controller("LogoutController", function ($scope, $log, AuthService, SessionService, AccountService, $location, OrgService) {
    $log.debug("logout controller init");
    var doLogout = function () {
        var session = SessionService.get();
        var postLogout = function () {
            AccountService.clear();
            SessionService.clear();
            OrgService.clear();
            $location.url("/login");
        };
        if (session) {
            AuthService.logout(function (data) {
                if (data.status == 1) {
                    postLogout();
                }
                else {
                    $log.error("server: ", data);
                }
            });
        }
        else {
            postLogout();
        }
    };
    doLogout();
});
