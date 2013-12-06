/*
 *
 * Wijmo Library 3.20133.20
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Licensed under the Wijmo Commercial License. Also available under the GNU GPL Version 3 license.
 * licensing@wijmo.com
 * http://wijmo.com/widgets/license/
 *
 *
 */
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /// <reference path="src/remoteDataView.ts"/>
    /// <reference path="../External/declarations/jquery.d.ts"/>
    /// <reference path="../External/declarations/breeze.d.ts"/>
    /*globals jQuery, Globalize, wijmo */
    /*
    * Depends:
    *  wijmo.data.js
    *  globalize.js
    *  jquery.js
    *
    */
    (function (data) {
        /** @ignore */
        var BreezeShape = (function (_super) {
            __extends(BreezeShape, _super);
            function BreezeShape() {
                _super.apply(this, arguments);

                this._skipUpdatePredicate = false;
            }
            BreezeShape.opNameMap = {
                Greater: "GreaterThan",
                Less: "LessThan",
                GreaterOrEqual: "GreaterOrEqualThan",
                LessOrEqual: "LessOrEqualThan",
                BeginsWith: "StartsWith"
            };
            BreezeShape.prototype.toPredicate = function (normalizedFilter) {
                var result = null;
                if(normalizedFilter && typeof normalizedFilter === "object") {
                    data.util.each(normalizedFilter, function (prop, cond) {
                        var opName = BreezeShape.opNameMap[cond.op.name] || cond.op.name;
                        var predicate = new breeze.Predicate(prop, opName, cond.value);
                        result = !result ? predicate : result.and(predicate);
                    });
                }
                return result;
            };
            BreezeShape.prototype.onFilterChanged = function (newValue) {
                _super.prototype.onFilterChanged.call(this, newValue);
                if(!this._skipUpdatePredicate) {
                    this.predicate = this.toPredicate(this._compiledFilter.normalized);
                }
            };
            BreezeShape.prototype.setFilter = function (filter) {
                if(!breeze.Predicate.isPredicate(filter)) {
                    _super.prototype.setFilter.call(this, filter);
                    return;
                }
                this.predicate = filter;
                this._skipUpdatePredicate = true;
                try  {
                    _super.prototype.setFilter.call(this, null);
                }finally {
                    this._skipUpdatePredicate = false;
                }
            };
            BreezeShape.prototype.applyToQuery = function (query, applyPaging, inlineCount) {
                if (typeof applyPaging === "undefined") { applyPaging = true; }
                if (typeof inlineCount === "undefined") { inlineCount = true; }
                var sort = this._compiledSort;
                if(this.predicate) {
                    query = query.where(this.predicate);
                }
                if(!sort.isEmpty) {
                    var sortString = $.map(sort.normalized, function (sd) {
                        return sd.property + (sd.asc ? "" : " desc");
                    }).join(", ");
                    query = query.orderBy(sortString);
                }
                if(applyPaging) {
                    if(this._skip > 0) {
                        query = query.skip(this._skip);
                    }
                    if(this._take > 0) {
                        query = query.take(this._take);
                    }
                    if(inlineCount) {
                        query = query.inlineCount(true);
                    }
                }
                return query;
            };
            return BreezeShape;
        })(data.Shape);
        data.BreezeShape = BreezeShape;        
        var BreezeDataView = (function (_super) {
            __extends(BreezeDataView, _super);
            function BreezeDataView(query, manager, options) {
                        _super.call(this);
                this.query = query;
                this.manager = manager;
                this.options = options;
                if(!query) {
                    data.errors.argumentNull("query");
                }
                if(!manager) {
                    data.errors.argumentNull("manager");
                }
                this.entityType = manager.metadataStore.getEntityType(query.resourceName, true);
                this._shape.entityType = this.entityType;
                this._construct(options);
            }
            BreezeDataView.prototype._construct = function (options) {
                options = $.extend({
                    inlineCount: true
                }, options);
                _super.prototype._construct.call(this, options);
            };
            BreezeDataView._breezeDataTypeToString = function _breezeDataTypeToString(dataType) {
                if(!dataType) {
                    return null;
                }
                if(dataType == breeze.DataType.Decimal) {
                    return "number";
                } else if(dataType.isNumeric) {
                    return "number";
                } else if(dataType == breeze.DataType.String) {
                    return "string";
                } else if(dataType == breeze.DataType.DateTime || dataType == breeze.DataType.Time) {
                    return "datetime";
                } else if(dataType == breeze.DataType.Boolean) {
                    return "boolean";
                }
                return null;
            };
            BreezeDataView.prototype.getProperties = function () {
                if(this.entityType && this.entityType.dataProperties) {
                    return $.map(this.entityType.dataProperties, function (prop) {
                        return {
                            name: prop.name,
                            type: BreezeDataView._breezeDataTypeToString(prop.dataType)
                        };
                    });
                }
                return this.entityType ? this.entityType.dataProperties : [];
            };
            BreezeDataView.prototype._createShape = function (onChanged) {
                return new BreezeShape(onChanged);
            };
            BreezeDataView.prototype._remoteRefresh = function () {
                var _this = this;
                var result = $.Deferred();
                this.shapedQuery = this._shape.applyToQuery(this.query, !this.localPaging, this.options.inlineCount);
                var request = this._currentRequest = {
                    canceled: false
                };
                this.manager.executeQuery(this.shapedQuery).fail(function (error) {
                    if(error) {
                        data.util.logError(error);
                    }
                    result.reject(error);
                }).then(function (res) {
                    if(request.canceled) {
                        return;
                    }
                    if(request === _this._currentRequest) {
                        _this._currentRequest = null;
                    }
                    _this.sourceArray = res.results;
                    if(data.util.isNumeric(res.inlineCount)) {
                        _this._totalItemCount(res.inlineCount);
                    }
                    _this._localRefresh().then(result.resolve);
                });
                return result.promise();
            };
            BreezeDataView.prototype.cancelRefresh = function () {
                if(this._currentRequest) {
                    this._currentRequest.canceled = true;
                }
            };
            BreezeDataView.prototype._beginEdit = //#endregion loading
            //#region editing
            function (item, isNew) {
                if(!item.entityAspect) {
                    data.errors.breeze_notEntity(item);
                }
            };
            BreezeDataView.prototype._currentItemHasChanges = function () {
                var entity = this.currentEditItem(), p;
                if(!entity.entityAspect) {
                    return false;
                }
                for(p in entity.entityAspect.originalValues) {
                    if(this.getProperty(this.currentEditItem, p) !== entity.entityAspect.originalValues[p]) {
                        return true;
                    }
                }
                return false;
            };
            BreezeDataView.prototype._ensureEntity = function (entity) {
                if(!this.entityType) {
                    data.errors.breeze_entityTypeNotResolved(this.query.resourceName);
                }
                if(!entity.entityAspect) {
                    entity = this.entityType.createEntity(entity);
                }
                return entity;
            };
            BreezeDataView.prototype.canAddNew = function () {
                return !!this.entityType;
            };
            BreezeDataView.prototype.addNew = function (initialValues) {
                if (typeof initialValues === "undefined") { initialValues = {
                }; }
                return this.add(initialValues);
            };
            BreezeDataView.prototype.add = function (entity) {
                return _super.prototype.add.call(this, this._ensureEntity(entity));
            };
            BreezeDataView.prototype.commitEdit = function () {
                var entity = this.currentEditItem(), isNew = this.isCurrentEditItemNew, hasChanges = this._currentItemHasChanges();
                _super.prototype.commitEdit.call(this);
                if(isNew) {
                    this.manager.addEntity(entity);
                } else if(hasChanges) {
                    entity.entityAspect.setModified();
                }
            };
            BreezeDataView.prototype.cancelEdit = function () {
                var entity = this.currentEditItem();
                _super.prototype.cancelEdit.call(this);
                entity.entityAspect.setDeleted();
            };
            BreezeDataView.prototype._remove = function (entry) {
                var entity = entry.item.entityAspect;
                if(entity) {
                    entity.setDeleted();
                }
                return _super.prototype._remove.call(this, entry);
            };
            return BreezeDataView;
        })(data.RemoteDataView);
        data.BreezeDataView = BreezeDataView;        
        //#endregion editing
        data.errors._register({
            breeze_entityTypeNotResolved: "Entity type {0} not resolved",
            breeze_notEntity: "{0} is not a Breeze entity"
        });
    })(wijmo.data || (wijmo.data = {}));
    var data = wijmo.data;
})(wijmo || (wijmo = {}));
