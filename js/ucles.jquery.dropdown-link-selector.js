(function ($) {
    "use strict";

    $.fn.dropDownlinkSelector = function () {

        return $(this).each(function (i, item) {
            $(item).change(function () {
                var href = $(this).val(),
                    target = $("option:selected", this).attr("target");

                if (href === '/') {
                    return false;
                }
                window.open(href, target);
                return false;
            });
        });
    };
}(jQuery));