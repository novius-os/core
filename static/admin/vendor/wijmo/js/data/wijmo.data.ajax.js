/*
 *
 * Wijmo Library 3.20141.34
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Licensed under the Wijmo Commercial License. Also available under the GNU GPL Version 3 license.
 * licensing@wijmo.com
 * http://wijmo.com/widgets/license/
 *
 */
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /// <reference path="src/util.ts"/>
    /// <reference path="src/remoteDataView.ts"/>
    /*globals jQuery, Globalize, wijmo */
    /*
    * Depends:
    *  wijmo.data.js
    *  globalize.js
    *  jquery.js
    *
    */
    (function (data) {
        var AjaxDataView = (function (_super) {
            __extends(AjaxDataView, _super);
            function AjaxDataView(url, options) {
                        _super.call(this);
                this.url = url;
                this.options = options;
                this.isRemote = true;
                if(!url) {
                    data.errors.noUrl();
                }
                this._construct(options);
            }
            AjaxDataView.prototype._construct = function (options) {
                options = $.extend(true, {
                    ajax: {
                        data: {
                        },
                        timeout: 60 * 1000
                    },
                    serverSettings: {
                        skip: // request
                        "$skip",
                        take: "$top",
                        results: // response
                        "results",
                        totalItemCount: "totalItemCount"
                    }
                }, options);
                _super.prototype._construct.call(this, options);
            };
            AjaxDataView.prototype._remoteRefresh = function () {
                var _this = this;
                var deferred = $.Deferred(), options = this.options, settings = derive(this.options.ajax), format = options.serverSettings;
                settings.data = settings.data && derive(settings.data) || {
                };
                if(format && !this.options.localPaging) {
                    if(format.skip && this._shape._skip > 0) {
                        data.util.setProperty(settings.data, format.skip, this._shape._skip);
                    }
                    if(format.take && this._shape._take > 0) {
                        data.util.setProperty(settings.data, format.take, this._shape._take);
                    }
                }
                if(this.options.onRequest) {
                    settings = this.options.onRequest(settings, this._shape.toObj()) || settings;
                }
                var xhr = $.ajax(this.url, $.extend({
                }, settings, {
                    error: function (xhr, textStatus, errorThrown) {
                        if(request.canceled) {
                            return;
                        }
                        data.util.logError("Could not load " + _this.url);
                        if(errorThrown) {
                            data.util.logError(errorThrown);
                        }
                        deferred.rejectWith(_this, arguments);
                    },
                    success: function (res) {
                        if(request.canceled) {
                            return;
                        }
                        var result;
                        if(data.util.isString(res)) {
                            res = tryParseAsJson(res);
                        }
                        if(_this.options.onResponse) {
                            result = _this.options.onResponse(res);
                        } else if($.isArray(res)) {
                            result = {
                                results: res
                            };
                        } else if(format) {
                            result = {
                                results: data.util.getProperty(res, format.results),
                                totalItemCount: data.util.getProperty(res, format.totalItemCount)
                            };
                            if(data.util.isString(result.totalItemCount)) {
                                result.totalItemCount = parseInt(result.totalItemCount, 10);
                            }
                        }
                        if(!result.results) {
                            data.errors.ajax_arrayResponseExpected(res);
                        }
                        data.util.convertDateProperties(result.results);
                        _this.sourceArray = result.results;
                        if(!options.localPaging && data.util.isNumeric(result.totalItemCount)) {
                            _this._totalItemCount(result.totalItemCount);
                        }
                        _this._localRefresh().then(deferred.resolve);
                    },
                    complete: function () {
                        _this._currentRequest = null;
                    }
                }));
                var request = this._currentRequest = {
                    xhr: xhr,
                    canceled: false
                };
                return deferred.promise();
            };
            AjaxDataView.prototype.cancelRefresh = function () {
                if(this._currentRequest) {
                    this._currentRequest.canceled = true;
                    if(this.options.ajax.dataType !== "jsonp") {
                        this._currentRequest.xhr.abort();
                    }
                    this._currentRequest = null;
                }
            };
            return AjaxDataView;
        })(data.RemoteDataView);
        data.AjaxDataView = AjaxDataView;        
        // OData
        var ODataView = (function (_super) {
            __extends(ODataView, _super);
            function ODataView() {
                _super.apply(this, arguments);

            }
            ODataView.prototype._construct = function (options) {
                options = $.extend(true, {
                    ajax: {
                        jsonp: "$callback",
                        data: {
                            $format: "json",
                            $inlinecount: "allpages"
                        }
                    },
                    onRequest: function (settings, shape) {
                        if(typeof shape.filter == "object" && shape.filter != null) {
                            settings.data.$filter = ODataView._filterExpr(shape.filter);
                        }
                        if($.isArray(shape.sort)) {
                            settings.data.$orderby = $.map(shape.sort, function (sd) {
                                return sd.property + (sd.asc ? "" : " desc");
                            }).join(", ");
                        }
                        return settings;
                    },
                    onResponse: function (res) {
                        var result;
                        if(res.d) {
                            res = res.d;
                            if($.isArray(res)) {
                                result = {
                                    results: res
                                };
                            } else {
                                result = {
                                    results: res.results
                                };
                                var totalCount = parseInt(res.__count, 10);
                                if(data.util.isNumeric(totalCount) && !options.localPaging) {
                                    result.totalItemCount = totalCount;
                                }
                            }
                        } else if(res.value) {
                            result = {
                                results: res.value
                            };
                            var totalCount = parseInt(res["odata.count"], 10);
                            if(data.util.isNumeric(totalCount) && !options.localPaging) {
                                result.totalItemCount = totalCount;
                            }
                        }
                        return result;
                    }
                }, options);
                _super.prototype._construct.call(this, options);
            };
            ODataView._filterOperators = {
                "<": "lt",
                "<=": "le",
                ">": "gt",
                ">=": "ge",
                "==": "eq",
                "!=": "ne",
                less: "lt",
                lessorequal: "le",
                greater: "gt",
                greaterorequal: "ge",
                equals: "eq",
                notequal: "ne",
                contains: true,
                notcontains: true,
                beginswith: true,
                endswith: true
            };
            ODataView._filterExpr = function _filterExpr(filter) {
                if(!filter) {
                    return "";
                }
                var expressions = [];
                $.each(filter, function (property, cond) {
                    expressions.push(ODataView._conditionExpr(property, cond));
                });
                return expressions.join(" and ");
            };
            ODataView._conditionExpr = function _conditionExpr(property, cond) {
                if($.isArray(cond)) {
                    var oFilter = [];
                    data.util.each(cond, function (_, cond) {
                        if(data.util.isString(cond)) {
                            return;
                        }
                        oFilter.push(ODataView._conditionExpr(property, cond));
                    });
                    return oFilter.join(cond[0]);
                } else {
                    var args = "(" + property + ", '" + cond.value + "')";
                    var op = cond.op.name.toLowerCase();
                    switch(op) {
                        case "contains":
                            return "indexof" + args + " ge 0";
                        case "notcontains":
                            return "indexof" + args + " lt 0";
                        case "beginswith":
                            return "startswith" + args + " eq true";
                        case "endswith":
                            return "endswith" + args + " eq true";
                        default:
                            op = ODataView._filterOperators[op] || op;
                            return property + " " + op + " " + (isNaN(cond.value) ? ("'" + cond.value + "'") : cond.value);
                    }
                }
            };
            return ODataView;
        })(AjaxDataView);
        data.ODataView = ODataView;        
        // util
        function derive(baseObj, newMembers) {
            var result;
            if(Object.create) {
                try  {
                    result = Object.create(baseObj);
                } catch (err) {
                    result = null;
                }
            }
            if(!result) {
                function Clazz() {
                }
                Clazz.prototype = baseObj;
                result = new Clazz();
            }
            if(newMembers) {
                $.extend(result, newMembers);
            }
            return result;
        }
        function tryParseAsJson(json) {
            try  {
                return JSON.parse(json);
            } catch (err) {
                return json;
            }
        }
        data.errors._register({
            ajax_arrayResponseExpected: "Could not parse the server response. Specify onResponse option to parse the server response. \nResponse: {0}"
        });
    })(wijmo.data || (wijmo.data = {}));
    var data = wijmo.data;
})(wijmo || (wijmo = {}));
