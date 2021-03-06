// Copyright (c) Microsoft Research 2016
// License: MIT. See LICENSE
/// <reference path="..\..\Scripts\typings\jquery\jquery.d.ts"/>
/// <reference path="..\..\Scripts\typings\jqueryui\jqueryui.d.ts"/>

(function ($) {
    $.widget("BMA.resultswindowviewer", {
        options: {
            isResizable: false,
            content: $(),
            header: "",
            icon: "",
            effects: { effect: 'size', easing: 'easeInExpo', duration: 200, complete: function () { } },
            tabid: "",
            onresize: undefined,
            paddingOn: true,
            iconOn: true,
        },

        reseticon: function () {
            var that = this;
            var options = this.options;
            this.buttondiv.empty();
            if (that.options.iconOn) {
                var url = "";
                if (this.options.icon === "max")
                    url = "../../images/maximize.png";
                else
                    if (this.options.icon === "min")
                        url = "../../images/minimize.png";
                    else url = this.options.icon;

                this.button = $('<img src=' + url + '>').addClass('expand-window-icon');
                this.button.appendTo(this.buttondiv);
                this.button.bind("click", function () {
                    if (options.icon === "max")
                        window.Commands.Execute("Expand", that.options.tabid);
                    if (options.icon === "min")
                        window.Commands.Execute("Collapse", that.options.tabid);
                });
            }
        },

        refresh: function () {
            var that = this;
            var options = this.options;
            this.content.detach();
            if (options.content !== undefined) {
                this.content = options.content.appendTo(that.element); 
            }
            
        },


        _create: function () {
            var that = this;
            var options = this.options;
            if(!options.paddingOn) this.element.addClass("no-frames");

            if (options.isResizable) {
                this.element.resizable({
                    minWidth: 800,
                    minHeight: 600,
                    resize: function (event, ui) {
                        if (that.options.onresize !== undefined) {
                            that.options.onresize();
                        }
                    }
                });
                this.element.width(800);
                this.element.height(600);
                this.element.trigger("resize");
            } else {
                if (this.element.hasClass("ui-resizable")) {
                    this.element.resizable("destroy");
                    this.element.css("width", '');
                    this.element.css("height", '');
                }
            }

            this.header = $('<div></div>')
                .addClass('analysis-title')
                .appendTo(this.element);
            if (!options.paddingOn) this.header.addClass("no-frames-title");

            $('<span></span>')
                .text(options.header)
                .appendTo(this.header);
            this.buttondiv = $('<div></div>').addClass("expand-collapse-bttn").appendTo(that.header);
            //this.icon = $('<div></div>').appendTo(this.header);
            this.content = $('<div></div>').appendTo(this.element);
            this.reseticon();
            this.refresh();
        },

        toggle: function () { 
            this.element.toggle(this.options.effects);
        },

        getbutton: function () {
            return this.button;
        },

        _destroy: function () {
            this.element.empty();
        },

        _setOption: function (key, value) {
            var that = this;
            switch (key) {
                case "header":
                    this.header.children("span").text(value);
                    break;
                case "content":
                    if (this.options.content !== value) {
                        this.options.content = value;
                        this.refresh();
                    }
                    break;
                case "icon": 
                    this.options.icon = value;
                    this.reseticon();
                    break;
                case "isResizable":
                    if (this.options.isResizable !== value) {
                        if (value) {
                            this.element.resizable({
                                minWidth: 800,
                                minHeight: 600,
                                resize: function (event, ui) {
                                    if (that.options.onresize !== undefined) {
                                        that.options.onresize();
                                    }
                                }
                            });
                            this.element.width(800);
                            this.element.height(600);
                            this.element.trigger("resize");
                        } else {
                            this.element.resizable("destroy");
                            this.element.css("width", '');
                            this.element.css("height", '');
                        }
                    }
                    break;
                case "paddingOn":
                    if (this.options.paddingOn !== value) {
                        value ? this.element.removeClass("no-frames") : this.element.addClass("no-frames");
                        value ? this.header.removeClass("no-frames-title") : this.header.addClass("no-frames-title");
                    }
                    break;
            }
            this._super(key, value);
        }
    });
} (jQuery));

interface JQuery {
    resultswindowviewer (): JQuery;
    resultswindowviewer(settings: Object): JQuery;
    resultswindowviewer(fun: string): any;
    resultswindowviewer(optionLiteral: string, optionName: string): any;
    resultswindowviewer(optionLiteral: string, optionName: string, optionValue: any): JQuery;
} 
