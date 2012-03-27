define(['jquery', 'static/cms/admin/vendor/jquery/jquery-validation/jquery.validate.min'], function($) {
    // This replaces the showLabel function
    var showLabel = function (element, message) {
        var self = this;
        if (!self.counter) {
            self.counter = 1;
        }

        var label = this.errorsFor( element );
        if ( label.length ) {
            // refresh error/success class
            label.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );
            label.closest('.ui-accordion-content').prev().addClass( this.settings.errorClass );
        } else {
            // create label
            label = $("<" + this.settings.errorElement + "/>")
                .attr({"for":  this.idOrName(element), generated: true})
                .addClass(this.settings.errorClass)
                .css({
                    background : 'transparent',
                    border  : '0',
                    padding : '0 4px'
                })
                .html('<span class="ui-icon ui-icon-alert nos-icon16"></span>');

            label.wijtooltip({
                group : 'group_' + self.counter++,
                showCallout: false,
                calloutFilled : true,
                closeBehavior: 'sticky', //'auto',
                position : {
                    my : 'right top',
                    at : 'center bottom',
                    offset : '0 0'
                },
                triggers : 'click',
                //title : 'Some errors were found',
                content : message,
                showing: function(e, ui) {
                    $(ui.element).addClass('ui-state-error');
                }
            });


            if ( !this.labelContainer.append(label).length )
                this.settings.errorPlacement
                    ? this.settings.errorPlacement(label, $(element) )
                    : label.insertAfter(element);


            var wijtooltip = label.data('wijtooltip');
            wijtooltip._tooltip.addClass('nos-tooltip-error')

            var tooltip = wijtooltip._tooltip;

            // Restyling the tooltip accordingly
            tooltip.find('.wijmo-wijtooltip-close').click(function() {
                label.data('wijtooltip-manuallyclosed', true);
            }).removeClass('wijmo-wijtooltip-close').css({
                background: 'none',
                border: 'none',
                display: 'block',
                height: '16px',
                position: 'absolute',
                right: '3px',
                top: '3px',
                width: '16px'
            }).parent().removeClass('ui-state-default').addClass('ui-state-error');
            tooltip.find('.wijmo-wijtooltip-container').addClass('ui-state-error ui-corner-all');

            label.click(function() {
                if (tooltip.is(':hidden')) {
                    label.data('wijtooltip-manuallyclosed', false);
                    label.wijtooltip('show');
                } else {
                    label.data('wijtooltip-manuallyclosed', true);
                    label.wijtooltip('hide');
                }
            });

            var accordion_header = $(element).closest('.ui-accordion-content').prev().addClass( this.settings.errorClass ).removeClass( this.settings.validClass );

            accordion_header.closest('.ui-accordion').unbind('wijaccordionselectedindexchanged').bind('wijaccordionselectedindexchanged', function(e, args) {
                var contents = $(this).find('.ui-accordion-content');
                var label = contents.eq(args.newIndex).find('label[generated=true]');
                log(label.data('wijtooltip-manuallyclosed'));

                if (label.data('wijtooltip-manuallyclosed')) {

                } else {
                    label.wijtooltip('show');
                }
            });

            accordion_header.closest('.ui-accordion').bind('wijaccordionbeforeselectedindexchanged', function(e, args) {
                var contents = $(this).find('.ui-accordion-content');
                contents.eq(args.prevIndex).find('label[generated=true]').wijtooltip('hide');
            });

            if (label.is(':visible')) {
                label.wijtooltip('show');
            } else {
                label.wijtooltip('hide');
            }
        }

        if ( !message && this.settings.success ) {
            label.wijtooltip('hide');
            label.wijtooltip('destroy');
            label.closest('.ui-accordion-content').prev().addClass( this.settings.validClass ).removeClass( this.settings.errorClass );
            label.removeClass( this.settings.errorClass ).addClass( this.settings.validClass );
            label.remove();
        }
        this.toShow = this.toShow.add(label);
    }

    $.extend($.validator.prototype, {
        showLabel: showLabel,

        optional: function (element) {
            // Workaround for optional field marked as valid
            // https://github.com/jzaefferer/jquery-validation/issues/37
            return !$.validator.methods.required.call(this, $.trim(element.value), element); // && "dependency-mismatch";
        }
    });
    return $;
});