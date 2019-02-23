/*jslint browser: true*/
/*global $, jQuery*/
// JavaScript Document
jQuery(document).ready(function () {
    "use strict";
    jQuery('select.jsDropdown').each(function () {
        var dropdown = this;
        setTimeout(function () {
            new GenericDropdown(dropdown);
        }, 1);
    });
});

// GENERIC DROPDOWNS
GenericDropdown = function (element) {
    "use strict";
    var self = this,
        name = jQuery(this.element).attr('name'),
        /* get name */
        attributes = this.element.attributes,
        x,
        events = jQuery.data(this.element, 'events') ? jQuery.data(this.element, 'events')['change'] : null,
        /* copy over events */
        tmp = jQuery('<div class="jsDropdownMenu" style="position:static"><ul><li style="display:inline; padding:0"></li></ul></div>'),
        handler,
        y;

    //this.element = this.element ? this.element : element;
    this.element = this.element || element;
    this.field = {};
    this.ddelement = null;
    //this.options = this.options ? this.options : [];
    this.options = this.options || [];
    this.selectedIndex = 0;
    this.width = 0;
    this.position = [];
    this.change = [];
    this.attributes = {};
    //this.className = this.className ? this.className : 'jsDropdown';
    this.className = this.className || 'jsDropdown';
    this.value = null;
    this.keySelected = 0;

    //this.eventOpen = this.eventOpen ? this.eventOpen : function (e) {
    this.eventOpen = this.eventOpen ||
        function (e) {
            self.open(e);
        };
    //this.eventSelect = this.eventSelect ? this.eventSelect : function (e) {
    this.eventSelect = this.eventSelect ||
        function (e) {
            self.select(e);
        };
    //this.eventKeydown = this.eventKeydown ? this.eventKeydown : function (e) {
    this.eventKeydown = this.eventKeydown ||
        function (e) {
            self.keydown(e);
        };
    //this.eventChange = this.eventChange ? this.eventChange : function (e) {
    this.eventChange = this.eventChange ||
        function (e) {
            self.change(e);
        };
    //this.eventClose = this.eventClose ? this.eventClose : function (e) {
    this.eventClose = this.eventClose ||
        function (e) {
            self.close(e);
        };
    //this.eventCancel = this.eventCancel ? this.eventCancel : function (e) {
    this.eventCancel = this.eventCancel ||
        function (e) {
            self.cancel(e);
        };

    if (this.element) {
        // save options data
        jQuery(this.element).find('option').each(function (i) {
            if (!self.options[i]) {
                self.options[i] = [];
                self.options[i][0] = jQuery(this).val();
                self.options[i][1] = jQuery(this).text();
                self.options[i][2] = jQuery(this).attr('class');
            }
            if (this.selected) {
                self.selectedIndex = i;
            }
        });

        // save attributes
        for (x = 0; x < attributes.length; x += 1) {
            this.attributes[attributes[x].nodeName] = attributes[x].nodeValue;
        }

        // save class names
        this.className = this.className + ' ' + this.element.className.replace(this.className, '');
        //console.log(events);
        if (events) {
            for (handler in events) {
                if (!!events[handler].handler) {
                    this.change.push(events[handler].handler);
                }
            }
        }
        //console.log(this.change)
        // calculate max width
        jQuery('body').append(tmp);
        for (y = 0; y < this.options.length; y += 1) {
            tmp.find('li').text(this.options[y][1]);
            if (tmp.find('li')[0].offsetWidth > this.width) {
                this.width = tmp.find('li')[0].offsetWidth;
            }
        }
        tmp.remove();

        // draw styled dropdown
        this.draw();

        // save reference to object in jQuery
        this.element.data('jDropdown', self);

        // create hidden field with data
        this.field = jQuery('<input type="hidden" name="' + name + '" value="' + this.options[this.selectedIndex][0] + '" />');
        this.element.after(this.field);

        // save data into jQuery
        this.element.data('name', name);
        this.element.data('value', this.options[this.selectedIndex][0]);
        this.element.val(this.options[this.selectedIndex][0]);

        // save selected value
        this.value = this.options[this.selectedIndex][0];

        // bind window close event to replace normal selects for server data
        // jQuery( window ).bind( 'beforeunload', unload );
    }
};

