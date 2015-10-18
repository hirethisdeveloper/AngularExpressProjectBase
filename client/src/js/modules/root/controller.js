'use strict';
var RootController = app.controller("RootController", function($scope, $log, SessionService, AccountService, OrgService, $location) {
    var session  = SessionService.get(),
        org = OrgService.get(),
        account = AccountService.get();

    $log.debug("RootController init", {
        session: session,
        org: org,
        account: account
    });

    if (session && org && account ) {
        if (session.sessionId && session.state !== "temp" && org.org_guid && account.account_guid) {
            $location.url("/dashboard");
        }
        else {
            $location.url("/logout");
        }
    }
    else {
        $location.url("/logout");
    }
})

