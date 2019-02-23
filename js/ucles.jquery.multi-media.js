/*global $, jQuery*/
/*global jwplayer, jwplayer*/
/*global window, js*/
(function ($) {
    "use strict";

    function getStandardPlayerSetup(item) {
        var setup = {
            width: '100%',
            height: '100%',
            base: '/js/',
            abouttext: 'us',
            aboutlink: '/about-us/',
            sharing: {},
            events: {
                onPlaylistItem: function (index, items) {
                    replaceSharing(index.id);
                }
            }
        },
            iesettings = {
                primary: 'flash'
            },

            title = $(item).find("[itemprop='name']"),
            description = $(item).find("[itemprop='description']"),
            image = $(item).find("[itemprop='thumbnailUrl'], [itemprop='thumbnail']"),
            aspectRatio = $(item).find("[itemprop='aspectRatio']"),
            urls = $(item).find("[itemprop='contentUrl']"),
            transcript = $(item).find("[itemprop='transcript']"),
			//Storing caption file name inside a variable 
			caption = $(item).find("[itemprop='video_subtitle']");

        if ($('html').hasClass('lte9') || $('html').hasClass('ie')) {
            $.extend(setup, iesettings);
        }

        if (title.length > 0) {
            setup.title = title.attr("content");
        }

        if (description.length > 0) {
            setup.description = description.attr("content");
        }

        if (image.length > 0) {
            setup.image = image.attr("content");
        } else {
            setup.height = 24;
        }

        if (aspectRatio.length > 0) {
            setup.aspectratio = aspectRatio.attr("content");
        }

        if (urls.length > 0) {
            if (urls.length > 1) {
                setup.sources = [{
                    file: $(urls[1]).attr("content")
                }, {
                    file: $(urls[0]).attr("content")
                }];
            } else {
                setup.file = $(urls[0]).attr("content");
            }
        }
		
		//checking the length of the caption
		 if (caption.length > 0) {
			//Extracting caption file name 
            setup.caption = caption.attr("content");
			//Adding caption file
			setup.tracks = [{
				file: setup.caption, 
				label: "English",
				kind: "captions",
				default: false
             }]
        }

        if (transcript.length > 0) {
            setup.transcript = transcript.attr("content");			
        }
		
		
        return setup;
    }

    $(document).on("click", ".jwplayer button", function (event) {
        event.preventDefault();
    });

    function getFancyboxPlayerSetup(item) {
        var setup = {
            width: '800',
            // 530
            height: '600',
            // 300
            autostart: true,
            base: '/js/',
            abouttext: 'us',
            aboutlink: '/about-us/',
            sharing: {},
            events: {
                onPlaylistItem: function (index, items) {
                    replaceSharing(index.id);
                }
            }
        },
            title = $(item).find("[itemprop='name']"),
            description = $(item).find("[itemprop='description']"),
            image = $(item).find("[itemprop='thumbnailUrl'], [itemprop='thumbnail']"),
            aspectRatio = $(item).find("[itemprop='aspectRatio']"),
            urls = $(item).find("[itemprop='contentUrl']"),
            transcript = $(item).find("[itemprop='transcript']"),
			//Storing caption message inside a variable 
			caption = $(item).find("[itemprop='video_subtitle']"),
            iesettings = {
                primary: 'flash'
            };

        if ($('html').hasClass('lte9')) {
            $.extend(setup, iesettings);
        }
		

        if (title.length > 0) {
            setup.title = title.attr("content");
        }

        if (description.length > 0) {
            setup.description = description.attr("content");
        }

        if (image.length > 0) {
            setup.image = image.attr("content");
        } else {
            setup.height = 24;
        }

        if (aspectRatio.length > 0) {
            setup.aspectratio = aspectRatio.attr("content");
        }

        if (urls.length > 0) {
            if (urls.length > 1) {
                setup.sources = [{
                    file: $(urls[1]).attr("content")
                }, {
                    file: $(urls[0]).attr("content")
                }];
            } else {
                setup.file = $(urls[0]).attr("content");
            }
        }
		//checking the length of the caption
		 if (caption.length > 0) {
			//Extracting caption file name 
            setup.caption = caption.attr("content");
			//Adding caption file
			setup.tracks = [{
				file: setup.caption, 
				label: "English",
				kind: "captions",
				"default": false
             }]
        }

        if (transcript.length > 0) {
            setup.transcript = transcript.attr("content");
        }
        return setup;
    }

    function loadItem(item, start, componentId) {
        $('.item').removeClass('active');
        $(item).addClass('active');

        jwplayer(componentId).setup(getStandardPlayerSetup(item));

        $('.now-playing').html($(item).find(".now-playing-item").html());

        if (start) {
            jwplayer(componentId).play(true);
        }
    }

    $.fn.addMultiMediaPlayer = function () {
        return this.each(function (val, item) {
            var componentId = $(item).data("componentid");
            jwplayer(componentId).setup(getStandardPlayerSetup(item));
        });
    };

    $.fn.addMultiMediaPlayList = function () {
        return this.each(function (val, item) {
            var componentId = $(item).data("componentid");
            // Add the click handler to each li
            $(item).children("li.item").click(function () {
                loadItem(this, true, componentId);
            });
            // Make the first item ready to play
            loadItem($(item).children("li.item")[0], false, componentId);
        });
    };

    $.fn.addMultiMediaPlayerInLightBox = function () {
        return this.each(function (val, item) {
            var componentId = $(item).data("componentid"),
                anchorSelector = "a.fancybox-panel-" + componentId,
                panelId = "panel-" + componentId;

            $(item).find(anchorSelector).fancybox({
                'content': '<div id="' + panelId + '"></div>',
                helpers: {
                    overlay: {
                        closeClick: false
                    } // prevents closing when clicking OUTSIDE fancy box 
                },
                maxWidth: 800,
                // 530
                maxHeight: 600,
                // 300
                fitToView: true,
                width: '90%',
                height: '90%',
                padding: 0,
                openEffect: 'none',
                closeEffect: 'none',
                nextEffect: 'none',
                prevEffect: 'none',
                afterShow: function () {
                    jwplayer(panelId).setup(getFancyboxPlayerSetup(item));
                }
            });
        });
    };

    $.fn.addMultiMediaGalleryInLightBox = function () {
        return this.each(function (val, item) {
            var componentId = $(item).attr('id'),
                ele = $(this.element),
                parentId = ele.parent().attr("data-componentid");

            $("a[class*='fancybox-panel-']", $('#' + componentId)).fancybox({
                helpers: {
                    overlay: {
                        closeClick: false
                    } // prevents closing when clicking OUTSIDE fancybox 
                },
                maxWidth: 800,
                maxHeight: 600,
                fitToView: true,
                width: '70%',
                height: '70%',
                afterShow: function () {
                    if (!ele.hasClass("imageMedia")) {
                        $(".fancybox-inner").html('<div id="panel-' + componentId + '"></div>');
                        jwplayer('panel-' + componentId).setup(getFancyboxPlayerSetup($(this.element).parents('figure').first()));
                    }
                }
            });
        });
    };

    function replaceSharing(componentId) {

        var code = $(".widget-code"),
            id = "#" + componentId + "_sharing",
            container = $(id).children(":first");

        if (code.length > 0) {
            if (container.length > 0) {
                container.addClass("sharing-widget");
                container.html(code[0].innerHTML.trim());
                if (addthis) {
                    addthis.toolbox(id);
                }
            }
        }
    }
}(jQuery));