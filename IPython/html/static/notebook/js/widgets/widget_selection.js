//----------------------------------------------------------------------------
//  Copyright (C) 2013 The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// SelectionWidget
//============================================================================

/**
 * @module IPython
 * @namespace IPython
 **/

define(["notebook/js/widgets/widget"], function(WidgetManager){

    var DropdownView = IPython.DOMWidgetView.extend({
        render : function(){
            // Called when view is rendered.
            this.$el
                .addClass('widget-hbox-single');
            this.$label = $('<div />')
                .appendTo(this.$el)
                .addClass('widget-hlabel')
                .hide();
            this.$buttongroup = $('<div />')
                .addClass('widget_item')
                .addClass('btn-group')
                .appendTo(this.$el);
            this.$el_to_style = this.$buttongroup; // Set default element to style
            this.$droplabel = $('<button />')
                .addClass('btn')
                .addClass('widget-combo-btn')
                .text(' ')
                .appendTo(this.$buttongroup);
            this.$dropbutton = $('<button />')
                .addClass('btn')
                .addClass('dropdown-toggle')
                .addClass('widget-combo-carrot-btn')
                .attr('data-toggle', 'dropdown')
                .append($('<span />').addClass("caret"))
                .appendTo(this.$buttongroup);
            this.$droplist = $('<ul />')
                .addClass('dropdown-menu')
                .appendTo(this.$buttongroup);
            
            // Set defaults.
            this.update();
        },
        
        update : function(options){
            // Update the contents of this view
            //
            // Called when the model is changed.  The model may have been 
            // changed by another view or by a state update from the back-end.

            if (options === undefined || options.updated_view != this) {
                var selected_item_text = this.model.get('_value');
                if (selected_item_text.length === 0) {
                    this.$droplabel.text(' ');
                } else {
                    this.$droplabel.text(selected_item_text);
                }
                
                var items = this.model.get('labels');
                var $replace_droplist = $('<ul />')
                    .addClass('dropdown-menu');
                var that = this;
                _.each(items, function(item, i) {
                    var item_button = $('<a href="#"/>')
                        .text(item)
                        .on('click', $.proxy(that.handle_click, that));
                    $replace_droplist.append($('<li />').append(item_button));
                });

                this.$droplist.replaceWith($replace_droplist);
                this.$droplist.remove();
                this.$droplist = $replace_droplist;
                
                if (this.model.get('disabled')) {
                    this.$buttongroup.attr('disabled','disabled');
                    this.$droplabel.attr('disabled','disabled');
                    this.$dropbutton.attr('disabled','disabled');
                    this.$droplist.attr('disabled','disabled');
                } else {
                    this.$buttongroup.removeAttr('disabled');
                    this.$droplabel.removeAttr('disabled');
                    this.$dropbutton.removeAttr('disabled');
                    this.$droplist.removeAttr('disabled');
                }

                var description = this.model.get('description');
                if (description.length === 0) {
                    this.$label.hide();
                } else {
                    this.$label.text(description);
                    this.$label.show();
                }
            }
            return DropdownView.__super__.update.apply(this);
        },

        handle_click: function (e) {
            // Handle when a value is clicked.
            
            // Calling model.set will trigger all of the other views of the 
            // model to update.
            this.model.set('_value', $(e.target).text(), {updated_view: this});
            this.touch();
        },
        
    });
    WidgetManager.register_widget_view('DropdownView', DropdownView);


    var RadioButtonsView = IPython.DOMWidgetView.extend({    
        render : function(){
            // Called when view is rendered.
            this.$el
                .addClass('widget-hbox');
            this.$label = $('<div />')
                .appendTo(this.$el)
                .addClass('widget-hlabel')
                .hide();
            this.$container = $('<div />')
                .appendTo(this.$el)
                .addClass('widget-container')
                .addClass('vbox');
            this.$el_to_style = this.$container; // Set default element to style
            this.update();
        },
        
        update : function(options){
            // Update the contents of this view
            //
            // Called when the model is changed.  The model may have been 
            // changed by another view or by a state update from the back-end.
            if (options === undefined || options.updated_view != this) {
                // Add missing items to the DOM.
                var items = this.model.get('labels');
                var disabled = this.model.get('disabled');
                var that = this;
                _.each(items, function(item, index) {
                    var item_query = ' :input[value="' + item + '"]';
                    if (that.$el.find(item_query).length === 0) {
                        var $label = $('<label />')
                            .addClass('radio')
                            .text(item)
                            .appendTo(that.$container);
                        
                        $('<input />')
                            .attr('type', 'radio')
                            .addClass(that.model)
                            .val(item)
                            .prependTo($label)
                            .on('click', $.proxy(that.handle_click, that));
                    }
                    
                    var $item_element = that.$container.find(item_query);
                    if (that.model.get('_value') == item) {
                        $item_element.prop('checked', true);
                    } else {
                        $item_element.prop('checked', false);
                    }
                    $item_element.prop('disabled', disabled);
                });
                
                // Remove items that no longer exist.
                this.$container.find('input').each(function(i, obj) {
                    var value = $(obj).val();
                    var found = false;
                    _.each(items, function(item, index) {
                        if (item == value) {
                            found = true;
                            return false;
                        }
                    });
                    
                    if (!found) {
                        $(obj).parent().remove();
                    }
                });

                var description = this.model.get('description');
                if (description.length === 0) {
                    this.$label.hide();
                } else {
                    this.$label.text(description);
                    this.$label.show();
                }
            }
            return RadioButtonsView.__super__.update.apply(this);
        },

        handle_click: function (e) {
            // Handle when a value is clicked.
            
            // Calling model.set will trigger all of the other views of the 
            // model to update.
            this.model.set('_value', $(e.target).val(), {updated_view: this});
            this.touch();
        },
    });
    WidgetManager.register_widget_view('RadioButtonsView', RadioButtonsView);


    var ToggleButtonsView = IPython.DOMWidgetView.extend({    
        render : function(){
            // Called when view is rendered.
            this.$el
                .addClass('widget-hbox-single');
            this.$label = $('<div />')
                .appendTo(this.$el)
                .addClass('widget-hlabel')
                .hide();
            this.$buttongroup = $('<div />')
                .addClass('btn-group')
                .attr('data-toggle', 'buttons-radio')
                .appendTo(this.$el);
            this.$el_to_style = this.$buttongroup; // Set default element to style
            this.update();
        },
        
        update : function(options){
            // Update the contents of this view
            //
            // Called when the model is changed.  The model may have been 
            // changed by another view or by a state update from the back-end.
            if (options === undefined || options.updated_view != this) {
                // Add missing items to the DOM.
                var items = this.model.get('labels');
                var disabled = this.model.get('disabled');
                var that = this;
                _.each(items, function(item, index) {
                   var item_query = ' :contains("' + item + '")';
                    if (that.$buttongroup.find(item_query).length === 0) {
                        $('<button />')
                            .attr('type', 'button')
                            .addClass('btn')
                            .text(item)
                            .appendTo(that.$buttongroup)
                            .on('click', $.proxy(that.handle_click, that));
                    }
                    
                    var $item_element = that.$buttongroup.find(item_query);
                    if (that.model.get('_value') == item) {
                        $item_element.addClass('active');
                    } else {
                        $item_element.removeClass('active');
                    }
                    $item_element.prop('disabled', disabled); 
                });
                
                // Remove items that no longer exist.
                this.$buttongroup.find('button').each(function(i, obj) {
                    var value = $(obj).text();
                    var found = false;
                    _.each(items, function(item, index) {
                        if (item == value) {
                            found = true;
                            return false;
                        }
                    });

                    if (!found) {
                        $(obj).remove();
                    }
                });

                var description = this.model.get('description');
                if (description.length === 0) {
                    this.$label.hide();
                } else {
                    this.$label.text(description);
                    this.$label.show();
                }
            }
            return ToggleButtonsView.__super__.update.apply(this);
        },

        handle_click: function (e) {
            // Handle when a value is clicked.
            
            // Calling model.set will trigger all of the other views of the 
            // model to update.
            this.model.set('_value', $(e.target).text(), {updated_view: this});
            this.touch();
        },    
    });
    WidgetManager.register_widget_view('ToggleButtonsView', ToggleButtonsView);


    var SelectView = IPython.DOMWidgetView.extend({    
        render : function(){
            // Called when view is rendered.
            this.$el
                .addClass('widget-hbox');
            this.$label = $('<div />')
                .appendTo(this.$el)
                .addClass('widget-hlabel')
                .hide();
            this.$listbox = $('<select />')
                .addClass('widget-listbox')
                .attr('size', 6)
                .appendTo(this.$el);
            this.$el_to_style = this.$listbox; // Set default element to style
            this.update();
        },
        
        update : function(options){
            // Update the contents of this view
            //
            // Called when the model is changed.  The model may have been 
            // changed by another view or by a state update from the back-end.
            if (options === undefined || options.updated_view != this) {
                // Add missing items to the DOM.
                var items = this.model.get('labels');
                var that = this;
                _.each(items, function(item, index) {
                   var item_query = ' :contains("' + item + '")';
                    if (that.$listbox.find(item_query).length === 0) {
                        $('<option />')
                            .text(item)
                            .attr('_value', item)
                            .appendTo(that.$listbox)
                            .on('click', $.proxy(that.handle_click, that));
                    } 
                });

                // Select the correct element
                this.$listbox.val(this.model.get('_value'));
                
                // Disable listbox if needed
                var disabled = this.model.get('disabled');
                this.$listbox.prop('disabled', disabled);

                // Remove items that no longer exist.
                this.$listbox.find('option').each(function(i, obj) {
                    var value = $(obj).text();
                    var found = false;
                    _.each(items, function(item, index) {
                        if (item == value) {
                            found = true;
                            return false;
                        }
                    });
                    
                    if (!found) {
                        $(obj).remove();
                    }
                });

                var description = this.model.get('description');
                if (description.length === 0) {
                    this.$label.hide();
                } else {
                    this.$label.text(description);
                    this.$label.show();
                }
            }
            return SelectView.__super__.update.apply(this);
        },

        handle_click: function (e) {
            // Handle when a value is clicked.
            
            // Calling model.set will trigger all of the other views of the 
            // model to update.
            this.model.set('_value', $(e.target).text(), {updated_view: this});
            this.touch();
        },    
    });
    WidgetManager.register_widget_view('SelectView', SelectView);
});
