"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_adapter_1 = require("pg-adapter");
const whereAnd = (table, args) => {
    const list = [];
    args.forEach(arg => {
        if (typeof arg === 'string')
            list.push(arg);
        else if (typeof arg === 'object')
            if (arg.__query) {
                const value = [];
                if (arg.__query.and)
                    value.push(whereAnd(table, arg.__query.and));
                if (arg.__query.or)
                    value.push(whereOr(table, arg.__query.or));
                list.push(`(${value.join(' OR ')})`);
            }
            else
                for (let key in arg) {
                    const value = arg[key];
                    if (typeof value === 'object')
                        if (value === null)
                            list.push(`${table}."${key}" IS NULL`);
                        else
                            for (let column in value)
                                list.push(`"${key}"."${column}" = ${pg_adapter_1.quote(value[column])}`);
                    else
                        list.push(`${table}."${key}" = ${pg_adapter_1.quote(value)}`);
                }
    });
    return list.join(' AND ');
};
const whereOr = (table, args) => {
    const list = [];
    args.forEach(arg => {
        if (typeof arg === 'string')
            list.push(arg);
        else if (arg !== null && arg !== undefined && typeof arg === 'object')
            if (arg.__query) {
                const value = [];
                if (arg.__query.and)
                    value.push(whereAnd(table, arg.__query.and));
                if (arg.__query.or)
                    value.push(whereOr(table, arg.__query.or));
                list.push(`(${value.join(' OR ')})`);
            }
            else {
                list.push(whereAnd(table, [arg]));
            }
    });
    return list.join(' OR ');
};
exports.where = (table, and, or) => {
    const andSql = [];
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
