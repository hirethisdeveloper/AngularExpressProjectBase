'use strict';
/**
 * FACTORY INTERCEPTOR: globalInterceptor
 * PURPOSE: Intercepts all communications made in the app and manipulates what is needed
 */
app.factory('globalInterceptor', function ($q, $log, SessionService, AccountService, $location) {
    return {
        request      : function (req) {
            var session = SessionService.get();
            if (req.url.match(/\/api\//i)) {
                $log.debug("<- globalInterceptor request: ", req.url, req);
                if (session) req.headers.sessionid = session.sessionId;
                if (req.url.match("login")) {
                    var account = AccountService.get();
                    if (account) req.headers.account_guid = account.account_guid;
                }
                else {
                    if (!req.url.match("logout")) {
                        $log.debug("<- REQUEST - NOT LOGIN - ", session);
                        if (!session) {
                            $location.url("/logout");
                        }
                    }
                }
            }
            return req;
        },
        requestError : function (rejection) {
            $log.debug("<- globalInterceptor requestError: ", rejection);
            return $q.reject(rejection);
        },
        response     : function (response) {
            if (response.config.url.match(/\/api\//i)) {
                $log.debug('-> globalInterceptor response: ', response.config.url, response);
            }
            return response;
        },
        responseError: function (rejection) {
            $log.debug("-> globalInterceptor responseError: ", rejection);
            return $q.reject(rejection);
        }
    };
});
/**
 * FACTORY: AuthService
 * PURPOSE: Houses authentication related methods
 */
app.factory("AuthService", function ($log, Entity, $localStorage) {
    return {
        login       : function (obj, callback) {
            if (obj.username && obj.password) {
                var cfg = {
                    resource: "login"
                };
                var res = Entity.update(cfg, obj, callback);
                return res.promise;
            }
            else {
                callback({status: 0, code: 4001})
            }
        },
        loginGetOrgs: function (obj, callback) {
            var cfg = {
                resource      : "login",
                listController: "org"
            };
            var res = Entity.get(cfg, callback);
            return res.promise;
        },
        loginSetOrg : function (obj, callback) {
            if (obj.guid) {
                var cfg      = {
                    resource      : "login",
                    listController: "org"
                };
                obj.org_guid = angular.copy(obj.guid);
                delete obj.guid;
                var res      = Entity.update(cfg, obj, callback);
                return res.promise;
            }
        },
        logout      : function (callback) {
            var cfg = {
                resource: "logout"
            };
            var res = Entity.update(cfg, {}, callback);
            return res.promise;
        }
    }
});
/**
 * FACTORY: Entity
 * PURPOSE: Communication service for the application. All communication to our API happens with this.
 */
app.factory('Entity', ['$resource', function ($resource) {
    var APIURL = "//0.0.0.0:7076/api";
    return $resource(
        APIURL + "/:resource/:listController:id/:docController/:opt/:opt2/:opt3",
        {
            opt           : "@opt",
            listController: "@listController",
            docController : "@docController",
            resource      : "@resource"
        },
        {
            get   : {
                method : "GET",
                headers: {}
            },
            update: {
                method: "POST",
                params: {}
            }
        }
    );
}]);
/**
 * FACTORY: SessionService
 * PURPOSE: Returns methods for managing the current session
 */
app.factory("SessionService", function ($log, $localStorage) {
    return {
        get  : function (list) {
            if (list) {
                return _.pick($localStorage.session, list)
            }
            else return $localStorage.session;
        },
        set  : function (session) {
            $localStorage.session = session;
        },
        clear: function () {
            delete $localStorage.session;
        }
    }
});
/**
 * FACTORY: AccountService
 * PURPOSE: Returns methods for managing the current account
 */
app.factory("AccountService", function ($log, $localStorage) {
    return {
        get  : function (list) {
            if (list) {
                return _.pick($localStorage.account, list)
            }
            else return $localStorage.account;
        },
        set  : function (obj) {
            $localStorage.account = _.extend($localStorage.account ? $localStorage.account : {}, obj);
        },
        clear: function () {
            delete $localStorage.account;
        }
    }
});
/**
 * FACTORY: OrgService
 * PURPOSE: Returns methods for managing the current org
 */
app.factory("OrgService", function ($log, $localStorage) {
    return {
        get  : function (list) {
            if (list) {
                return _.pick($localStorage.org, list)
            }
            else return $localStorage.org;
        },
        set  : function (obj) {
            $localStorage.org = _.extend($localStorage.org ? $localStorage.org : {}, obj);
        },
        clear: function () {
            delete $localStorage.org;
        }
    }
});
/**
 * FACTORY: PageSettingsService
 * PURPOSE: Returns methods for manipulating the overall app page
 */
app.service('PageSettingsService', ['$filter', function ($filter) {
    return {
        /* Generate set title for pages. */
        /* Can be used in router.js for static titles and and in controllers for complex titles */
        setTitle: function (sectionName) {
            var pageTitle = '';
            if (sectionName) {
                pageTitle += sectionName;
            }
            document.title = pageTitle;
        }
    }
}])
