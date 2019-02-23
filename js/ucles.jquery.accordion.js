$(document).ready(function () {
    "use strict";
    $('.accordion').accordion({
        icons: {
            "header": "ui-icon-plus",
            "activeHeader": "ui-icon-minus"
        },
        collapsible: true,
        autoHeight: false,
        heightStyle: "content",
        navigation: true,
        active: false
    });

    if (location.hash) {
        var targetSelector = 'a[href=' + location.hash + ']';
        if ($('.accordion').find(targetSelector).length > 0) {
            $(targetSelector).click();
            jQuery(window).scrollTop($(targetSelector).offset().top);
        }
    } else {
        $('.accordion').accordion("option", "active", false);
    }

    $(".accordianTab").click(function () {
        if (!(this.hash === "#" || this.hash === "")) {
            window.location.hash = this.hash;
        }
    });
});