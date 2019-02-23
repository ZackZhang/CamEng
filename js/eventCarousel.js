/*jslint browser: true*/
/*global $, jQuery*/
// JavaScript Document
$(function () {
    "use strict";
    var autoTimer; /* Adding Slides class for carousel <UL>*/
    $(".caCarousel > ul").addClass("slides");

    $("div.caCarousel").each(function () {

        if ($(this).attr("data-target")) {
            autoTimer = $(this).attr("data-target");
        } else {
            autoTimer = 2000;
        }

        var carousel = $(this).flexslider({
            animation: "slide",
            directionNav: true,
            controlNav: true,
            pauseOnHover: false,
            pauseOnAction: true,
            keyboardNav: false,
            mousewheel: false,
            slideToStart: 0,
            useCSS: false,
            slideshowSpeed: autoTimer,
            after: function (slider) {
                if ($(slider).data("expanded") === true) {
                    var current = $("li.flex-active-slide", slider),
                        target = $(current).attr('data-target');

                    $("a[href=" + target + "]", current).click();
                    $(slider).data("expanded", true);
                    if (slider.playing === true) {
                        slider.flexslider("pause");
                    }
                } else {
                    if (slider.playing === false) {
                        slider.flexslider("play");
                    }
                }
            }
        });

        $(this).mouseover(function () {
            if ($(this).data("expanded") !== true) {
                if ($(this).data('flexslider') && $(this).data('flexslider').playing === true) {
                    $(this).flexslider("pause");
                }
            }
        });

        $(this).mouseout(function () {
            if ($(this).data("expanded") !== true) {
                if ($(this).data('flexslider') && $(this).data('flexslider').playing === false) {
                    $(this).flexslider("play");
                }
            }
        });
    });
});