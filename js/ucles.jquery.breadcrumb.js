/*global $, jQuery*/
/*global window, js*/
/*jslint plusplus: true */
/*jslint vars: true */

(function ($) {
    "use strict";

    function configureBreadCrumb(element) {
        if ($(element).data('bc-init') === true) {
            return;
        }

        var breadcrumb = $('ul:first-child', $(element));
        if (breadcrumb.length < 1) {
            return;
        }

        var firstHeight = 0;
        if ($(breadcrumb).children().length > 0) {
            firstHeight = $($(breadcrumb).children()[0]).height();
        }

        var nodes = $(breadcrumb.children('li.last-child:visible')).length > 0 ? $(breadcrumb.children('li.last-child:visible')) : $(breadcrumb.children('li.last-parent:visible'));
        var lastHeight = 0;
        if (nodes.length > 0) {
            lastHeight = $(nodes[nodes.length - 1]).height();
        }

        var maxLength = 15;
        var links;

        // If it is wrapped
        while (lastHeight > firstHeight && maxLength > 0) {
            maxLength -= 1;
            links = $('.breadcrumb a, .breadcrumbs a span');
            for (var i = links.length - 1; i >= 0; i--) {
                var link = $(links[i]);
                var originalText = link.text();
                if (originalText.length > maxLength) {
                    var text = originalText.substring(0, maxLength) + '...';
                    link.text(text);
                }
            }

            nodes = $(breadcrumb.children('li.last-child:visible')).length > 0 ? $(breadcrumb.children('li.last-child:visible')) : $(breadcrumb.children('li.last-parent:visible'));
            lastHeight = $(nodes[nodes.length - 1]).height();
        }

        $(element).data('bc-init', true);
    }

    $.fn.breadcrumb = function () {
        return $(this).each(function (index, item) {
            configureBreadCrumb(item);
        });
    };

}(jQuery));

$(window).load(function () {
    $('.breadcrumbs').breadcrumb();
});