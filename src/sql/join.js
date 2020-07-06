"use strict";
exports.__esModule = true;
exports.join = void 0;
var where_1 = require("./where");
var joinSql = function (args) {
    var sql = ["\"" + args[0] + "\""];
    var cond;
    if (args.length === 3) {
        sql.push('AS', "\"" + args[1] + "\"");
        cond = args[2];
    }
    else
        cond = args[1];
    sql.push('ON', cond);
    return "JOIN " + sql.join(' ');
};
var joinAssociation = function (model, as, name) {
    if (!model[name] || !model[name].subquery)
        throw new Error("can not join " + name + " to " + model.table);
    return [model[name].subquery(as)];
};
var joinQuery = function (sql, _, as, query) {
    var q = query.__query;
    var model = query.model;
    if (q.join)
        q.join.forEach(function (args) {
            exports.join(sql, model, as, args);
        });
    var cond;
    if (q.as)
        cond = where_1.where("\"" + q.as + "\"", q.and, q.or);
    else
        cond = where_1.where(model.quotedTable, q.and, q.or);
    if (!cond)
        cond = '1';
    if (q.as)
        return [model.table, q.as, cond];
    else
        return [model.table, cond];
};
exports.join = function (sql, model, as, args) {
    if (args.length === 1) {
        if (typeof args[0] === 'string')
            args = joinAssociation(model, as, args[0]);
        if (typeof args[0] === 'object')
            args = joinQuery(sql, model, as, args[0]);
    }
    sql.push(joinSql(args));
};
