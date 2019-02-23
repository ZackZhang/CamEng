/*jslint browser: true*/
/*global $, jQuery*/
$(document).ready(function () {
    "use strict";
    prepareAccordian();
});

function prepareAccordian() {
    "use strict";

    function collapseAll(anchor) {
        $(anchor).closest('.accordianGroup').find('.contractable').next("ul").slideUp();
        $(anchor).closest('.accordianGroup').find('.contractable').next("div").children('ul:first').slideUp();
        $(anchor).closest('.accordianGroup').find('.contractable').removeClass("contractable").addClass("expandable");
    }
    if ($(".accordianGroup")[0]) {
        $(".accordianGroup a.accordianTab").click(function (e) {
            e.preventDefault();

            if ($(this).hasClass("expandable")) {
                collapseAll($(this));

                $(this).next("ul").find("a.accordianTab").removeClass("contractable").addClass("expandable");
                $(this).next("ul").find("a.accordianTab").siblings("ul").css("display", "none");
                $(this).next("ul").slideDown();
                // 
                $(this).next("div").children('ul:first').find("a.accordianTab").removeClass("contractable").addClass("expandable");
                $(this).next("div").children('ul:first').find("a.accordianTab").siblings("ul").css("display", "none");

                $(this).next("div").children('ul:first').slideDown();
                // 
                $(this).removeClass("expandable").addClass("contractable");

            } else {
                $(this).removeClass("contractable").addClass("expandable");
                // 
                $(this).next("ul").slideUp();
                $(this).next("ul").find("a.accordianTab").removeClass("contractable").addClass("expandable");
                $(this).next("ul").find("a.accordianTab").siblings("ul").slideUp();
                // 
                $(this).next("div").children('ul:first').slideUp();
                $(this).next("div").children('ul:first').find("a.accordianTab").removeClass("contractable").addClass("expandable");
                $(this).next("div").children('ul:first').find("a.accordianTab").siblings("ul").slideUp();

            }
        });
    }

}