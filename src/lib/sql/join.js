"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const where_1 = require("./where");
const joinSql = (args) => {
    const sql = [`"${args[0]}"`];
    let cond;
    if (args.length === 3) {
        sql.push('AS', `"${args[1]}"`);
        cond = args[2];
    }
    else
        cond = args[1];
    sql.push('ON', cond);
    return `JOIN ${sql.join(' ')}`;
};
const joinAssociation = (model, as, name) => {
    if (!model[name] || !model[name].__subquery)
        throw new Error(`can not join ${name} to ${model.table}`);
    return [model[name].__subquery(as)];
};
const joinQuery = (sql, _, as, query) => {
    const q = query.__query;
    const { model } = query;
    if (q.join)
        q.join.forEach(args => {
            exports.join(sql, model, as, args);
        });
    let cond;
    if (q.as)
        cond = where_1.where(`"${q.as}"`, q.and, q.or);
    else
        cond = where_1.where(model.quotedTable, q.and, q.or);
    if (!cond)
        cond = '1';
    if (q.as)
        return [model.table, q.as, cond];
    else
        return [model.table, cond];
};
exports.join = (sql, model, as, args) => {
    if (args.length === 1) {
        if (typeof args[0] === 'string')
            args = joinAssociation(model, as, args[0]);
        if (typeof args[0] === 'object')
            args = joinQuery(sql, model, as, args[0]);
    }
    sql.push(joinSql(args));
};
