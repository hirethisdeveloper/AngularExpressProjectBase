'use strict';
app.directive('disableAutocomplete', function ($timeout) {
    return {
        require: 'ngModel',
        scope  : {
            mockId: "@"
        },
        link   : function (scope, elem, attrs, ngModel) {
            var origVal = elem.val();
            elem.hide();
            $timeout(function () {
                var newVal = elem.val();
                if (origVal !== newVal) {
                    ngModel.$setViewValue(origVal);
                    ngModel.$render();
                }
                elem.attr("readonly", "readonly");
                elem.show();
                angular.element("#" + scope.mockId).hide();
            }, 500);
            var setFocusAgain = false;
            elem.on("focus", function () {
                if (!setFocusAgain) {
                    elem.removeAttr("readonly");
                    setFocusAgain = true;
                    elem.blur();
                } else {
                    setFocusAgain = false;
                }
            });
            elem.on("blur", function () {
                if (!setFocusAgain) {
                    elem.attr("readonly", "readonly");
                } else {
                    $timeout(function () {
                        elem.focus();
                    });
                }
            });
        }
    }
});


app.directive('autoFillSync', function($timeout) {
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
            var origVal = elem.val();
            $timeout(function () {
                var newVal = elem.val();
                if(ngModel.$pristine && origVal !== newVal) {
                    ngModel.$setViewValue(newVal);
                }
            }, 500);
        }
    }
});


