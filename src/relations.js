"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.hasAndBelongsToMany = exports.hasMany = exports.hasOne = exports.has = exports.hasThrough = exports.belongsTo = void 0;
var pluralize_1 = require("pluralize");
var pg_adapter_1 = require("pg-adapter");
var model_1 = require("./model");
var utils_1 = require("./utils");
exports.belongsTo = function (self, fn, _a) {
    var _b = _a === void 0 ? {} : _a, primaryKey = _b.primaryKey, foreignKey = _b.foreignKey;
    return function () {
        var model = fn(null).clone();
        var pk = primaryKey || model.primaryKey;
        var fk = foreignKey || utils_1.join(self, pluralize_1.singular(model.table), pk);
        var query = function (params) {
            var _a;
            var id = params[fk];
            return model.and((_a = {}, _a[pk] = id, _a)).take();
        };
        var subquery = function (as, scope) {
            var _a;
            if (as === void 0) { as = self.table; }
            if (scope === void 0) { scope = model; }
            return scope.and("\"" + (((_a = scope.__query) === null || _a === void 0 ? void 0 : _a.as) || model.table) + "\".\"" + pk + "\" = \"" + as + "\".\"" + fk + "\"");
        };
        query.json = function (as, scope) {
            if (as === void 0) { as = self.table; }
            if (scope === void 0) { scope = model; }
            return subquery(as, scope).take().json();
        };
        query.subquery = subquery;
        query.sourceModel = model;
        return query;
    };
};
exports.hasThrough = function (self, model, joinQuery, sourceQuery, many) {
    var query = many ?
        function (params) { return sourceQuery.subquery().join(joinQuery(params)).merge(model); } :
        function (params) { return sourceQuery.subquery().join(joinQuery(params)).merge(model).take(); };
    var subquery = function (as, scope) {
        return sourceQuery.subquery(undefined, scope).join(joinQuery.subquery(as)).merge(model);
    };
    query.json = many
        ? function (as, scope) {
            if (scope === void 0) { scope = sourceQuery; }
            return subquery(as, scope).json();
        }
        : function (as, scope) {
            if (scope === void 0) { scope = sourceQuery; }
            return subquery(as, scope).take().json();
        };
    query.subquery = subquery;
    query.sourceModel = model;
    return query;
};
exports.has = function (many, self, fn, _a) {
    var _b = _a === void 0 ? {} : _a, primaryKey = _b.primaryKey, foreignKey = _b.foreignKey, through = _b.through, source = _b.source;
    return function (name) {
        var model = fn(null).clone();
        if (through) {
            var sourceModel = self[through].sourceModel;
            if (source)
                name = source;
            else if (!sourceModel[name])
                name = pluralize_1.singular(name);
            var sourceQuery = sourceModel[name];
            return exports.hasThrough(self, model, self[through], sourceQuery, many);
        }
        var pk = primaryKey || self.primaryKey;
        var fk = utils_1.join(self, foreignKey || pluralize_1.singular(self.table), pk);
        var tfk = model.quotedTable + ".\"" + fk + "\"";
        var query = many ?
            function (params) {
                var id = params[pk];
                return model.and(tfk + " = " + pg_adapter_1.quote(id));
            } : function (params) {
            var id = params[pk];
            return model.and(tfk + " = " + pg_adapter_1.quote(id)).take();
        };
        var subquery = function (as, scope) {
            var _a;
            if (as === void 0) { as = self.table; }
            if (scope === void 0) { scope = model; }
            return scope.and("\"" + (((_a = scope.__query) === null || _a === void 0 ? void 0 : _a.as) || model.table) + "\".\"" + fk + "\" = \"" + as + "\".\"" + pk + "\"");
        };
        query.json = many
            ? function (as, scope) {
                if (as === void 0) { as = self.table; }
                return subquery(as, scope).json();
            }
            : function (as, scope) {
                if (as === void 0) { as = self.table; }
                return subquery(as, scope).take().json();
            };
        query.subquery = subquery;
        query.sourceModel = model;
        return query;
    };
};
exports.hasOne = function (self, fn, options) {
    if (options === void 0) { options = {}; }
    return exports.has(false, self, fn, options);
};
exports.hasMany = function (self, fn, options) {
    if (options === void 0) { options = {}; }
    return exports.has(true, self, fn, options);
};
exports.hasAndBelongsToMany = function (self, fn, _a) {
    var _b = _a === void 0 ? {} : _a, primaryKey = _b.primaryKey, foreignKey = _b.foreignKey, joinTable = _b.joinTable, associationForeignKey = _b.associationForeignKey;
    return function (name) {
        var sourceModel = fn(null);
        var jt = joinTable || utils_1.join.apply(void 0, __spreadArrays([self], [self.table, sourceModel.table].sort()));
        var joinModel = model_1["default"](self.db, self.config)(jt, /** @class */ (function () {
            function class_1() {
            }
            return class_1;
        }()));
        var joinQuery = exports.hasMany(self, function (params) { return joinModel; }, { primaryKey: primaryKey, foreignKey: foreignKey })(name);
        var sourceQuery = exports.belongsTo(joinModel, function () { return sourceModel.model; }, { foreignKey: associationForeignKey })();
        return exports.hasThrough(self, sourceModel, joinQuery, sourceQuery, true);
    };
};
