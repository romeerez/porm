"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAndBelongsToMany = exports.hasMany = exports.hasOne = exports.has = exports.hasThrough = exports.belongsTo = void 0;
const pluralize_1 = require("pluralize");
const pg_adapter_1 = require("pg-adapter");
const model_1 = __importDefault(require("./model"));
const utils_1 = require("./utils");
exports.belongsTo = (self, fn, { primaryKey, foreignKey, } = {}) => () => {
    const model = fn(null).clone();
    const pk = primaryKey || model.primaryKey;
    const fk = foreignKey || utils_1.join(self, pluralize_1.singular(model.table), pk);
    const query = (params) => {
        const id = params[fk];
        return model.and({ [pk]: id }).take();
    };
    const subquery = (as = self.table) => model.and(`${model.quotedTable}."${pk}" = "${as}"."${fk}"`);
    query.json = () => subquery().take().json();
    query.subquery = subquery;
    query.sourceModel = model;
    return query;
};
exports.hasThrough = (self, model, joinQuery, sourceQuery, many) => {
    const query = many ?
        (params) => sourceQuery.subquery().join(joinQuery(params)).merge(model) :
        (params) => sourceQuery.subquery().join(joinQuery(params)).merge(model).take();
    const subquery = () => sourceQuery.subquery().join(joinQuery.subquery()).merge(model);
    query.json = many ? () => subquery().json() : () => subquery().take().json();
    query.subquery = subquery;
    query.sourceModel = model;
    return query;
};
exports.has = (many, self, fn, { primaryKey, foreignKey, through, source } = {}) => (name) => {
    const model = fn(null).clone();
    if (through) {
        const sourceModel = self[through].sourceModel;
        if (source)
            name = source;
        else if (!sourceModel[name])
            name = pluralize_1.singular(name);
        const sourceQuery = sourceModel[name];
        return exports.hasThrough(self, model, self[through], sourceQuery, many);
    }
    const pk = primaryKey || self.primaryKey;
    const fk = `${model.quotedTable}."${utils_1.join(self, foreignKey || pluralize_1.singular(self.table), pk)}"`;
    const query = many ?
        (params) => {
            const id = params[pk];
            return model.and(`${fk} = ${pg_adapter_1.quote(id)}`);
        } : (params) => {
        const id = params[pk];
        return model.and(`${fk} = ${pg_adapter_1.quote(id)}`).take();
    };
    const subquery = (as = self.table) => model.and(`${fk} = "${as}"."${pk}"`);
    query.json = many ? () => subquery().json() : () => subquery().take().json();
    query.subquery = subquery;
    query.sourceModel = model;
    return query;
};
exports.hasOne = (self, fn, options = {}) => exports.has(false, self, fn, options);
exports.hasMany = (self, fn, options = {}) => exports.has(true, self, fn, options);
exports.hasAndBelongsToMany = (self, fn, { primaryKey, foreignKey, joinTable, associationForeignKey, } = {}) => (name) => {
    const sourceModel = fn(null);
    const jt = joinTable || utils_1.join(self, ...[self.table, sourceModel.table].sort());
    const joinModel = model_1.default(self.db, self.config)(jt);
    const joinQuery = exports.hasMany(self, (params) => joinModel, { primaryKey, foreignKey })(name);
    const sourceQuery = exports.belongsTo(joinModel, () => sourceModel.model, { foreignKey: associationForeignKey })();
    return exports.hasThrough(self, sourceModel, joinQuery, sourceQuery, true);
};
