/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-validate',
    ['jquery', 'jquery.validate', 'wijmo.wijtooltip'],
    function($) {
        // This replaces the showLabel function
        var showLabel = function (element, message) {
            var self = this;
            if (!self.counter) {
                self.counter = 1;
            }
            var $element = $(element);

            var label = this.errorsFor( element );
            if ( label.length ) {
                // refresh error/success class
                label.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );
                label.closest('.wijmo-wijaccordion-content').prev().addClass( this.settings.errorClass );
            } else {
                // create label
                label = $("<" + this.settings.errorElement + "/>")
                    .attr({"for":  this.idOrName(element), generated: true})
                    .addClass(this.settings.errorClass)
                    .css({
                        background : 'transparent',
                        border  : '0',
                        padding : '0 4px',
                        width : '32px',
                        verticalAlign: 'middle'
                    })
                    .html('<span class="ui-icon ui-icon-alert nos-inline-icon16"></span>');

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


                var wijtooltip = label.data('wijmo-wijtooltip');
                wijtooltip._tooltipCache._$tooltip.addClass('nos-tooltip-error');

                var tooltip = wijtooltip._tooltipCache._$tooltip;

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
                    if (tooltip.is(':hidden') && !$element.is('.media')) {
                        label.data('wijtooltip-manuallyclosed', false);
                        label.wijtooltip('show');
                    } else {
                        label.data('wijtooltip-manuallyclosed', true);
                        label.wijtooltip('hide');
                    }
                });

                var accordion_header = $(element).closest('.wijmo-wijaccordion-content').prev().addClass( this.settings.errorClass ).removeClass( this.settings.validClass );

                if ($element.hasClass('media')) {
                    label.insertAfter($element.closest('.ui-inputfilethumb'));
                    $element.closest('.ui-inputfilethumb').find('.ui-inputfilethumb-thumb').addClass( this.settings.errorClass ).removeClass( this.settings.validClass );
                    $element.bind('change.validation', function() {
                        // Re-run validation to hide the label if necessary
                        $(this).valid();
                    });
                }

                accordion_header.closest('.wijmo-wijaccordion').unbind('wijaccordionselectedindexchanged').bind('wijaccordionselectedindexchanged', function(e, args) {
                    var contents = $(this).find('.wijmo-wijaccordion-content');
                    var label = contents.eq(args.newIndex).find('label[generated=true]');

                    if (label.data('wijtooltip-manuallyclosed')) {

                    } else {
                        label.wijtooltip('show');
                    }
                });

                accordion_header.closest('.wijmo-wijaccordion').bind('wijaccordionbeforeselectedindexchanged', function(e, args) {
                    var contents = $(this).find('.wijmo-wijaccordion-content');
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
                label.closest('.wijmo-wijaccordion-content').prev().addClass( this.settings.validClass ).removeClass( this.settings.errorClass );

                if ($element.hasClass('media')) {
                    $element.closest('.ui-inputfilethumb').find('.ui-inputfilethumb-thumb').addClass( this.settings.validClass ).removeClass( this.settings.errorClass );
                    $element.unbind('change.validation');
                }
                label.removeClass( this.settings.errorClass ).addClass( this.settings.validClass );
                label.remove();
            }
            this.toShow = this.toShow.add(label);
        };

        $.extend($.validator.prototype, {
            showLabel: showLabel,

            optional: function (element) {
                // Workaround for optional field marked as valid
                // https://github.com/jzaefferer/jquery-validation/issues/37
                return !$.validator.methods.required.call(this, $.trim(element.value), element); // && "dependency-mismatch";
            }
        });
    });