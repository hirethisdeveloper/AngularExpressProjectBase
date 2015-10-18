'use strict';
/*
 Directive: verticallyAligned
 Created: 10/4/15 12:47 PM
 */
app.directive("verticallyAligned", function ($log, $window) {
    return {
        restrict  : "A",
        controller: function ($scope) {
            $log.debug("DIRECTIVE: verticallyAligned init")
        },
        link      : function ($scope, element, attrs) {

            var moveBox = function() {
                var el_height     = element.height(),
                    window_height = $(window).height(),
                    ypos = window_height / 2 - el_height / 2;

                element.css({
                    marginTop: ypos + "px"
                })
            };

            angular.element($window).bind('load', function () {
                moveBox();
            })
            angular.element($window).bind('resize', function () {
                moveBox();
            })
        }
    }
})






