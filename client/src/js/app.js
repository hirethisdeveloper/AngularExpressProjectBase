'use strict';
var app = angular.module("projectBlocksApp", [
    'ngRoute',
    'ngStorage',
    'ngResource'
]);

app.config(function ($routeProvider, $logProvider, $httpProvider, $locationProvider) {
    $logProvider.debugEnabled(true);
    $httpProvider.interceptors.push('globalInterceptor');
});
app.run(function ($log, $rootScope, PageSettingsService, APPINFO) {
    $log.debug('App is running!');
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $log.debug("$routeChangeSuccess $on")
        var pageSettings = '';
        if (current.$$route) {
            pageSettings = current.$$route.pageSettings || '';
        }
        PageSettingsService.setTitle(APPINFO.title + " - " + pageSettings.title);
    });
});
app.value("ErrorCodes", [
    {code: 4001, text: "invalid username or password"},
    {code: 4002, text: "account is not enabled"},
    {code: 4003, text: "invalid sessionId"},
    {code: 5000, text: "db error occurred"},
    {code: 5001, text: "too many results returned for this entity"}
]);
app.value("APPINFO", {
    title: "ProjectBlocks"
});
