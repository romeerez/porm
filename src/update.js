"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const pg_adapter_1 = require("pg-adapter");
const where_1 = require("./sql/where");
exports.update = async (model, set, returning) => {
    const query = model.__query || {};
    const sql = [`UPDATE ${model.quotedTable}`];
    if (query.as)
        sql.push(`"${query.as}"`);
    const table = query.as ? `"${query.as}"` : model.quotedTable;
    if (typeof set === 'object') {
        const values = [];
        for (let key in set)
            values.push(`${table}."${key}" = ${pg_adapter_1.quote(set[key])}`);
        sql.push('SET', values.join(', '));
    }
    else
        sql.push('SET', set);
    if (query.from)
        sql.push(query.from);
    const whereSql = where_1.where(table, query.and, query.or);
    if (whereSql)
        sql.push('WHERE', whereSql);
    if (returning)
        sql.push(`RETURNING ${Array.isArray(returning) ? returning.map(ret => `"${ret}"`).join(', ') : returning}`);
    return model.db.arrays(sql.join(' '));
};