GenericDropdown.prototype.draw = function () {
    "use strict";
    var self = this,
        id = (this.element.id) || null,
        widthFactor = jQuery('#selectCatFAQ').length ? 0 : 27,
        width = (jQuery(this.element).css('width') !== 'auto') ? (parseInt(jQuery(this.element).css('width'), 10) > this.width) ? parseInt(jQuery(this.element).css('width'), 10) - widthFactor : this.width + 5 : this.width + 5,
        dropdown = jQuery('<a href="#" class="' + this.className + '"><span>' + this.options[this.selectedIndex][1] + '</span></a>'),
        spanwidth = width,
        select = jQuery(this.element);

    // get id if there is one
    //var id = (this.element.id) ? this.element.id : null;
    // setting max width for the dropdowns
    width = width > 340 ? 340 : width;

    // bind events
    //dropdown.width( width );
    dropdown.bind('click', self.eventOpen);
    dropdown.bind('keydown', self.eventKeydown);
    dropdown.bind('change', self.eventChange);
    //spanwidth=width-17;
    //alert(spanwidth+"\n"+width);
    dropdown.find('span').css({
        width: spanwidth + 'px'
    });
    if (id) {
        dropdown.attr('id', id);
    }

    // replace existing dropdown with styled one
    this.element = jQuery(dropdown);
    select.replaceWith(this.element);
    // custom width set for accordion
};

GenericDropdown.prototype.unload = function () {
    "use strict";
    var select = jQuery('<select></select>').css({
        visibility: 'hidden'
    });

    // copy back attributes
    jQuery.each(this.attributes, function (key, value) {
        select[0].setAttribute(key, value);
    });

    // add in options
    jQuery.each(this.options, function () {
        select.append(jQuery('<option value="' + this[0] + '">' + this[1] + '</option>'));
    });

    // set selected option
    select.find('option')[this.selectedIndex].selected = 'selected';

    // replace jsDropdown
    this.element.replaceWith(select.removeClass('jsDropdown'));
    this.element = select;
};

GenericDropdown.prototype.open = function (e) {
    "use strict";
    var self = this,
        inPopup = this.element.parents('#Popup').length ? true : false,
        jqueryOffset = this.element.offset(),
        width = (this.element.innerWidth() > this.width) ? this.element.innerWidth() : this.width,
        top = this.position[1],
        dd = this.ddelement,
        item = jQuery('<li><span>' + this.options[x][1] + '</span></li>'),
        x;

    if (this.element.attr('disabled') !== 'disabled') {
        // get position for dropdown
        // This line is not working with jquery 1.4 so removing border and padding paramaters
        //var jquery_offset = this.element.offset( { border:true, padding:true } );
        //this.position = [ jquery_offset.left+2, jquery_offset.top + this.element.outerHeight()-3 ];
        this.position = [jqueryOffset.left, jqueryOffset.top + this.element.outerHeight()];
        if (inPopup && !(jQuery.browser.msie && jQuery.browser.version < 7)) {
            top = top - jQuery(document).scrollTop();
        }

        // create dropdown
        this.ddelement = jQuery('<div class="jsDropdownMenu"><div class="top-content"><ul class="content"></ul></div></div>').css({
            width: width - 6
        });
        this.ddelement = jQuery('<div class="jsDropdownMenu"><div class="top-content"><ul class="content"></ul></div></div>');
        this.ddelement.css({
            top: top,
            left: this.position[0] + 'px'
        });
        if (inPopup && !(jQuery.browser.msie && jQuery.browser.version < 7)) {
            this.ddelement.css({
                position: 'fixed'
            });
        }
        if (jQuery.browser.msie && jQuery.browser.version < 7 && inPopup) {
            jQuery(window).bind('scroll', function () {
                dd.css({
                    top: top + jQuery(document).scrollTop()
                });
            });
        }
        for (x = 0; x < this.options.length; x += 1) {

            if (x === this.selectedIndex) {
                item.addClass('selected');
            }

            if (this.options[x][2]) {
                item.addClass(this.options[x][2]);
            }

            item.bind('click', self.eventSelect);
            item.bind('mouseover', function () {
                self.ddelement.find('li.selected').removeClass('selected');
                jQuery(this).addClass('selected');

                self.keySelected = self.ddelement.find('li').index(this);
            });

            this.ddelement.find('ul.content').append(item);
        }

        // append dropdown to container
        jQuery('body').append(this.ddelement);

        // remove open event and add cancel event
        this.element.unbind('click', self.eventOpen);
        this.element.bind('click', self.eventCancel);

        // add close event
        setTimeout(function () {
            jQuery('body').bind('click', self.eventClose);
        }, 1);

        //jQuery('.jsDropdownMenu .first span').append(this.options[this.selectedIndex][1])
    }

    //  e.stopPropagation();
    e.preventDefault();
};

