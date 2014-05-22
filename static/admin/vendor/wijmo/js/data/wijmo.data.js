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
/// <reference path="../../External/declarations/jquery.d.ts"/>
var wijmo;
(function (wijmo) {
    wijmo.expando = ".wijmo";
    /** @ignore */
    var WijmoError = (function () {
        function WijmoError(message) {
            this.message = message;
            this.stack = "Wijmo" + (new Error()).stack;
            this.name = "WijmoError";
        }
        return WijmoError;
    })();
    wijmo.WijmoError = WijmoError;    
    var wijerr = WijmoError;
    wijerr.prototype = new Error();
    wijerr.prototype["constructor"] = wijerr;
})(wijmo || (wijmo = {}));
var wijmo;
(function (wijmo) {
    (function (data) {
        /** @ignore */
        var Expando = (function () {
            function Expando(object) {
                this.object = object;
            }
            Expando.getFrom = function getFrom(obj, create) {
                if (typeof create === "undefined") { create = true; }
                var propertyName = wijmo.expando, ext;
                if(Object(obj) !== obj) {
                    return null;
                }
                ext = obj[propertyName];
                if(ext && ext.object !== obj) {
                    ext = null;
                }
                if(create && !(ext instanceof Expando && Object.prototype.hasOwnProperty.call(obj, propertyName))) {
                    ext = new Expando(obj);
                    try  {
                        Object.defineProperty(obj, propertyName, {
                            value: ext,
                            configurable: false,
                            enumerable: false,
                            writable: false
                        });
                    } catch (e) {
                        obj[propertyName] = ext;
                    }
                }
                return ext;
            };
            return Expando;
        })();
        data.Expando = Expando;        
    })(wijmo.data || (wijmo.data = {}));
    var data = wijmo.data;
})(wijmo || (wijmo = {}));
var wijmo;
(function (wijmo) {
    (function (data) {
        /** @ignore */
        (function (util) {
            function funcClass(ctor) {
                return function () {
                    var result = function () {
                        return ctor.prototype._call.apply(result, arguments);
                    };
                    $.extend(result, ctor.prototype);
                    ctor.apply(result, arguments);
                    return result;
                };
            }
            util.funcClass = funcClass;
        })(data.util || (data.util = {}));
        var util = data.util;
    })(wijmo.data || (wijmo.data = {}));
    var data = wijmo.data;
})(wijmo || (wijmo = {}));
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /// <reference path="./core.ts"/>
    /// <reference path="./util.ts"/>
    (function (data) {
        var $ = jQuery;
        /** @ignore */
        var SubscriberEntry = (function () {
            function SubscriberEntry(handler, context) {
                this.handler = handler;
                this.context = context;
            }
            SubscriberEntry.prototype.trigger = function (args) {
                return this.handler.apply(this.context, args);
            };
            return SubscriberEntry;
        })();
        data.SubscriberEntry = SubscriberEntry;        
        /** @ignore */
        var Subscribable = (function () {
            function Subscribable(defaultContext) {
                this.defaultContext = defaultContext;
                this._entries = [];
            }
            Subscribable.prototype.subscribe = function (handler, context) {
                if (typeof context === "undefined") { context = this.defaultContext; }
                var _this = this;
                var entry = new SubscriberEntry(handler, context);
                this._entries.push(entry);
                return {
                    dispose: function () {
                        return data.util.remove(_this._entries, entry);
                    }
                };
            };
            Subscribable.prototype.trigger = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                data.util.each(this._entries, function (_, e) {
                    return e.trigger(args);
                });
            };
            Subscribable.makeSubscribable = function makeSubscribable(obj) {
                var subscribable = new Subscribable(obj);
                obj.subscribe = $.proxy(subscribable.subscribe, subscribable);
                return subscribable;
            };
            return Subscribable;
        })();
        data.Subscribable = Subscribable;        
        function isSubscriptable(subscribable) {
            return $.isFunction(subscribable.subscribe);
        }
        data.isSubscriptable = isSubscriptable;
        /** @ignore */
        var BaseObservable = (function () {
            function BaseObservable() { }
            BaseObservable.prototype.subscribe = function (handler, context) {
                this._subscribable = this._subscribable || new Subscribable(this);
                return this._subscribable.subscribe(handler, context);
            };
            BaseObservable.prototype._trigger = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                if(this._subscribable) {
                    this._subscribable.trigger.apply(this._subscribable, arguments);
                }
            };
            return BaseObservable;
        })();
        data.BaseObservable = BaseObservable;        
        /** @ignore */
        var _ReadOnlyObservable = (function (_super) {
            __extends(_ReadOnlyObservable, _super);
            function _ReadOnlyObservable(mutable) {
                        _super.call(this);
                this.mutable = mutable;
            }
            _ReadOnlyObservable.prototype._call = function () {
                return this.mutable.value;
            };
            return _ReadOnlyObservable;
        })(BaseObservable);
        data._ReadOnlyObservable = _ReadOnlyObservable;        
        var ReadOnlyObservable = data.util.funcClass(_ReadOnlyObservable);
        /** @ignore */
        var _MutableObservable = (function (_super) {
            __extends(_MutableObservable, _super);
            function _MutableObservable(value, checkNewValue) {
                if (typeof checkNewValue === "undefined") { checkNewValue = false; }
                        _super.call(this);
                this.value = value;
                this.checkNewValue = checkNewValue;
            }
            _MutableObservable.prototype._call = function (newValue) {
                if(arguments.length > 0 && (!this.checkNewValue || newValue !== this.value)) {
                    this.value = newValue;
                    this._trigger(newValue);
                    if(this._readOnly) {
                        this._readOnly._trigger(newValue);
                    }
                }
                return this.value;
            };
            _MutableObservable.prototype.read = function () {
                this._readOnly = this._readOnly || new ReadOnlyObservable(this);
                return this._readOnly;
            };
            return _MutableObservable;
        })(BaseObservable);
        data._MutableObservable = _MutableObservable;        
        var MutableObservable = data.util.funcClass(_MutableObservable);
        /** @ignore */
        var _NumericMutableObservable = (function (_super) {
            __extends(_NumericMutableObservable, _super);
            function _NumericMutableObservable(value) {
                        _super.call(this, value, false);
                this.value = value;
            }
            _NumericMutableObservable.prototype.change = function (delta) {
                return this._call(this._call() + delta);
            };
            _NumericMutableObservable.prototype.inc = function () {
                return this.change(1);
            };
            _NumericMutableObservable.prototype.dec = function () {
                return this.change(-1);
            };
            return _NumericMutableObservable;
        })(_MutableObservable);
        data._NumericMutableObservable = _NumericMutableObservable;        
        var NumericMutableObservable = data.util.funcClass(_NumericMutableObservable);
        function observable(value) {
            if (typeof value === "undefined") { value = null; }
            return new MutableObservable(value);
        }
        data.observable = observable;
        /** @ignore */
        function numericObservable(value) {
            if (typeof value === "undefined") { value = 0; }
            return new NumericMutableObservable(value);
        }
        data.numericObservable = numericObservable;
        /** @ignore */
        function observableWithNewValueCheck(value) {
            if (typeof value === "undefined") { value = null; }
            return new MutableObservable(value, true);
        }
        data.observableWithNewValueCheck = observableWithNewValueCheck;
        function isObservable(observable) {
            return $.isFunction(observable) && isSubscriptable(observable);
        }
        data.isObservable = isObservable;
    })(wijmo.data || (wijmo.data = {}));
    var data = wijmo.data;
})(wijmo || (wijmo = {}));
var wijmo;
(function (wijmo) {
    (function (data) {
        /// <reference path="./core.ts"/>
        /// <reference path="./observable.ts"/>
        /** @ignore */
        (function (util) {
            var $ = jQuery;
            function clone(obj, deep) {
                if (typeof deep === "undefined") { deep = false; }
                if($.isArray(obj)) {
                    obj = obj.slice(0);
                } else if($.isPlainObject(obj)) {
                    obj = $.extend(!!deep, {
                    }, obj);
                }
                return obj;
            }
            util.clone = clone;
            function isString(str) {
                return typeof str === "string" || str instanceof String;
            }
            util.isString = isString;
            function isNumeric(value) {
                return typeof value === "number";
            }
            util.isNumeric = isNumeric;
            function isInternalProperty(p) {
                return p === wijmo.expando || p === $.expando;
            }
            util.isInternalProperty = isInternalProperty;
            function each(obj, fn) {
                var _this = this;
                $.each(obj, function (key, value) {
                    if(!isInternalProperty(key)) {
                        return fn.call(_this, key, value);
                    }
                });
            }
            util.each = each;
            function map(obj, fn) {
                var result = $.map(obj, fn);
                delete result[wijmo.expando];
                return result;
            }
            util.map = map;
            function toStr(obj) {
                var text;
                if(obj && $.isFunction(obj.toString) && obj.toString !== Object.prototype.toString) {
                    text = obj.toString();
                } else {
                    text = JSON.stringify(obj);
                }
                if(text != null && text.length > 2 && text[0] === '"' && text[text.length - 1] === '"') {
                    text = text.substr(1, text.length - 2);
                }
                return text;
            }
            util.toStr = toStr;
            function format(format) {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 1); _i++) {
                    args[_i] = arguments[_i + 1];
                }
                return format.replace(/{(\d+)}/g, function (m, index) {
                    return toStr(args[parseInt(index, 10)]);
                });
            }
            util.format = format;
            function every(obj, predicate) {
                var res = true;
                each(obj, function (key, value) {
                    res = value;
                    if(predicate) {
                        res = predicate.call(res, res, key);
                    }
                    if(!res) {
                        return false;
                    }
                });
                return res;
            }
            util.every = every;
            function some(obj, predicate) {
                var res = false;
                each(obj, function (key, value) {
                    res = value;
                    if(predicate) {
                        res = predicate.call(res, res, key);
                    }
                    if(res) {
                        return false;
                    }
                });
                return res;
            }
            util.some = some;
            function compare(a, b) {
                var i, len, cmp;
                if(a == null) {
                    return b == null ? 0 : -1;
                } else if(b == null) {
                    return 1;
                }
                if($.isArray(a) && $.isArray(b)) {
                    len = Math.min(a.length, b.length);
                    for(i = 0; i < len; i++) {
                        cmp = compare(a[i], b[i]);
                        if(cmp !== 0) {
                            return cmp;
                        }
                    }
                    return a.length - b.length;
                } else if(isString(a) && isString(b)) {
                    a = a.toLowerCase();
                    b = b.toLowerCase();
                    return a < b ? -1 : a > b ? 1 : 0;
                }
                cmp = a - b;
                return isNaN(cmp) ? 0 : cmp;
            }
            util.compare = compare;
            function contains(array, elem) {
                return $.inArray(elem, array) >= 0;
            }
            util.contains = contains;
            function remove(array, elem) {
                var removed = 0, i;
                for(i = 0; i < array.length; ) {
                    if(array[i] !== elem) {
                        i++;
                    } else {
                        array.splice(i, 1);
                        removed++;
                    }
                }
                return removed;
            }
            util.remove = remove;
            function pageCount(totalCount, pageSize) {
                if(totalCount == -1) {
                    return -1;
                } else if(totalCount == 0) {
                    return 0;
                } else if(!pageSize) {
                    return 1;
                } else {
                    return Math.ceil(totalCount / pageSize);
                }
            }
            util.pageCount = pageCount;
            ;
            function executeDelayed(fn, context) {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 2); _i++) {
                    args[_i] = arguments[_i + 2];
                }
                function callback() {
                    return fn.apply(context, args);
                }
                if(typeof setTimeout === typeof undefined) {
                    return callback();
                } else {
                    setTimeout(callback, 10);
                }
            }
            util.executeDelayed = executeDelayed;
            function logError(message) {
                if(typeof console == "undefined") {
                    return;
                }
                if(console.error) {
                    console.error(message);
                } else if(console.log) {
                    console.log(message);
                }
            }
            util.logError = logError;
            function getProperty(obj, property) {
                var start = 0, value = obj, key;
                while(true) {
                    var point = property.indexOf('.', start);
                    if(point >= 0) {
                        key = property.substring(start, point);
                        start = point + 1;
                    } else if(start > 0) {
                        key = property.substring(start);
                    } else {
                        key = property;
                    }
                    value = value[key];
                    if(data.isObservable(value)) {
                        value = value();
                    }
                    if(point < 0) {
                        break;
                    }
                }
                return value;
            }
            util.getProperty = getProperty;
            function setProperty(obj, property, newValue) {
                var start = 0, key;
                while(true) {
                    var point = property.indexOf('.', start);
                    if(point >= 0) {
                        key = property.substring(start, point);
                        start = point + 1;
                    } else if(start > 0) {
                        key = property.substring(start);
                    } else {
                        key = property;
                    }
                    var value = obj[key];
                    if(point >= 0) {
                        if(data.isObservable(value)) {
                            value = value();
                        }
                        obj = value;
                    } else {
                        if(data.isObservable(value)) {
                            value(newValue);
                        } else {
                            obj[key] = newValue;
                        }
                        break;
                    }
                }
            }
            util.setProperty = setProperty;
            function isClassInstance(instance) {
                return typeof instance === "object" && !$.isArray(instance) && !$.isPlainObject(instance) && instance.constructor !== (Object.prototype).constructor;
            }
            util.isClassInstance = isClassInstance;
            function convertDateProperties(entities) {
                data.util.each(entities, function (_, entity) {
                    if(!entity || typeof entity !== "object") {
                        return;
                    }
                    data.util.each(entity, function (key, value) {
                        var match;
                        if(!data.util.isString(value)) {
                            return;
                        }
                        match = /\/Date\((-?\d+)\)\//.exec(value);
                        if(!match) {
                            return;
                        }
                        entity[key] = new Date(parseInt(match[1], 10));
                    });
                });
            }
            util.convertDateProperties = convertDateProperties;
            var HashMapEntry = (function () {
                function HashMapEntry(key) {
                    this.key = key;
                }
                return HashMapEntry;
            })();
            util.HashMapEntry = HashMapEntry;            
            var HashMap = (function () {
                function HashMap() {
                    this.hash = {
                    };
                }
                HashMap.prototype.getEntry = function (key, create) {
                    if (typeof create === "undefined") { create = false; }
                    if(key === null) {
                        if(!this.nullEntry && create) {
                            this.nullEntry = new HashMapEntry(key);
                        }
                        return this.nullEntry;
                    }
                    var strKey = String(key);
                    var list = this.hash[strKey];
                    var entry;
                    if(list == null) {
                        if(!create) {
                            return null;
                        }
                        list = [];
                        this.hash[strKey] = list;
                    }
                    for(var i = 0; i < list.length; i++) {
                        if(list[i].key === key) {
                            return list[i];
                        }
                    }
                    if(create) {
                        entry = new HashMapEntry(key);
                        list.push(entry);
                    }
                    return null;
                };
                HashMap.prototype.containsKey = function (key) {
                    return !!this.getEntry(key);
                };
                HashMap.prototype.get = function (key, defaultValue) {
                    if (typeof defaultValue === "undefined") { defaultValue = null; }
                    var entry = this.getEntry(key);
                    return entry ? entry.value : defaultValue;
                };
                HashMap.prototype.put = function (key, value) {
                    this.getEntry(key, true).value = value;
                };
                return HashMap;
            })();
            util.HashMap = HashMap;            
        })(data.util || (data.util = {}));
        var util = data.util;
    })(wijmo.data || (wijmo.data = {}));
    var data = wijmo.data;
})(wijmo || (wijmo = {}));
var wijmo;
(function (wijmo) {
    /// <reference path="./util.ts"/>
    /** @ignore */
    (function (data) {
        data.errors = {
        };
        data.errors._register = function (messages) {
            data.util.each(messages, function (name, msg) {
                function create() {
                    var fmtArgs = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        fmtArgs[_i] = arguments[_i + 0];
                    }
                    var lastChar;
                    if($.isFunction(msg)) {
                        msg = msg.apply(this, arguments);
                    } else if(arguments.length > 0) {
                        fmtArgs.unshift(msg);
                        msg = data.util.format.apply(this, fmtArgs);
                    }
                    msg = $.trim(msg);
                    lastChar = msg[msg.length - 1];
                    if(lastChar !== '.' && lastChar !== '!' && lastChar !== '?') {
                        msg += '.';
                    }
                    return new wijmo.WijmoError(msg);
                }
                data.errors[name] = function () {
                    throw create.apply(this, arguments);
                };
                data.errors[name].create = create;
            });
        };
        data.errors._register({
            indexOutOfBounds: "Index is outside the bounds of the array.",
            notImplemented: "The operation is not implemented",
            unsupportedOperation: "Unsupported operation",
            unsupportedFilterOperator: "Unsupported filter operator: {0}",
            unsupportedDataSource: "Unsupported data source",
            argument: function (paramName) {
                var message = "Unexpected argument value.";
                if(paramName) {
                    message += "\nParameter name: " + paramName;
                }
                return message;
            },
            argumentNull: "Argument '{0}' is null/undefined",
            noParser: "There is no parser for type '{0}'",
            noUrl: "Url is not specified",
            cantConvert: "Value can't be converted to type '{0}': '{1}'",
            noGlobalize: "Globalize is not defined. Make sure you include globalize.js",
            itemNotInView: "Item {0} is not in the data view",
            unsupportedFilterFormat: "The filter format is not supported",
            multiPropertyKeysNotSupported: "Entities with multiple properties in the primary key are not supported. Entity type: {0}",
            keyPropertyNotFound: "Key property not found in {0} entity type"
        });
    })(wijmo.data || (wijmo.data = {}));
    var data = wijmo.data;
})(wijmo || (wijmo = {}));
var wijmo;
(function (wijmo) {
    (function (data) {
        /// <reference path="dataView.ts"/>
        /** @ignore */
        (function (filtering) {
            var $ = jQuery;
            filtering.opMap = {
                "==": "equals",
                doesnotcontain: "notcontain",
                "!=": "notequal",
                ">": "greater",
                "<": "less",
                ">=": "greaterorequal",
                "<=": "lessorequal",
                isnotempty: "notisempty",
                isnotnull: "notisnull"
            };
            function findOperator(name, throwIfNotFound) {
                if (typeof throwIfNotFound === "undefined") { throwIfNotFound = false; }
                name = name.toLowerCase();
                var op = filtering.ops[name];
                if(!op) {
                    var mappedName = filtering.opMap[name];
                    if(mappedName) {
                        op = filtering.ops[mappedName];
                    }
                }
                if(!op && throwIfNotFound) {
                    data.errors.unsupportedFilterOperator(name);
                }
                return op;
            }
            function normalizeCondition(cond) {
                var filter;
                if(!$.isPlainObject(cond)) {
                    return {
                        operator: "==",
                        op: filtering.ops.equals,
                        value: cond
                    };
                }
                var op = cond.operator || filtering.ops.equals;
                if(data.util.isString(cond.operator)) {
                    if(cond.operator.toLowerCase() === "nofilter") {
                        return null;
                    }
                    op = findOperator(cond.operator, true);
                } else if(!$.isFunction(op.apply)) {
                    data.errors.unsupportedFilterOperator(op);
                }
                return {
                    operator: cond.operator,
                    op: op,
                    value: cond.value
                };
            }
            filtering.normalizeCondition = normalizeCondition;
            function compile(filter) {
                var result = {
                    isEmpty: false,
                    original: filter,
                    func: null,
                    normalized: null
                };
                if($.isFunction(filter)) {
                    result.func = filter;
                } else if($.isArray(filter)) {
                    data.errors.unsupportedFilterFormat(filter);
                } else if(filter) {
                    result.normalized = {
                    };
                    var hasConditions = false;
                    data.util.each(filter, function (prop, cond) {
                        if($.isArray(cond)) {
                            data.errors.unsupportedFilterFormat();
                        }
                        cond = normalizeCondition(cond);
                        if(cond) {
                            result.normalized[prop] = cond;
                            hasConditions = true;
                        }
                    });
                    if(!hasConditions) {
                        result.normalized = null;
                    } else {
                        result.func = function (x) {
                            return data.util.every(result.normalized, function (cond, prop) {
                                var propValue = data.util.getProperty(x, prop);
                                return cond.op.apply(propValue, cond.value);
                            });
                        };
                    }
                }
                if(!result.normalized && !result.func) {
                    result.isEmpty = true;
                    result.func = function (x) {
                        return true;
                    };
                }
                return result;
            }
            filtering.compile = compile;
            //#region operators
            filtering.ops = (function () {
                var ops = {
                }, types = {
                    str: [
                        "string"
                    ],
                    prim: [
                        "string", 
                        "number", 
                        "datetime", 
                        "currency", 
                        "boolean"
                    ]
                };
                function op(name, displayName, arity, types, apply) {
                    return ops[name.toLowerCase()] = {
                        name: name,
                        displayName: displayName,
                        arity: arity,
                        applicableTo: types,
                        apply: apply
                    };
                }
                function preprocessOperand(value) {
                    if(value instanceof Date) {
                        value = value.getTime();
                    }
                    if(data.util.isString(value)) {
                        value = value.toLowerCase();
                    }
                    return value;
                }
                function bin(name, displayName, types, apply) {
                    op(name, displayName, 2, types, function (left, right) {
                        return apply(preprocessOperand(left), preprocessOperand(right));
                    });
                }
                function unary(name, displayName, types, apply) {
                    op(name, displayName, 1, types, apply);
                }
                function binprim(name, displayName, apply) {
                    bin(name, displayName, types.prim, apply);
                }
                function binstr(name, displayName, apply) {
                    bin(name, displayName, types.str, apply);
                }
                // Primitive binary operators
                binprim("Equals", "Equals", function (l, r) {
                    return l == r;
                });
                binprim("NotEqual", "Not equal", function (l, r) {
                    return l != r;
                });
                binprim("Greater", "Greater than", function (l, r) {
                    return l > r;
                });
                binprim("Less", "Less than", function (l, r) {
                    return l < r;
                });
                binprim("GreaterOrEqual", "Greater or equal", function (l, r) {
                    return l >= r;
                });
                binprim("LessOrEqual", "Less or equal", function (l, r) {
                    return l <= r;
                });
                // String operators
                binstr("Contains", "Contains", function (left, right) {
                    return left == right || left && left.indexOf && left.indexOf(right) >= 0;
                });
                binstr("NotContain", "Does not contain", function (left, right) {
                    return left != right && (!left || !left.indexOf || left.indexOf(right) < 0);
                });
                binstr("BeginsWith", "Begins with", function (left, right) {
                    return left == right || left && left.indexOf && left.indexOf(right) == 0;
                });
                binstr("EndsWith", "Ends with", function (left, right) {
                    var idx;
                    if(!data.util.isString(left) || !data.util.isString(right)) {
                        return false;
                    }
                    idx = left.lastIndexOf(right);
                    return idx >= 0 && left.length - idx === right.length;
                });
                // Unary operators
                unary("IsEmpty", "Is empty", types.str, function (x) {
                    return !x && x !== 0 && x !== false;
                })// null, undefined, or empty string
                ;
                unary("NotIsEmpty", "Is not empty", types.str, function (x) {
                    return !!x || x === 0 || x === false;
                });
                unary("IsNull", "Is null", types.prim, function (x) {
                    return x == null;
                });
                unary("NotIsNull", "Is not null", types.prim, function (x) {
                    return x != null;
                });
                return ops;
            })();
            //#endregion operators
                    })(data.filtering || (data.filtering = {}));
        var filtering = data.filtering;
    })(wijmo.data || (wijmo.data = {}));
    var data = wijmo.data;
})(wijmo || (wijmo = {}));
var wijmo;
(function (wijmo) {
    (function (data) {
        /// <reference path="dataView.ts"/>
        /** @ignore */
        (function (sorting) {
            function normalize(sort) {
                var result = [];
                sort = data.util.isString(sort) ? sort.split(/,\s*/) : !$.isArray(sort) ? [
                    sort
                ] : sort.slice(0);
                sort = $.isArray(sort) ? sort.slice(0) : [
                    sort
                ];
                data.util.each(sort, function (_, prop) {
                    var asc = true, i;
                    if(prop == null) {
                        return;
                    }
                    if(!data.util.isString(prop)) {
                        if(prop.property != null) {
                            result.push(prop);
                        }
                        return;
                    }
                    if(prop[0] === "-") {
                        asc = false;
                        prop = prop.substr(1);
                    } else {
                        var match = /\s(asc|desc)\s*$/.exec(prop);
                        if(match) {
                            prop = prop.substr(0, match.index);
                            asc = !(match[1] === "desc");
                        }
                    }
                    result.push({
                        property: prop,
                        asc: asc
                    });
                });
                return result.length > 0 ? result : null;
            }
            function compile(sort, compareTo) {
                if (typeof compareTo === "undefined") { compareTo = data.util.compare; }
                var normalized = normalize(sort);
                var result = {
                    isEmpty: true,
                    original: sort,
                    propertyCompareTo: compareTo,
                    compare: null,
                    normalized: normalized
                };
                if(normalized != null) {
                    result.isEmpty = false;
                    result.compare = function (a, b) {
                        var i = 0, cmp, descr;
                        for(i = 0; i < normalized.length; i++) {
                            descr = normalized[i];
                            cmp = compareTo(data.util.getProperty(a, descr.property), data.util.getProperty(b, descr.property));
                            if(cmp !== 0) {
                                if(!descr.asc) {
                                    cmp = -cmp;
                                }
                                return cmp;
                            }
                        }
                        return 0;
                    };
                }
                return result;
            }
            sorting.compile = compile;
        })(data.sorting || (data.sorting = {}));
        var sorting = data.sorting;
    })(wijmo.data || (wijmo.data = {}));
    var data = wijmo.data;
})(wijmo || (wijmo = {}));
var wijmo;
(function (wijmo) {
    /// <reference path="./core.ts"/>
    /// <reference path="./filtering.ts"/>
    /// <reference path="./sorting.ts"/>
    /// <reference path="./arrayDataView.ts"/>
    (function (data) {
        var $ = jQuery;
        var dataViewFactories = [];
        /** Registers a new IDataView provider.
        * @param {IDataViewFactory} factory A function that creates a IDataView for a data source if possible. Otherwise returns null.
        * @returns An IDisposable that can be used to remove the registration.
        * @remarks
        * Use this method to provide your own IDataView implementation for a specific data source. See wijmo.data.breeze.ts for an example.
        */
        function registerDataViewFactory(factory) {
            if(!$.isFunction(factory)) {
                data.errors.argument("factory");
            }
            dataViewFactories.push(factory);
            return {
                dispose: function () {
                    data.util.remove(dataViewFactories, factory);
                }
            };
        }
        data.registerDataViewFactory = registerDataViewFactory;
        registerDataViewFactory(function (view) {
            return isDataView(view) && view;
        });
        registerDataViewFactory(function (array) {
            return $.isArray(array) && new data.ArrayDataView(array);
        });
        //#endregion Data view factories
        /** Creates an IDataView for a data source.
        * @param src A data source, can be anything that is supported by the registered IDataView providers
        * @returns An IDataView instance for the data source.
        */
        function asDataView(src) {
            if(isDataView(src)) {
                return src;
            }
            var view = data.util.some(dataViewFactories, function (p) {
                return p(src);
            });
            return view || data.errors.unsupportedDataSource();
        }
        data.asDataView = asDataView;
        /** Returns true if the view parameter is a IDataView */
        function isDataView(view) {
            return view && $.isFunction(view.count) && $.isFunction(view.item) && $.isFunction(view.getProperty);
        }
        data.isDataView = isDataView;
    })(wijmo.data || (wijmo.data = {}));
    var data = wijmo.data;
})(wijmo || (wijmo = {}));
var wijmo;
(function (wijmo) {
    /// <reference path="./core.ts"/>
    /// <reference path="./arrayDataView.ts"/>
    /** @ignore */
    (function (data) {
        var $ = jQuery;
        var CurrencyManager = (function () {
            function CurrencyManager(array) {
                this.array = array;
                this.currentItem = data.observableWithNewValueCheck(null);
                this.currentPosition = data.observableWithNewValueCheck(-1);
                var syncing = false;
function synced(fn) {
                    return function () {
                        if(syncing) {
                            return;
                        }
                        syncing = true;
                        try  {
                            fn.apply(this, arguments);
                        }finally {
                            syncing = false;
                        }
                    };
                }
                this.currentItem.subscribe(synced(function (value) {
                    this.currentPosition(value == null ? -1 : $.inArray(value, this.array));
                }), this);
                this.currentPosition.subscribe(synced(function (value) {
                    if(!data.util.isNumeric(value)) {
                        data.errors.argument("value");
                    }
                    if(value < -1 || value >= this.array.length) {
                        data.errors.indexOutOfBounds();
                    }
                    this.currentItem(value < 0 ? null : this.array[value]);
                }), this);
            }
            CurrencyManager.prototype.update = function () {
                var item = this.currentItem(), pos = this.currentPosition(), newIndex = $.inArray(item, this.array);
                if(newIndex < 0 && item == null && this._recentlyRemovedItem != null) {
                    newIndex = $.inArray(this._recentlyRemovedItem, this.array);
                }
                if(newIndex >= 0) {
                    if(item) {
                        this._recentlyRemovedItem = item;
                    }
                    this.currentPosition(newIndex);
                } else if(pos >= 0 && pos < this.array.length) {
                    this.currentItem(this.array[pos]);
                } else if(pos >= this.array.length && this.array.length > 0) {
                    pos = this.array.length - 1;
                    this.currentPosition(pos);
                    this.currentItem(this.array[pos]);
                } else {
                    this.currentPosition(-1);
                    this.currentItem(null);
                }
            };
            CurrencyManager.prototype.updateDelayed = function () {
                data.util.executeDelayed(this.update, this);
            };
            return CurrencyManager;
        })();
        data.CurrencyManager = CurrencyManager;        
    })(wijmo.data || (wijmo.data = {}));
    var data = wijmo.data;
})(wijmo || (wijmo = {}));
var wijmo;
(function (wijmo) {
    (function (data) {
        var $ = jQuery;
        /** @ignore */
        var Shape = (function () {
            function Shape(onChanged) {
                this.onChanged = onChanged;
                this.filter = data.observable();
                this._compiledFilter = data.filtering.compile(null);
                this.sort = data.observable();
                this._compiledSort = data.sorting.compile(null);
                this.pageIndex = data.observable(0);
                this.pageSize = data.observable(0);
                this._skip = 0;
                this._take = -1;
                this.filter.subscribe(function (newValue) {
                    this.onFilterChanged(newValue);
                    onChanged();
                }, this);
                this.sort.subscribe(function () {
                    this._compiledSort = data.sorting.compile(this.sort());
                    onChanged();
                }, this);
function updatePaging() {
                    if(this.pageSize() > 0 && this.pageIndex() >= 0) {
                        this._skip = this.pageSize() * this.pageIndex();
                        this._take = this.pageSize();
                    } else {
                        this._skip = 0;
                        this._take = -1;
                    }
                    onChanged(true);
                }
                this.pageIndex.subscribe(updatePaging, this);
                this.pageSize.subscribe(updatePaging, this);
            }
            Shape.prototype.onFilterChanged = function (newValue) {
                this._compiledFilter = data.filtering.compile(newValue);
            };
            Shape.prototype.setFilter = function (filter) {
                this.filter(filter);
            };
            Shape.prototype.update = function (shape) {
                if("filter" in shape) {
                    this.setFilter(shape.filter);
                }
                if("sort" in shape) {
                    this.sort(shape.sort);
                }
                if("pageSize" in shape) {
                    this.pageSize(shape.pageSize);
                }
                if("pageIndex" in shape) {
                    this.pageIndex(shape.pageIndex);
                }
            };
            Shape.prototype.apply = function (array, applyPaging, destination) {
                if (typeof applyPaging === "undefined") { applyPaging = true; }
                if (typeof destination === "undefined") { destination = null; }
                var i;
                // filter
                if(!this._compiledFilter.isEmpty) {
                    if(destination) {
                        destination.length = 0;
                    } else {
                        destination = [];
                    }
                    for(i = 0; i < array.length; i++) {
                        var item = array[i];
                        if(this._compiledFilter.func(item)) {
                            destination.push(item);
                        }
                    }
                } else {
                    // just clone it
                    if(!destination) {
                        destination = array.slice(0);
                    } else {
                        destination.length = array.length;
                        for(i = 0; i < array.length; i++) {
                            destination[i] = array[i];
                        }
                    }
                }
                // sort
                if(!this._compiledSort.isEmpty) {
                    this._stableSort(destination, this._compiledSort.compare);
                }
                // page
                var totalCount = destination.length;
                if(applyPaging && this._take > 0) {
                    if(this._skip > 0) {
                        destination.splice(0, Math.min(this._skip, destination.length));
                    }
                    if(this._take < destination.length) {
                        destination.length = this._take;
                    }
                }
                return {
                    results: destination,
                    totalCount: totalCount
                };
            };
            Shape.prototype._stableSort = function (arr, fn) {
                var isChrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase()) && /Google Inc/.test(navigator.vendor);
                if(fn && isChrome) {
                    arr.forEach(function (ele, index) {
                        arr[index] = {
                            index: index,
                            value: ele
                        };
                    });
                    arr.sort(function (c, d) {
                        var result = fn(c.value, d.value);
                        if(result === 0) {
                            return c.index - d.index;
                        }
                        return result;
                    });
                    arr.forEach(function (ele, index) {
                        arr[index] = ele.value;
                    });
                } else {
                    arr.sort(fn);
                }
            };
            Shape.prototype.toObj = function () {
                return {
                    filter: this._compiledFilter.normalized,
                    sort: this._compiledSort.normalized,
                    pageSize: this.pageSize(),
                    pageIndex: this.pageIndex()
                };
            };
            return Shape;
        })();
        data.Shape = Shape;        
        var ArrayDataViewBase = (function () {
            function ArrayDataViewBase(shape) {
                this.isRemote = false;
                this.localPaging = true;
                //#region items
                this.local = [];
                this._updatingShape = false;
                this._pageCount = data.observable(1);
                this._totalItemCount = data.numericObservable(0);
                //#endregion shape
                //#region loading
                this._isLoaded = data.observable(false);
                this._isLoading = data.observable(false);
                //#endregionn
                //#region editing
                this._currentEditItem = data.observable();
                this._isCurrentEditItemNew = false;
                this._currentEditItemSnapshot = null;
                this.isLoading = this._isLoading.read();
                this.isLoaded = this._isLoaded.read();
                this._changed = new data.Subscribable(this);
                this.currentEditItem = this._currentEditItem.read();
                this._initCurrency();
                this._initShape(shape);
            }
            ArrayDataViewBase.prototype.dispose = function () {
            };
            ArrayDataViewBase.prototype.count = function () {
                return this.local.length;
            };
            ArrayDataViewBase.prototype.item = function (index) {
                if(index < 0 || index >= this.local.length) {
                    data.errors.indexOutOfBounds();
                }
                return this.local[index];
            };
            ArrayDataViewBase.prototype.indexOf = function (item) {
                return $.inArray(item, this.local);
            };
            ArrayDataViewBase.prototype.getSource = function () {
                return this.sourceArray;
            };
            ArrayDataViewBase.prototype.toObservableArray = function () {
                if(!this._koArray) {
                    this._koArray = ko.observableArray(this.local);
                }
                return this._koArray;
            };
            ArrayDataViewBase._getProps = //#endregion items
            //#region properties
            function _getProps(item) {
                var cols = [];
                data.util.each(item, function (key, value) {
                    key = String(key);
                    if(key.match(/^_/)) {
                        return;
                    }
                    if($.isFunction(value) && !value.subscribe) {
                        return;
                    }
                    cols.push({
                        name: key
                    });
                });
                return cols;
            };
            ArrayDataViewBase.prototype.getProperties = function () {
                return this.count() ? ArrayDataViewBase._getProps(this.item(0)) : [];
            };
            ArrayDataViewBase.prototype._readProperty = function (item, property) {
                return data.util.getProperty(item, property);
            };
            ArrayDataViewBase.prototype.getProperty = function (itemOrIndex, property) {
                var item = this._getItem(itemOrIndex);
                return this._readProperty(item, property);
            };
            ArrayDataViewBase.prototype._writeProperty = function (item, property, newValue) {
                data.util.setProperty(item, property, newValue);
            };
            ArrayDataViewBase.prototype.setProperty = function (itemOrIndex, property, newValue) {
                var item = this._getItem(itemOrIndex);
                if(item === this.currentEditItem() && this._currentEditItemSnapshot && !(property in this._currentEditItemSnapshot)) {
                    this._currentEditItemSnapshot[property] = this.getProperty(itemOrIndex, property);
                }
                this._writeProperty(item, property, newValue);
                return this;
            };
            ArrayDataViewBase.prototype.subscribe = function (handler, context) {
                return this._changed.subscribe(handler, context);
            };
            ArrayDataViewBase.prototype.trigger = function () {
                this._currencyManager.update();
                this._changed.trigger(this.local);
                if(this._koArray) {
                    this._koArray.notifySubscribers(this.local);
                }
            };
            ArrayDataViewBase.prototype.canFilter = function () {
                return true;
            };
            ArrayDataViewBase.prototype.canSort = function () {
                return true;
            };
            ArrayDataViewBase.prototype._updateShape = function (shape) {
                this._updatingShape = true;
                try  {
                    this._shape.update(shape);
                }finally {
                    this._updatingShape = false;
                }
            };
            ArrayDataViewBase.prototype.prevPage = function () {
                if(this.pageIndex() < 1) {
                    return false;
                }
                this.pageIndex(this.pageIndex() - 1);
                return true;
            };
            ArrayDataViewBase.prototype.nextPage = function () {
                if(this.pageCount() > 0 && this.pageIndex() + 1 >= this.pageCount()) {
                    return false;
                }
                this.pageIndex(this.pageIndex() + 1);
                return true;
            };
            ArrayDataViewBase.prototype._createShape = function (onChanged) {
                return new Shape(onChanged);
            };
            ArrayDataViewBase.prototype._initShape = function (shape) {
                var _this = this;
                var onChanged = function (onlyPaging) {
                    if (typeof onlyPaging === "undefined") { onlyPaging = false; }
                    if(!_this._updatingShape) {
                        _this.refresh(null, onlyPaging && _this.localPaging);
                    }
                };
                this._shape = this._createShape(onChanged);
                if(shape) {
                    this._updateShape(shape);
                }
                this.filter = this._shape.filter;
                this.sort = this._shape.sort;
                this.pageIndex = this._shape.pageIndex;
                this.pageSize = this._shape.pageSize;
                this.pageCount = this._pageCount.read();
                this.totalItemCount = this._totalItemCount.read();
            };
            ArrayDataViewBase.prototype._localRefresh = function (doPaging) {
                if (typeof doPaging === "undefined") { doPaging = this.localPaging; }
                var result = this._shape.apply(this.sourceArray, doPaging, this.local);
                if(doPaging) {
                    this._totalItemCount(result.totalCount);
                }
                this._pageCount(data.util.pageCount(this.totalItemCount(), this.pageSize()));
                // notify
                this.trigger();
                return $.Deferred().resolve().promise();
            };
            ArrayDataViewBase.prototype._remoteRefresh = function () {
                return this._localRefresh();
            };
            ArrayDataViewBase.prototype.refresh = function (shape, local) {
                if (typeof local === "undefined") { local = false; }
                var _this = this;
                this.cancelRefresh();
                if(shape) {
                    this._updateShape(shape);
                }
                this._isLoading(true);
                var promise = local ? this._localRefresh() : this._remoteRefresh();
                return promise.then(function () {
                    _this._isLoaded(true);
                    _this._isLoading(false);
                });
            };
            ArrayDataViewBase.prototype.cancelRefresh = function () {
            };
            ArrayDataViewBase.prototype._initCurrency = function () {
                this._currencyManager = new data.CurrencyManager(this.local);
                this.currentItem = this._currencyManager.currentItem;
                this.currentPosition = this._currencyManager.currentPosition;
            };
            ArrayDataViewBase.prototype.isCurrentEditItemNew = function () {
                return this._isCurrentEditItemNew;
            };
            ArrayDataViewBase.prototype._beginEdit = function (item, isNew) {
                this.commitEdit();
                this._currentEditItemSnapshot = {
                };
                this._isCurrentEditItemNew = isNew;
                this._currentEditItem(item);
            };
            ArrayDataViewBase.prototype.canAdd = function () {
                return true;
            };
            ArrayDataViewBase.prototype.add = function (item) {
                if(!item) {
                    data.errors.argument("item");
                }
                this.commitEdit();
                this.local.push(item);
                this._beginEdit(item, true);
                this.trigger();
            };
            ArrayDataViewBase.prototype.canAddNew = function () {
                return false;
            };
            ArrayDataViewBase.prototype.addNew = function () {
                return data.errors.unsupportedOperation();
            };
            ArrayDataViewBase.prototype.editItem = function (item) {
                if (typeof item === "undefined") { item = this.currentItem(); }
                this.commitEdit();
                item = this._getItem(item);
                if(item) {
                    this._beginEdit(item, false);
                }
            };
            ArrayDataViewBase.prototype.canRemove = function () {
                return true;
            };
            ArrayDataViewBase.prototype._remove = function (entry) {
                this.local.splice(entry.index, 1);
                data.util.remove(this.sourceArray, entry.item);
                this._totalItemCount.dec();
                this.trigger();
            };
            ArrayDataViewBase.prototype.remove = function (item) {
                if (typeof item === "undefined") { item = this.currentItem(); }
                this.commitEdit();
                var entry = this._resolve(item);
                if(!entry) {
                    return false;
                }
                this._remove(entry);
                return true;
            };
            ArrayDataViewBase.prototype.canCancelEdit = function () {
                return true;
            };
            ArrayDataViewBase.prototype.cancelEdit = function () {
                var _this = this;
                var key;
                if(!this.currentEditItem()) {
                    return;
                }
                var item = this.currentEditItem();
                this._currentEditItem(null);
                if(this._isCurrentEditItemNew) {
                    data.util.remove(this.local, this.item);
                } else if(this._currentEditItemSnapshot) {
                    $.each(this._currentEditItemSnapshot, function (k, v) {
                        return _this._writeProperty(item, k, v);
                    });
                }
                this.trigger();
            };
            ArrayDataViewBase.prototype.canCommitEdit = function () {
                return true;
            };
            ArrayDataViewBase.prototype.commitEdit = function () {
                if(!this.currentEditItem()) {
                    return;
                }
                var item = this.currentEditItem();
                this._currentEditItem(null);
                if(this._isCurrentEditItemNew) {
                    this.sourceArray.push(item);
                    this._totalItemCount.inc();
                }
                var filter = this._shape._compiledFilter;
                if(!filter.isEmpty && !filter.func(item)) {
                    data.util.remove(this.local, item);
                }
                this.trigger();
            };
            ArrayDataViewBase.prototype._getItem = //#endregion editing
            function (itemOrIndex) {
                var index;
                if(data.util.isNumeric(itemOrIndex)) {
                    return this.item(itemOrIndex);
                } else {
                    return itemOrIndex;
                }
            };
            ArrayDataViewBase.prototype._resolve = function (itemOrIndex, raiseIfNotContained) {
                if (typeof raiseIfNotContained === "undefined") { raiseIfNotContained = false; }
                var index;
                if(data.util.isNumeric(itemOrIndex)) {
                    return {
                        index: itemOrIndex,
                        item: this.item(itemOrIndex)
                    };
                } else {
                    index = this.indexOf(itemOrIndex);
                    if(index < 0) {
                        if(raiseIfNotContained) {
                            data.errors.itemNotInView(itemOrIndex);
                        }
                        return null;
                    }
                    return {
                        index: index,
                        item: itemOrIndex
                    };
                }
            };
            return ArrayDataViewBase;
        })();
        data.ArrayDataViewBase = ArrayDataViewBase;        
        var ArrayDataView = (function (_super) {
            __extends(ArrayDataView, _super);
            function ArrayDataView(source, shape) {
                        _super.call(this, shape);
                this.sourceArray = source;
                this.refresh();
            }
            return ArrayDataView;
        })(ArrayDataViewBase);
        data.ArrayDataView = ArrayDataView;        
    })(wijmo.data || (wijmo.data = {}));
    var data = wijmo.data;
})(wijmo || (wijmo = {}));
var wijmo;
(function (wijmo) {
    /// <reference path="arrayDataView.ts"/>
    (function (data) {
        var $ = jQuery;
        var RemoteDataView = (function (_super) {
            __extends(RemoteDataView, _super);
            function RemoteDataView(options) {
                        _super.call(this);
                this.isRemote = true;
                this.sourceArray = [];
                if(options) {
                    this._construct(options);
                }
            }
            RemoteDataView.prototype._construct = function (options) {
                this.options = options = $.extend({
                    localPaging: false
                }, options);
                this.localPaging = options.localPaging;
                this._updateShape(options);
            };
            return RemoteDataView;
        })(data.ArrayDataViewBase);
        data.RemoteDataView = RemoteDataView;        
    })(wijmo.data || (wijmo.data = {}));
    var data = wijmo.data;
})(wijmo || (wijmo = {}));
