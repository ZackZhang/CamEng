/************************* iframe video z-index fix *******************************/
$(document).ready(function () {
    "use strict";
    $('iframe:not([src=""], [name*="dotmailer_iframe"], [src*="bookings.cambridgeassessment.org.uk"], [src*="btn.createsend1.com"])').each(function () {
        var url = $(this).attr("src"),
            currentUrl = $(this).attr("src");
        if (currentUrl !== undefined) {
            if (currentUrl.indexOf("?") === -1) {
                $(this).attr("src", url + "?wmode=transparent");
            } else {
                $(this).attr("src", url + "&wmode=transparent");
            }
        }
    });
});