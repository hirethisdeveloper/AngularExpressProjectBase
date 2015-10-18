'use strict';
app.config(function ($routeProvider, $logProvider, $httpProvider, $locationProvider) {
    $routeProvider.when("/", {
        template  : "<div></div>",
        controller: "RootController"
    });
    $routeProvider.when('/login', {
        pageSettings: {
            title: 'Sign in'
        },
        templateUrl : "src/views/login/view.html",
        controller  : "LoginController",
        resolve     : {
            dataset: LoginController.resolveFn
        }
    });
    $routeProvider.when("/logout", {
        template  : "<div></div>",
        controller: "LogoutController"
    });
    $routeProvider.when('/dashboard', {
        pageSettings: {
            title: 'Main Dashboard'
        },
        templateUrl : "src/views/dashboard/view.html",
        controller  : "DashboardController"
    });
    $routeProvider.otherwise({
        redirectTo: "/"
    });
});
