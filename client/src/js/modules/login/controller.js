'use strict';
var LoginController       = app.controller("LoginController", function ($scope, $log, AuthService, SessionService, AccountService, OrgService, $location, dataset, $localStorage) {
    $log.debug("login controller init");
    $scope.login           = {
        hasUsername: false,
        showOrgList: false,
        data       : {
            username     : (dataset.remember ? dataset.remember.username : ""),
            password     : "",
            rememberCheck: (dataset.remember ? true : false)
        },
        remember   : dataset.remember,
        orgs       : []
    };
    var ProcessLoginReturn = function (obj) {
        $log.debug({obj: obj}, "ProcessLoginReturn");
        if (obj.status == 1) {
            SessionService.set({sessionId: obj.meta.sessionId, state: "temp"});
            AccountService.set({account_guid: obj.meta.account_guid});
            AuthService.loginGetOrgs(obj, function (orgData) {
                if (orgData.status == 1) {
                    $scope.login.orgs        = orgData.orgs;
                    $scope.login.showOrgList = true;
                }
                else {
                    $log.error("server: ", orgData);
                }
            })
        }
        else {
            $log.error("server: ", obj);
        }
    };
    $scope.doLogin         = function (form) {
        $log.debug({form: form, login: $scope.login}, "doLogin submit");
        // view 1
        if ($scope.login.data.username &&
            $scope.login.data.username !== "" && !$scope.login.data.password) {
            $log.debug("view1", $scope.login);
            // we've submitted view1, was rememberCheck checked?
            if ($scope.login.data.rememberCheck) {
                $localStorage.remember = {
                    username: $scope.login.data.username
                }
            }
            $scope.login.hasUsername = true;
        }
        // view 2
        else if ($scope.login.data.username &&
            $scope.login.data.username !== "" &&
            $scope.login.data.password && $scope.login.data.password !== "") {
            AuthService.login($scope.login.data, ProcessLoginReturn);
        }
    };
    // view 3
    $scope.selectOrg = function (obj) {
        $log.debug("login org selected: ", obj);
        var loginsetOrg = function (data) {
            if (data.status == 1) {
                SessionService.clear();
                SessionService.set({sessionId: data.meta.sessionId});
                OrgService.set({org_guid: obj.org_guid});
                $location.url("/dashboard");
            }
            else {
                $log.error("server: ", data);
            }
        };
        if (obj) {
            AuthService.loginSetOrg(obj, loginsetOrg);
        }
    };
});
LoginController.resolveFn = function ($q, $log, SessionService, AccountService, OrgService, $location, $localStorage) {
    $log.debug("LoginController.resolveFn")
    var deferred = $q.defer();
    var session  = SessionService.get();
    if (session) {
        if (session.sessionId && session.state !== "temp" && OrgService.get() && AccountService.get()) {
            $location.url("/dashboard");
        }
        else {
            $location.url("/logout");
        }
    }
    else {
        var remember = $localStorage.remember;
        deferred.resolve({remember: remember});
    }
    return deferred.promise;
};
