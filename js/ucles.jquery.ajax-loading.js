$(document).ready(function () {
    "use strict";
    var loading = $('<div id="loadingDiv" class="loading-div"><img src="/images/loader.gif" alt="" /></div>');
    loading.prependTo('body');
    loading.hide();
    loading.data("running", 0);
    $(document)
        .ajaxStart(function () {
            var count = $('#loadingDiv').data("running");
            $('#loadingDiv').data("running", ++count);

            setTimeout(function () {
                if ($('#loadingDiv').data("running") > 0) {
                    $('#loadingDiv').show();
                }
            }, 1000);

        })
        .ajaxStop(function () {
            var count = $('#loadingDiv').data("running");
            $('#loadingDiv').data("running", --count);
            $('#loadingDiv').hide();
        });
});

function prepareAjaxModalLoad() {
    "use strict";
    return false;
}