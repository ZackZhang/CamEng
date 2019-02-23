/*global $, jQuery*/
/*global window, js*/
/*jslint plusplus: true */
/*jslint vars: true */

(function ($) {
    "use strict";

    function configureResponsiveTable(element) {
        $(window).on("load click resize orientationchange", function () {
            var tableContainerWidth = $(element).closest('div').outerWidth(),
                tableWidth = $(element).outerWidth();
            if (tableWidth > tableContainerWidth) {
                if ($(element).data("wrapped") !== true) {
                    $(element).wrap('<div class="table">').wrap('<div class="table-scroller">');
                    var scroller = $('.table-scroller'),
                        timer;
                    if (!(scroller.scrollLeft() + scroller.width() === $(element).width())) {
                        scroller.addClass('table-scroll-right');
                    }
                    if (!(scroller.scrollLeft() === 0)) {
                        scroller.addClass('table-scroll-left');
                    }
                    $(element).parent().scroll(function (e) {
                        var that = this;
                        $(that).removeClass('table-scroll-left').removeClass('table-scroll-right');
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            if (!($(that).scrollLeft() + $(that).width() === $(element).width())) {
                                $(that).addClass('table-scroll-right');
                            }
                            if (!($(that).scrollLeft() === 0)) {
                                $(that).addClass('table-scroll-left');
                            }
                        }, 500);
                    });
                    $(element).data("wrapped", true);
                }
            } else {
                if ($(element).data("wrapped") === true) {
                    $(element).unwrap().unwrap();
                    //$(this).addClass('table-scroll');
                    $(element).data("wrapped", false);
                }
            }
        });

    }

    $.fn.responsiveTable = function () {
        return $(this).each(function (index, item) {
            configureResponsiveTable(item);
        });
    };

}(jQuery));

$(document).ready(function() {
    "use strict";
    $('table').responsiveTable();
});

$(document).ajaxComplete(function () {
    "use strict";
    $('table').responsiveTable();
});