GenericDropdown.prototype.keydown = function (e) {
    "use strict";
    var z,
        x;

    if (e.keyCode === 32) { // space
        if (!this.ddelement) {
            this.keySelected = this.selectedIndex;
            this.open(e);
        } else {
            this.ddelement.find('li.selected').click();
            e.preventDefault();
        }
    } else if (e.keyCode === 40) { // down
        if (++this.keySelected > this.options.length - 1) {
            this.keySelected = 0;
        }

        if (this.ddelement) {
            this.ddelement.find('li.selected').removeClass('selected');
            this.ddelement.find('li:eq(' + this.keySelected + ')').addClass('selected');
        } else {
            this.selectedIndex = this.keySelected;

            // set text dropdown
            this.element.find('span').text(this.options[this.selectedIndex][1]);

            // save value in jQuery
            this.element.data('value', this.options[this.selectedIndex][0]);

            // save selected value
            this.value = this.options[this.selectedIndex][0];
            this.element.val(this.options[this.selectedIndex][0]);
            this.field.val(this.options[this.selectedIndex][0]);

            // perform custom event listeners if they exist
            e.target = this.element[0];
            if (this.change.length) {
                for (z = 0; z < this.change.length; z += 1) {
                    this.change[z].call(this, e);
                }
            }
        }

        e.preventDefault();
    } else if (e.keyCode === 38) { // up
        if (--this.keySelected < 0) {
            this.keySelected = this.options.length - 1;
        }

        if (this.ddelement) {
            this.ddelement.find('li.selected').removeClass('selected');
            this.ddelement.find('li:eq(' + this.keySelected + ')').addClass('selected');
        } else {
            this.selectedIndex = this.keySelected;

            // set text dropdown
            this.element.find('span').text(this.options[this.selectedIndex][1]);

            // save value in jQuery
            this.element.data('value', this.options[this.selectedIndex][0]);

            // save selected value
            this.value = this.options[this.selectedIndex][0];
            this.element.val(this.options[this.selectedIndex][0]);
            this.field.val(this.options[this.selectedIndex][0]);

            // perform custom event listeners if they exist
            e.target = this.element[0];
            if (this.change.length) {
                for (x = 0; x < this.change.length; x += 1) {
                    this.change[x].call(this, e);
                }
            }
        }

        e.preventDefault();
    } else if (e.keyCode === 13) { // return
        this.ddelement.find('li:eq(' + this.keySelected + ')').click();
        e.preventDefault();
    } else if (e.keyCode === 9 && this.ddelement) { // tab
        this.ddelement.find('li:eq(' + this.keySelected + ')').click();
    }
};

GenericDropdown.prototype.select = function (e) {
    "use strict";
    // get index of selected item
    var newSelection = -1,
        targetLi = e.target,
        listItems = this.ddelement.find('li'),
        w,
        x;

    if (targetLi.nodeName !== 'LI') {
        targetLi = jQuery(targetLi).parents('li')[0];
    }
    for (w = 0; w < listItems.length; w += 1) {
        if (listItems[w] === targetLi) {
            newSelection = w;
            break;
        }
    }
    if (newSelection !== this.selectedIndex) {
        this.selectedIndex = newSelection;
        // set text dropdown
        this.element.find('span').html(this.options[this.selectedIndex][1]);

        // save value in jQuery
        this.element.data('value', this.options[this.selectedIndex][0]);

        // save selected value
        this.value = this.options[this.selectedIndex][0];
        this.element.val(this.options[this.selectedIndex][0]);
        this.field.val(this.options[this.selectedIndex][0]);

        // perform custom event listeners if they exist
        e.target = this.element[0];
        //alert(this.change.length);
        if (this.change.length) {
            for (x = 0; x < this.change.length; x += 1) {
                //alert(this.change[0].toString());
                //this.change[x].call(this, e);
                this.change[x].call(this, e);
            }
        }
    }

    this.eventClose(e);

    e.stopPropagation();
    e.preventDefault();
};

GenericDropdown.prototype.close = function (e) {
    "use strict";
    var self = this;

    this.ddelement.remove();
    delete this.ddelement;

    // remove close event
    jQuery('body').unbind('click', self.eventClose);

    // add open event and remove cancel event
    setTimeout(function () {
        self.element.bind('click', self.eventOpen);
    }, 1);
    this.element.unbind('click', self.eventCancel);

    if (e) {
        e.preventDefault();
    }
};

GenericDropdown.prototype.cancel = function (e) {
    "use strict";
    this.eventClose(e);

    e.stopPropagation();
};

GenericDropdown.prototype.reset = function (dropdown) {
    "use strict";
    var select = jQuery('<select></select>');

    // copy back attributes
    jQuery.each(this.attributes, function (key, value) {
        select[0].setAttribute(key, value);
    });
    if (dropdown.id) {
        select[0].id = dropdown.id;
    }

    // add in options
    jQuery.each(this.options, function () {
        select.append(jQuery('<option value="' + this[0] + '">' + this[1] + '</option>'));
    });

    // set selected option
    select.find('option')[this.selectedIndex].selected = 'selected';

    // replace jsDropdown
    jQuery(dropdown).replaceWith(select.removeClass('jsDropdown'));

    // remove adjacent hidden field
    select.next('input[type=hidden]').remove();

    return select[0];
};