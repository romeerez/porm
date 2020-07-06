"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var query_1 = require("./query");
var sql_1 = require("./sql");
var create_1 = require("./create");
var update_1 = require("./update");
var delete_1 = require("./delete");
var relations_1 = require("./relations");
var transaction_1 = require("./transaction");
var aggregate_1 = require("./aggregate");
var utils_1 = require("./utils");
var findByIdParameter = function (model, id) {
    var _a;
    if (typeof id === 'object')
        if (Array.isArray(id))
            id = id.map(function (record) {
                return typeof record === 'object' ? record[model.primaryKey] : record;
            });
        else
            id = id[model.primaryKey];
    return model.where((_a = {}, _a[model.primaryKey] = id, _a));
};
var porm = function (db, _a) {
    var _b = (_a === void 0 ? {} : _a).camelCase, camelCase = _b === void 0 ? true : _b;
    return function (table, klass, options) {
        if (options === void 0) { options = {}; }
        var config = { camelCase: camelCase };
        var self = {
            db: db,
            table: table,
            config: config,
            aggregateSql: aggregate_1.aggregateSql,
            model: null,
            quotedTable: "\"" + table + "\"",
            primaryKey: options.primaryKey || 'id',
            quotedPrimaryKey: "\"" + (options.primaryKey || 'id') + "\"",
            hiddenColumns: klass.hiddenColumns || [],
            createdAtColumnName: utils_1.join({ config: config }, 'created', 'at'),
            updatedAtColumnName: utils_1.join({ config: config }, 'updated', 'at'),
            deletedAtColumnName: utils_1.join({ config: config }, 'deleted', 'at'),
            columns: function () {
                var _this = this;
                if (this.model.columnsPromise)
                    return this.model.columnsPromise;
                return this.model.columnsPromise = new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                    var columns, array;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                columns = {};
                                return [4 /*yield*/, db.query(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT * FROM information_schema.columns WHERE table_name = ", ""], ["SELECT * FROM information_schema.columns WHERE table_name = ", ""])), table)];
                            case 1:
                                array = _a.sent();
                                array.forEach(function (column) { return columns[column.column_name] = column; });
                                resolve(columns);
                                return [2 /*return*/];
                        }
                    });
                }); });
            },
            columnNames: function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = (_a = Object).keys;
                                return [4 /*yield*/, this.columns()];
                            case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                        }
                    });
                });
            },
            create: function (records, returning) {
                return create_1.create(this, records, returning);
            },
            deleteAll: function (returning) {
                return delete_1.destroy(this, returning);
            },
            "delete": function (id, returning) {
                return delete_1.destroy(findByIdParameter(this, id), returning);
            },
            updateAll: function (set, returning) {
                return update_1.update(this, set, returning);
            },
            update: function (id, set, returning) {
                return update_1.update(findByIdParameter(this, id), set, returning, typeof id === 'object' && id);
            },
            setDefaultScope: function (scope) {
                this.toQuery = function () {
                    return this.__query ? this : scope(query_1.createQuery(this));
                };
            },
            unscoped: function () {
                return query_1.createQuery(this);
            },
            belongsTo: function () { return null; },
            hasOne: function () { return null; },
            hasMany: function () { return null; },
            hasAndBelongsToMany: function () { return null; },
            then: function () { return null; },
            relations: function (fn) {
                var model = this;
                var relations = fn(model);
                for (var key in relations)
                    model[key] = relations[key](key);
                return model;
            },
            scopes: function (scopes) {
                var _this = this;
                var _loop_1 = function (key) {
                    this_1[key] = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return scopes[key].apply(_this.toQuery(), args);
                    };
                };
                var this_1 = this;
                for (var key in scopes) {
                    _loop_1(key);
                }
                return this;
            },
            prepare: function (fn) {
                var _this = this;
                var key;
                var preparer = function (args, query) { return __awaiter(_this, void 0, void 0, function () {
                    var sql;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, query.toSql()];
                            case 1:
                                sql = _b.sent();
                                return [2 /*return*/, (_a = this.db).prepare.apply(_a, __spreadArrays([this.table + "_" + key], args))([sql])];
                        }
                    });
                }); };
                var prepared = fn(preparer, this);
                for (key in prepared)
                    this[key] = prepared[key]();
                return this;
            },
            all: function () {
                var q = this.toQuery();
                if (q.__query.take)
                    return q.clone()._all();
                return q;
            },
            _all: function () {
                var model = this.toQuery();
                model.then = thenAll;
                if (model.__query && model.__query.take) {
                    model.then = thenAll;
                    delete model.__query.take;
                }
                return model;
            },
            take: function () {
                return this.clone()._take();
            },
            _take: function () {
                var model = this.toQuery();
                model.then = thenOne;
                model.__query.take = true;
                return model;
            },
            rows: function () {
                return this.clone()._rows();
            },
            _rows: function () {
                var model = this;
                model.then = thenRows;
                return model;
            },
            value: function () {
                return this.clone()._value();
            },
            _value: function () {
                var model = this;
                model.then = thenValue;
                return model;
            },
            exec: function () {
                return this.clone()._exec();
            },
            _exec: function () {
                var model = this;
                model.then = thenVoid;
                return model;
            },
            toSql: function () {
                return sql_1.toSql(this.toQuery());
            },
            toQuery: function () {
                return query_1.toQuery(this);
            },
            clone: function () {
                return query_1.createQuery(this.model || this, this.__query);
            },
            merge: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._merge.apply(_a, args);
            },
            _merge: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_1.merge(this, args);
            },
            distinct: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._distinct.apply(_a, args);
            },
            _distinct: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (args[0] === false) {
                    this.__query && delete this.__query.distinct;
                    return this.toQuery();
                }
                return query_1.pushArrayAny(this, 'distinct', args);
            },
            distinctRaw: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._distinctRaw.apply(_a, args);
            },
            _distinctRaw: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (args[0] === false) {
                    this.__query && delete this.__query.distinctRaw;
                    return this.toQuery();
                }
                return query_1.pushArrayAny(this, 'distinctRaw', args);
            },
            select: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._select.apply(_a, args);
            },
            _select: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_1.pushArrayAny(this, 'select', args);
            },
            selectRaw: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._selectRaw.apply(_a, args);
            },
            _selectRaw: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_1.pushArrayAny(this, 'selectRaw', args);
            },
            include: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._include.apply(_a, args);
            },
            _include: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_1.pushArrayAny(this, 'include', args);
            },
            from: function (source) {
                return this.clone()._from(source);
            },
            _from: function (source) {
                return query_1.setStringOrPromise(this, 'from', source);
            },
            as: function (as) {
                return this.clone()._as(as);
            },
            _as: function (as) {
                return query_1.setString(this, 'as', as);
            },
            wrap: function (query, as) {
                if (as === void 0) { as = 't'; }
                return this.clone()._wrap(query.clone(), as);
            },
            _wrap: function (query, as) {
                var _this = this;
                if (as === void 0) { as = 't'; }
                return query._as(as)._from(new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _a = resolve;
                                _b = "(";
                                return [4 /*yield*/, this.toQuery().toSql()];
                            case 1:
                                _a.apply(void 0, [_b + (_c.sent()) + ")"]);
                                return [2 /*return*/];
                        }
                    });
                }); }));
            },
            json: function () {
                return this.clone()._json();
            },
            _json: function () {
                var query = this.toQuery();
                var q = query.__query;
                var sql;
                if (q.take)
                    sql = "COALESCE(row_to_json(\"t\".*), '{}') AS json";
                else
                    sql = "COALESCE(json_agg(row_to_json(\"t\".*)), '[]') AS json";
                return this._wrap(query.model.selectRaw(sql))._value();
            },
            join: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._join.apply(_a, args);
            },
            _join: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var query = this.toQuery();
                var q = query.__query;
                if (q.join)
                    q.join.push(args);
                else
                    q.join = [args];
                return query;
            },
            where: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return this.and.apply(this, args);
            },
            _where: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return this._and.apply(this, args);
            },
            and: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._and.apply(_a, args);
            },
            _and: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_1.pushArrayAny(this, 'and', args);
            },
            or: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._or.apply(_a, args);
            },
            _or: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_1.pushArrayAny(this, 'or', args);
            },
            find: function (id) {
                return this.clone()._find(id);
            },
            _find: function (id) {
                var _a;
                return this._and((_a = {}, _a[this.primaryKey] = id, _a))._take();
            },
            findBy: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._findBy.apply(_a, args);
            },
            _findBy: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return this._where.apply(this, args)._take();
            },
            order: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._order.apply(_a, args);
            },
            _order: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_1.pushArrayAny(this, 'order', args);
            },
            orderRaw: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._orderRaw.apply(_a, args);
            },
            _orderRaw: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_1.pushArrayAny(this, 'orderRaw', args);
            },
            group: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._group.apply(_a, args);
            },
            _group: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_1.pushArrayAny(this, 'group', args);
            },
            groupRaw: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._groupRaw.apply(_a, args);
            },
            _groupRaw: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_1.pushArrayAny(this, 'groupRaw', args);
            },
            having: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._having.apply(_a, args);
            },
            _having: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_1.pushArrayAny(this, 'having', args);
            },
            window: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._window.apply(_a, args);
            },
            _window: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_1.pushArrayAny(this, 'window', args);
            },
            union: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._union.apply(_a, args);
            },
            _union: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_1.pushArrayAny(this, 'union', args);
            },
            unionAll: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._unionAll.apply(_a, args);
            },
            _unionAll: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_1.pushArrayAny(this, 'unionAll', args);
            },
            intersect: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._intersect.apply(_a, args);
            },
            _intersect: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_1.pushArrayAny(this, 'intersect', args);
            },
            intersectAll: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._intersectAll.apply(_a, args);
            },
            _intersectAll: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_1.pushArrayAny(this, 'intersectAll', args);
            },
            except: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._except.apply(_a, args);
            },
            _except: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_1.pushArrayAny(this, 'except', args);
            },
            exceptAll: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = this.clone())._exceptAll.apply(_a, args);
            },
            _exceptAll: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_1.pushArrayAny(this, 'exceptAll', args);
            },
            limit: function (value) {
                return this.clone()._limit(value);
            },
            _limit: function (value) {
                return query_1.setNumber(this, 'limit', value);
            },
            offset: function (value) {
                return this.clone()._offset(value);
            },
            _offset: function (value) {
                return query_1.setNumber(this, 'offset', value);
            },
            "for": function (value) {
                return this.clone()._for(value);
            },
            _for: function (value) {
                return query_1.setString(this, 'for', value);
            },
            exists: function () {
                return this.clone()._exists();
            },
            _exists: function () {
                return this._selectRaw('1').value();
            },
            count: function (args, options) {
                return this.clone()._count(args, options);
            },
            _count: function (args, options) {
                if (args === void 0) { args = '*'; }
                return this._selectRaw(this.aggregateSql('count', args, options))._value();
            },
            avg: function (args, options) {
                return this.clone()._avg(args, options);
            },
            _avg: function (args, options) {
                return this._selectRaw(this.aggregateSql('avg', args, options))._value();
            },
            min: function (args, options) {
                return this.clone()._min(args, options);
            },
            _min: function (args, options) {
                return this._selectRaw(this.aggregateSql('min', args, options))._value();
            },
            max: function (args, options) {
                return this.clone()._max(args, options);
            },
            _max: function (args, options) {
                return this._selectRaw(this.aggregateSql('max', args, options))._value();
            },
            sum: function (args, options) {
                return this.clone()._sum(args, options);
            },
            _sum: function (args, options) {
                return this._selectRaw(this.aggregateSql('sum', args, options))._value();
            },
            first: function (limit) {
                return this.clone()._first(limit);
            },
            _first: function (limit) {
                if (limit)
                    return this.order(this.primaryKey).limit(limit).all();
                return this.order(this.primaryKey).take();
            },
            last: function (limit) {
                return this.clone()._last(limit);
            },
            _last: function (limit) {
                var _a, _b;
                if (limit)
                    return this.order((_a = {}, _a[this.primaryKey] = 'DESC', _a)).limit(limit).all();
                return this.order((_b = {}, _b[this.primaryKey] = 'DESC', _b)).take();
            }
        };
        self.model = self;
        self.belongsTo = function (fn, options) {
            return relations_1.belongsTo(self, fn, options);
        };
        self.hasOne = function (fn, options) {
            return relations_1.hasOne(self, fn, options);
        };
        self.hasMany = function (fn, options) {
            return relations_1.hasMany(self, fn, options);
        };
        self.hasAndBelongsToMany = function (fn, options) {
            return relations_1.hasAndBelongsToMany(self, fn, options);
        };
        var thenAll = function (resolve, reject) {
            return this.db.query(this.toSql()).then(resolve, reject);
        };
        var thenOne = function (resolve, reject) {
            return this.db.query(this.toSql()).then(function (_a) {
                var record = _a[0];
                return resolve && resolve(record);
            }, reject);
        };
        var thenRows = function (resolve, reject) {
            return this.db.arrays(this.toSql()).then(resolve, reject);
        };
        var thenValue = function (resolve, reject) {
            return this.db.value(this.toSql()).then(resolve, reject);
        };
        var thenVoid = function (resolve, reject) {
            return this.db.exec(this.toSql()).then(resolve, reject);
        };
        self.then = thenAll;
        return self;
    };
};
porm.hidden = function (_a, key) {
    var target = _a.constructor;
    if (!target.hiddenColumns)
        target.hiddenColumns = [];
    target.hiddenColumns.push(key);
};
porm.transaction = transaction_1.transaction;
exports["default"] = porm;
var templateObject_1;
