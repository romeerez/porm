"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const select_1 = require("./sql/select");
const join_1 = require("./sql/join");
const where_1 = require("./sql/where");
const group_1 = require("./sql/group");
const having_1 = require("./sql/having");
const window_1 = require("./sql/window");
const union_1 = require("./sql/union");
const order_1 = require("./sql/order");
exports.toSql = ({ model, __query: query }) => {
    const sql = [];
    sql.push('SELECT');
    const table = query.as ? `"${query.as}"` : model.quotedTable;
    if (query.exists) {
        sql.push('1');
    }
    else {
        let distinct, distinctRaw;
        if (query.distinct)
            distinct = select_1.select(model, table, query.distinct, false);
        if (query.distinctRaw)
            distinctRaw = select_1.select(model, table, query.distinctRaw, true);
        if (query.distinct || query.distinctRaw) {
            sql.push('DISTINCT');
            if (distinct || distinctRaw) {
                let both = distinct;
                if (distinctRaw)
                    both = both ? `${both}, ${distinctRaw}` : distinctRaw;
                sql.push('ON', `(${both})`);
            }
        }
        if (query.select)
            sql.push(select_1.select(model, table, query.select, false));
        else if (query.selectRaw)
            sql.push(select_1.select(model, table, query.selectRaw, true));
        else if (!query.select)
            sql.push(`${table}.*`);
    }
    const from = query.from || model.quotedTable;
    if (!from)
        return sql.join(' ');
    sql.push('FROM', from);
    if (query.as)
        sql.push(`"${query.as}"`);
    if (query.join)
        query.join.forEach(args => join_1.join(sql, model, query.as || model.table, args));
    const whereSql = where_1.where(table, query.and, query.or);
    if (whereSql)
        sql.push('WHERE', whereSql);
    if (query.group || query.groupRaw)
        sql.push('GROUP BY', group_1.group(table, query.group, query.groupRaw));
    if (query.having)
        sql.push('HAVING', having_1.having(query.having));
    if (query.window)
        sql.push('WINDOW', window_1.window(query.window));
    if (query.union)
        sql.push(union_1.union('UNION', query.union));
    if (query.unionAll)
        sql.push(union_1.union('UNION ALL', query.unionAll));
    if (query.intersect)
        sql.push(union_1.union('INTERSECT', query.intersect));
    if (query.intersectAll)
        sql.push(union_1.union('INTERSECT ALL', query.intersectAll));
    if (query.except)
        sql.push(union_1.union('EXCEPT', query.except));
    if (query.exceptAll)
        sql.push(union_1.union('EXCEPT ALL', query.exceptAll));
    if (query.order || query.orderRaw)
        sql.push('ORDER BY', order_1.order(table, query.order, query.orderRaw));
    if (query.take)
        query.limit = 1;
    if (query.limit)
        sql.push(`LIMIT ${query.limit}`);
    if (query.offset)
        sql.push(`OFFSET ${query.offset}`);
    if (query.for)
        sql.push('FOR', query.for);
    return sql.join(' ');
};
