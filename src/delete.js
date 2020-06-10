"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy = void 0;
const where_1 = require("./sql/where");
exports.destroy = async (model, returning) => {
    const query = model.__query || {};
    const sql = [`DELETE FROM ${query.from || model.quotedTable}`];
    if (query.as)
        sql.push(`"${query.as}"`);
    const table = query.as ? `"${query.as}"` : model.quotedTable;
    const whereSql = where_1.where(table, query.and, query.or);
    if (whereSql)
        sql.push('WHERE', whereSql);
    if (query.take)
        query.limit = 1;
    if (query.limit)
        sql.push(`LIMIT ${query.limit}`);
    if (returning)
        sql.push(`RETURNING ${Array.isArray(returning) ? returning.map(ret => `"${ret}"`).join(', ') : returning}`);
    return model.db.arrays(sql.join(' '));
};
