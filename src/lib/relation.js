"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize_1 = require("pluralize");
const createProxy = (self, query, subquery, take, sourceModel) => {
    query.__subquery = subquery;
    query.associationTake = take;
    query.sourceModel = sourceModel;
    return new Proxy(query, {
        get: (target, name) => name in query ? query[name] : subquery()[name]
    });
};
const belongsTo = (self, as, take, { belongsTo: getModel, primaryKey, foreignKey, scope }) => {
    const model = getModel();
    const table = model.table;
    if (!primaryKey)
        primaryKey = model.primaryKey;
    let fk = foreignKey || `${pluralize_1.singular(table)}_${primaryKey}`;
    const selfTable = self.table;
    let q = take ? model.take() : model.toQuery();
    if (!scope)
        scope = q => q;
    const query = (record) => {
        const scoped = scope(q);
        const pk = `"${model.table}"."${primaryKey}"`;
        return scoped.where(`${pk} = ${record[fk]}`);
    };
    const subquery = () => {
        const scoped = scope(q);
        const pk = `"${model.table}"."${primaryKey}"`;
        return scoped.where(`${pk} = "${selfTable}"."${fk}"`);
    };
    return createProxy(self, query, subquery, take, model);
};
exports.relation = (self, as, config) => {
    if (config.hasOwnProperty('belongsTo'))
        return belongsTo(self, as, true, config);
    // else if (config.has)
};
