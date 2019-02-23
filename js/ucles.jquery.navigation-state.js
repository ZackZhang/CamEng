/*global $, jQuery*/
/*global window, js*/
(function ($) {
    "use strict";

    function configureNavigationState(element) {
        $(element).children("li").children('a').click(function () {
            $(element).children("li").removeClass('active');
            $(this).parent('li').addClass('active');

            $(element).children("li.navigation_item").removeClass('navigation_item--active');
            $(this).parent('li.navigation_item').addClass('navigation_item--active');
        });

        if (window.pathname === "/") {
            $("li > a[href='/']", element).addClass("active");
            $("li.navigation_item > a[href='/']", element).parent("li").addClass("navigation_item--active");
        }

        if (window.pathname === "/" || $('.landingPage') === null || $('.landingPage').length === 0) {
            return;
        }

        var pathName = window.pathname,
            pathparts = removeEmpty(pathName.split("/")),
            navlinks = [];

        $("> li > a", element).each(function (idx, el) {
            navlinks.push($(this).attr('href'));
        });

        var highestNavIndex = -1,
            highMatch = 0;

        for (var i = 0; i < navlinks.length; i++) {
            var matchCount = 0;
            var navparts = removeEmpty(navlinks[i].split("/"));

            for (var j = navparts.length - 1; j >= 0; j--) {
                if (pathparts.length >= j) {
                    if (navparts[j] === pathparts[j]) {
                        matchCount++;
                    }
                }
            }
            if (matchCount > highMatch) {
                highMatch = matchCount;
                highestNavIndex = i;
            }
        }

        if (highestNavIndex > -1) {
            var link = navlinks[highestNavIndex];
            if (link.indexOf(".") != -1) {
                var index = link.lastIndexOf('/');
                link = link.substring(0, index);
            }

            if (pathName.indexOf(link) != -1) {
                $("li > a[href='" + navlinks[highestNavIndex] + "']", element).parent("li").addClass("active");
                $("li.navigation_item > a[href='" + navlinks[highestNavIndex] + "']", element).parent("li").addClass("navigation_item--active");
            }
        }
    }

    function removeEmpty(val) {
        var result = [];
        for (var i = 0; i < val.length - 1; i++) {
            if (val[i] && val[i] !== '') {
                result.push(val[i]);
            }
        }
        return result;
    }

    $.fn.navigationState = function () {
        return $(this).each(function (index, item) {
            configureNavigationState(item);
        });
    };

}(jQuery));

$(document).ready(function () {
    $('.navigation_list').navigationState();
});