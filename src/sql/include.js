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
exports.include = void 0;
var includeRelation = function (list, model, table, key, as, scope) { return __awaiter(void 0, void 0, void 0, function () {
    var rel, query, sql;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rel = model[key];
                query = rel.json(table, scope);
                return [4 /*yield*/, query.toSql()];
            case 1:
                sql = _a.sent();
                list.push("(" + sql + ") AS \"" + as + "\"");
                return [2 /*return*/];
        }
    });
}); };
exports.include = function (list, model, table, args) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(args.map(function (arg) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b, _i, key, value, as;
                    var _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(typeof arg === 'string')) return [3 /*break*/, 2];
                                return [4 /*yield*/, includeRelation(list, model, table, arg, arg)];
                            case 1:
                                _d.sent();
                                return [3 /*break*/, 8];
                            case 2:
                                if (!(typeof arg === 'object')) return [3 /*break*/, 8];
                                _a = [];
                                for (_b in arg)
                                    _a.push(_b);
                                _i = 0;
                                _d.label = 3;
                            case 3:
                                if (!(_i < _a.length)) return [3 /*break*/, 8];
                                key = _a[_i];
                                value = arg[key];
                                if (!(typeof value === 'string')) return [3 /*break*/, 5];
                                return [4 /*yield*/, includeRelation(list, model, table, key, value)];
                            case 4:
                                _d.sent();
                                return [3 /*break*/, 7];
                            case 5:
                                as = ((_c = value.__query) === null || _c === void 0 ? void 0 : _c.as) || key;
                                return [4 /*yield*/, includeRelation(list, model, table, key, as, value)];
                            case 6:
                                _d.sent();
                                _d.label = 7;
                            case 7:
                                _i++;
                                return [3 /*break*/, 3];
                            case 8: return [2 /*return*/];
                        }
                    });
                }); }))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
