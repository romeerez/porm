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
exports.select = void 0;
var selectObject = function (model, list, table, arg, raw, as) { return __awaiter(void 0, void 0, void 0, function () {
    var query, sql, _a, _b, _i, key, value, _c, _d, _e, as_1;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (!(arg.__subquery || arg.toQuery)) return [3 /*break*/, 2];
                query = arg.toQuery();
                return [4 /*yield*/, (query.__query.type ? query.toSql() : query.json().toSql())];
            case 1:
                sql = _f.sent();
                list.push("(" + sql + ") AS \"" + (as || query.__query.as || query.model.table) + "\"");
                return [2 /*return*/];
            case 2:
                _a = [];
                for (_b in arg)
                    _a.push(_b);
                _i = 0;
                _f.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 9];
                key = _a[_i];
                value = arg[key];
                if (!(value.__subquery || typeof value === 'object')) return [3 /*break*/, 7];
                if (!(value.__subquery || value.__query)) return [3 /*break*/, 5];
                if (!value.__query || !value.__query.type)
                    value = value.json();
                _d = (_c = list).push;
                _e = "(";
                return [4 /*yield*/, value.toSql()];
            case 4:
                _d.apply(_c, [_e + (_f.sent()) + ") AS \"" + key + "\""]);
                return [3 /*break*/, 6];
            case 5:
                for (as_1 in value)
                    list.push("\"" + key + "\".\"" + value[as_1] + "\" AS \"" + as_1 + "\"");
                _f.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                if (raw)
                    list.push(value + " AS \"" + key + "\"");
                else
                    list.push(table + ".\"" + value + "\" AS \"" + key + "\"");
                _f.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 3];
            case 9: return [2 /*return*/];
        }
    });
}); };
var selectString = function (model, list, table, arg, raw) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (raw)
                    return [2 /*return*/, list.push(arg)];
                else if (arg === undefined || arg === null || arg === false)
                    return [2 /*return*/];
                if (!(model[arg] && model[arg].__subquery)) return [3 /*break*/, 2];
                return [4 /*yield*/, selectObject(model, list, table, model[arg], raw, arg)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                if (arg === '*')
                    list.push(table + ".*");
                else
                    list.push(table + ".\"" + arg + "\"");
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
var selectArgument = function (list, model, table, arg, raw) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!Array.isArray(arg)) return [3 /*break*/, 1];
                arg.forEach(function (item) { return selectArgument(list, model, table, item, raw); });
                return [3 /*break*/, 5];
            case 1:
                if (!(arg.__subquery || typeof arg === 'object')) return [3 /*break*/, 3];
                return [4 /*yield*/, selectObject(model, list, table, arg, raw)];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, selectString(model, list, table, arg, raw)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.select = function (list, model, table, args, raw) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(args.map(function (arg) { return selectArgument(list, model, table, arg, raw); }))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
