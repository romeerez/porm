"use strict";
exports.__esModule = true;
exports.aggregateSql = void 0;
exports.aggregateSql = function (functionName, args, _a) {
    var _b = _a === void 0 ? {} : _a, distinct = _b.distinct, order = _b.order, filter = _b.filter, withinGroup = _b.withinGroup;
    var sql = [functionName + "("];
    if (distinct && !withinGroup)
        sql.push('DISTINCT ');
    sql.push(args);
    if (withinGroup)
        sql.push(') WITHIN GROUP (');
    else if (order)
        sql.push(' ');
    if (order)
        sql.push("ORDER BY " + order);
    sql.push(')');
    if (filter)
        sql.push(" FILTER (WHERE " + filter + ")");
    return sql.join('');
};
