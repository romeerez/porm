"use strict";
exports.__esModule = true;
exports.where = void 0;
var pg_adapter_1 = require("pg-adapter");
var whereAnd = function (table, args) {
    var list = [];
    args.forEach(function (arg) {
        if (typeof arg === 'string')
            list.push(arg);
        else if (typeof arg === 'object')
            if (arg.__query) {
                var value = [];
                if (arg.__query.and)
                    value.push(whereAnd(table, arg.__query.and));
                if (arg.__query.or)
                    value.push(whereOr(table, arg.__query.or));
                list.push("(" + value.join(' OR ') + ")");
            }
            else
                for (var key in arg) {
                    var value = arg[key];
                    if (typeof value === 'object')
                        if (value === null)
                            list.push(table + ".\"" + key + "\" IS NULL");
                        else if (Array.isArray(value))
                            list.push(table + ".\"" + key + "\" IN (" + value.map(pg_adapter_1.quote).join(', ') + ")");
                        else
                            for (var column in value)
                                list.push("\"" + key + "\".\"" + column + "\" = " + pg_adapter_1.quote(value[column]));
                    else
                        list.push(table + ".\"" + key + "\" = " + pg_adapter_1.quote(value));
                }
    });
    return list.join(' AND ');
};
var whereOr = function (table, args) {
    var list = [];
    args.forEach(function (arg) {
        if (typeof arg === 'string')
            list.push(arg);
        else if (arg !== null && arg !== undefined && typeof arg === 'object')
            if (arg.__query) {
                var value = [];
                if (arg.__query.and)
                    value.push(whereAnd(table, arg.__query.and));
                if (arg.__query.or)
                    value.push(whereOr(table, arg.__query.or));
                list.push("(" + value.join(' OR ') + ")");
            }
            else {
                list.push(whereAnd(table, [arg]));
            }
    });
    return list.join(' OR ');
};
exports.where = function (table, and, or) {
    var andSql = [];
    if (and)
        andSql.push(whereAnd(table, and));
    if (or) {
        if (andSql.length)
            andSql.push(' OR ');
        andSql.push(whereOr(table, or));
    }
    if (andSql.length)
        return andSql.join('');
};
