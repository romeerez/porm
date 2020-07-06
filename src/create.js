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
exports.create = void 0;
var pg_adapter_1 = require("pg-adapter");
var insert = function (model, columns, values, returning, records) { return __awaiter(void 0, void 0, void 0, function () {
    var modelColumns, createdAtColumnName, updatedAtColumnName, now, quotedNow_1, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, model.columns()];
            case 1:
                modelColumns = _a.sent();
                createdAtColumnName = model.createdAtColumnName, updatedAtColumnName = model.updatedAtColumnName;
                if (modelColumns[createdAtColumnName] || modelColumns[updatedAtColumnName]) {
                    now = new Date();
                    quotedNow_1 = pg_adapter_1.quote(now);
                    if (modelColumns[createdAtColumnName]) {
                        columns.push("\"" + createdAtColumnName + "\"");
                        values.forEach(function (row) { return row.push(quotedNow_1); });
                    }
                    if (modelColumns[updatedAtColumnName]) {
                        columns.push("\"" + updatedAtColumnName + "\"");
                        values.forEach(function (row) { return row.push(quotedNow_1); });
                    }
                }
                if (typeof returning === 'string')
                    returning = [returning];
                return [4 /*yield*/, model.db.arrays("INSERT INTO " + model.quotedTable + " (" + columns.join(', ') + ") VALUES " + values.map(function (row) { return "(" + row.join(', ') + ")"; }).join(', ') + " RETURNING " + returning.map(function (c) { return "\"" + c + "\""; }).join(', '))];
            case 2:
                result = _a.sent();
                result.forEach(function (row, rowNum) {
                    var record = records[rowNum];
                    row.forEach(function (value, i) {
                        record[returning[i]] = value;
                    });
                });
                if (now) {
                    if (modelColumns[createdAtColumnName] && modelColumns[updatedAtColumnName])
                        records.forEach(function (record) { return record[createdAtColumnName] = record[updatedAtColumnName] = now; });
                    else if (modelColumns[createdAtColumnName])
                        records.forEach(function (record) { return record[createdAtColumnName] = now; });
                    else
                        records.forEach(function (record) { return record[updatedAtColumnName] = now; });
                }
                return [2 /*return*/, records];
        }
    });
}); };
var createMany = function (model, records, returning) {
    var keys = {};
    var columns = [];
    var quoted = [];
    records.forEach(function (record) {
        for (var key in record)
            if (!keys[key]) {
                keys[key] = true;
                columns.push(key);
                quoted.push("\"" + key + "\"");
            }
    });
    var values = records.map(function (record) {
        return columns.map(function (column) {
            return pg_adapter_1.quote(record[column]);
        });
    });
    return insert(model, quoted, values, returning, records);
};
var createOne = function (model, record, returning) {
    return insert(model, Object.keys(record).map(function (c) { return "\"" + c + "\""; }), [Object.values(record).map(function (v) { return pg_adapter_1.quote(v); })], returning, [record]);
};
exports.create = function (model, records, returning) {
    if (returning === void 0) { returning = model.primaryKey; }
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!Array.isArray(records)) return [3 /*break*/, 2];
                    return [4 /*yield*/, createMany(model, records, returning)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [4 /*yield*/, createOne(model, records, returning)];
                case 3: return [2 /*return*/, (_a.sent())[0]];
            }
        });
    });
};
