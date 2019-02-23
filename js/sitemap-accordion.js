/*jslint browser: true*/
/*global $, jQuery*/
/*
SETUP
*/
var navWidth = 'auto'; //in pixels
var ulIndent = 19; //in pixels
var slideSpeed = 'fast'; // 'slow', 'normal', 'fast', or miliseconds 
//end setup
var pathname = window.location.pathname;

$(function () {
    "use strict";
    $('.sitemapList').css('width', navWidth + 'px');
    $('.sitemapList ul').css('width', navWidth + 'px');
    $('.sitemapList ul').css('margin-left', ulIndent + 'px');
    $('.sitemapList li>ul').css('display', 'block');
    $('.sitemapList li>ul>li>ul').css('display', 'none');

    $('.sitemapList a').each(function () {
        var level = $(this).parents('ul').length,
            liWidth = navWidth - (ulIndent * level) + 30;
        $(this).parent('li').css('width', liWidth + 'px');
    });

    /*
        add 'current' class to the current page
        */
    $('.sitemapList a').each(function () {
        var thisHref = $(this).attr('href');
        if ((window.location.pathname.indexOf(thisHref) === 0) || (window.location.pathname.indexOf('/' + thisHref) === 0)) {
            $(this).addClass('current');
        }
    });

    /*
        display the current page
        */
    $('.current').parent('li').children('ul').show();
    $('.current').parents('ul').show();

    /*
        add expand/collapse icons
        */
    $('.sitemapList li').each(function () {
        if ($(this).children('ul').length > 0) {
            if ($(this).children('ul').is(":visible")) {
                $(this).children("span").prepend('<a class="toggler" href="#">-</a>');
                $(this).css('background', 'none');
            } else {
                $(this).children("span").prepend('<a class="toggler" href="#">+</a>');
                $(this).css('background', 'none').css('padding-left', '0px');
            }
        }
    });

    /*
        open/close current each list on click
        */
    $(".sitemapList a.toggler").click(function () {
        if ($(this).parent('span').parent('li').children('ul').html() !== null) {

            if ($(this).parent('span').parent('li').parent('ul').hasClass("sitemapList")) {
                //for outermost accordians
                $(this).parent('span').parent('li').parent('ul').children('ul').hide();
                $(this).text('+').parent('span').css("background", "none");
                $(this).delay(100).is(':hidden');
                if ($(this).parent('span').parent('li').children('ul').css('display') === "block") {
                    $(this).parent('span').parent('li').children('ul').hide();
                    $(this).text('+').parent('span').css("background", "none");
                } else {
                    $(this).parent('span').parent('li').children('ul').show();
                    $(this).text('-').parent('span').css("background", "#E0EAFF");
                }
                return false;

            } else {
                //for nested accordians
                $(this).parent('span').parent('li').parent('ul').children('ul').hide();
                $(this).delay(100).is(':hidden');
                if ($(this).parent('span').parent('li').children('ul').css('display') === "block") {
                    $(this).parent('span').parent('li').children('ul').hide();
                    $(this).css("line-height", "1.333em").text('+');
                } else {
                    $(this).parent('span').parent('li').children('ul').show();
                    $(this).css("line-height", "1em").text('-');
                }
                return false;
            }

        } else {
            return true;
        }

    });

    //End Required Section
    //Optional Section - Show Carrots
    var charBeforeLb = 23, //characters before line break - you must calculate this - based on font-size and LI width;
        paddingBig = 12, //push carrot arrow down (in pixels) when no there is a line break in the LI
        paddingSmall = 8, //push carrot arrow down (in pixels) when no there is no line break in the LI
        maxLiHeight = 50; // max height of LI when list is closed
    /*
        Logic to decide whether current list is open,
        and determine how much padding to give the expand/collapse icons .  
        */
    $('.sitemapList > li').each(function () {
        var childText = $(this).children('a').text(),
            topPadding = paddingBig;
        if (childText.length < charBeforeLb) {
            topPadding = paddingSmall;
        }
        //if list is closed
        if ($(this).height() < maxLiHeight) {
            if ($(this).children('a').attr('class') === "current") {
                $(this).parent('li').children('img').attr('src', '../images/imgOnOpen.gif');
            } else {
                $(this).parent('li').children('img').attr('src', '../images/imgOffClosed.gif');
            }
        } else { //if list is open
            $(this).children('img').attr('src', '../images/imgOnOpen.gif');
        }
    });

    //End Optional Section
});

function ExpandAll() {
    "use strict";
    $('.sitemapList ul').each(function () {
        $(this).show();
    });
}

function CollapseAll() {
    "use strict";
    $('.sitemapList ul').each(function () {
        $(this).hide();
    });
}