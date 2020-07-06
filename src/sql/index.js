"use strict";
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
exports.__esModule = true;
exports.toSql = void 0;
var select_1 = require("./select");
var join_1 = require("./join");
var where_1 = require("./where");
var group_1 = require("./group");
var having_1 = require("./having");
var include_1 = require("./include");
var window_1 = require("./window");
var union_1 = require("./union");
var order_1 = require("./order");
exports.toSql = function (_a) {
    var model = _a.model, query = _a.__query;
    return __awaiter(void 0, void 0, void 0, function () {
        var sql, as, quotedAs, distinctList, hidden_1, _b, selectList, _c, _d, _e, _f, whereSql, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    sql = ['SELECT'];
                    as = query.as || model.table;
                    quotedAs = "\"" + as + "\"";
                    distinctList = [];
                    if (!query.distinct) return [3 /*break*/, 2];
                    return [4 /*yield*/, select_1.select(distinctList, model, quotedAs, query.distinct, false)];
                case 1:
                    _u.sent();
                    _u.label = 2;
                case 2:
                    if (!query.distinctRaw) return [3 /*break*/, 4];
                    return [4 /*yield*/, select_1.select(distinctList, model, quotedAs, query.distinctRaw, true)];
                case 3:
                    _u.sent();
                    _u.label = 4;
                case 4:
                    if (query.distinct || query.distinctRaw) {
                        sql.push('DISTINCT');
                        if (distinctList.length)
                            sql.push('ON', "(" + distinctList.join(', ') + ")");
                    }
                    if (!(!query.select && !query.selectRaw && model.hiddenColumns.length)) return [3 /*break*/, 6];
                    hidden_1 = model.hiddenColumns;
                    _b = query;
                    return [4 /*yield*/, model.columnNames()];
                case 5:
                    _b.select = (_u.sent()).filter(function (column) {
                        return !hidden_1.includes(column);
                    });
                    _u.label = 6;
                case 6:
                    selectList = [];
                    if (!query.select) return [3 /*break*/, 8];
                    return [4 /*yield*/, select_1.select(selectList, model, quotedAs, query.select, false)];
                case 7:
                    _u.sent();
                    return [3 /*break*/, 11];
                case 8:
                    if (!query.selectRaw) return [3 /*break*/, 10];
                    return [4 /*yield*/, select_1.select(selectList, model, quotedAs, query.selectRaw, true)];
                case 9:
                    _u.sent();
                    return [3 /*break*/, 11];
                case 10:
                    selectList.push(quotedAs + ".*");
                    _u.label = 11;
                case 11:
                    if (!query.include) return [3 /*break*/, 13];
                    return [4 /*yield*/, include_1.include(selectList, model, as, query.include)];
                case 12:
                    _u.sent();
                    _u.label = 13;
                case 13:
                    sql.push(selectList.join(', '));
                    _d = (_c = sql).push;
                    _e = ['FROM'];
                    if (!query.from) return [3 /*break*/, 15];
                    return [4 /*yield*/, query.from];
                case 14:
                    _f = _u.sent();
                    return [3 /*break*/, 16];
                case 15:
                    _f = model.quotedTable;
                    _u.label = 16;
                case 16:
                    _d.apply(_c, _e.concat([_f]));
                    if (query.as)
                        sql.push("\"" + query.as + "\"");
                    if (query.join)
                        query.join.forEach(function (args) {
                            return join_1.join(sql, model, as, args);
                        });
                    whereSql = where_1.where(quotedAs, query.and, query.or);
                    if (whereSql)
                        sql.push('WHERE', whereSql);
                    if (query.group || query.groupRaw)
                        sql.push('GROUP BY', group_1.group(quotedAs, query.group, query.groupRaw));
                    if (query.having)
                        sql.push('HAVING', having_1.having(query.having));
                    if (query.window)
                        sql.push('WINDOW', window_1.window(query.window));
                    if (!query.union) return [3 /*break*/, 18];
                    _h = (_g = sql).push;
                    return [4 /*yield*/, union_1.union('UNION', query.union)];
                case 17:
                    _h.apply(_g, [_u.sent()]);
                    _u.label = 18;
                case 18:
                    if (!query.unionAll) return [3 /*break*/, 20];
                    _k = (_j = sql).push;
                    return [4 /*yield*/, union_1.union('UNION ALL', query.unionAll)];
                case 19:
                    _k.apply(_j, [_u.sent()]);
                    _u.label = 20;
                case 20:
                    if (!query.intersect) return [3 /*break*/, 22];
                    _m = (_l = sql).push;
                    return [4 /*yield*/, union_1.union('INTERSECT', query.intersect)];
                case 21:
                    _m.apply(_l, [_u.sent()]);
                    _u.label = 22;
                case 22:
                    if (!query.intersectAll) return [3 /*break*/, 24];
                    _p = (_o = sql).push;
                    return [4 /*yield*/, union_1.union('INTERSECT ALL', query.intersectAll)];
                case 23:
                    _p.apply(_o, [_u.sent()]);
                    _u.label = 24;
                case 24:
                    if (!query.except) return [3 /*break*/, 26];
                    _r = (_q = sql).push;
                    return [4 /*yield*/, union_1.union('EXCEPT', query.except)];
                case 25:
                    _r.apply(_q, [_u.sent()]);
                    _u.label = 26;
                case 26:
                    if (!query.exceptAll) return [3 /*break*/, 28];
                    _t = (_s = sql).push;
                    return [4 /*yield*/, union_1.union('EXCEPT ALL', query.exceptAll)];
                case 27:
                    _t.apply(_s, [_u.sent()]);
                    _u.label = 28;
                case 28:
                    if (query.order || query.orderRaw)
                        sql.push('ORDER BY', order_1.order(quotedAs, query.order, query.orderRaw));
                    if (query.take)
                        query.limit = 1;
                    if (query.limit)
                        sql.push("LIMIT " + query.limit);
                    if (query.offset)
                        sql.push("OFFSET " + query.offset);
                    if (query["for"])
                        sql.push('FOR', query["for"]);
                    return [2 /*return*/, sql.join(' ')];
            }
        });
    });
};
