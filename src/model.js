"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("./query");
const sql_1 = require("./sql");
const create_1 = require("./create");
const update_1 = require("./update");
const delete_1 = require("./delete");
const relations_1 = require("./relations");
const findByIdParameter = (model, id) => {
    if (typeof id === 'object')
        if (Array.isArray(id))
            id = id.map(record => typeof record === 'object' ? record[model.primaryKey] : record);
        else
            id = id[model.primaryKey];
    return model.where({ [model.primaryKey]: id });
};
const porm = (db, { camelCase = true } = {}) => (table, klass, options = {}) => {
    const self = {
        model: null,
        config: { camelCase },
        db,
        table,
        quotedTable: `"${table}"`,
        primaryKey: options.primaryKey || 'id',
        quotedPrimaryKey: `"${options.primaryKey || 'id'}"`,
        create(records, returning) {
            return create_1.create(this, records, returning);
        },
        deleteAll(returning) {
            return delete_1.destroy(this, returning);
        },
        delete(id, returning) {
            return delete_1.destroy(findByIdParameter(this, id), returning);
        },
        updateAll(set, returning) {
            return update_1.update(this, set, returning);
        },
        update(id, set, returning) {
            return update_1.update(findByIdParameter(this, id), set, returning);
        },
        setDefaultScope(scope) {
            this.toQuery = function () {
                return this.__query ? this : scope(query_1.createQuery(this));
            };
        },
        unscoped() {
            return query_1.createQuery(this);
        },
        belongsTo: () => null,
        hasOne: () => null,
        hasMany: () => null,
        hasAndBelongsToMany: () => null,
        then: () => null,
        relations(fn) {
            const model = this;
            const relations = fn(model);
            for (let key in relations)
                model[key] = relations[key](key);
            return model;
        },
        scopes(scopes) {
            for (let key in scopes)
                this[key] = (...args) => scopes[key].apply(this.toQuery(), args);
            return this;
        },
        prepare(fn) {
            let key;
            const preparer = (args, query) => {
                return this.db.prepare(`${this.table}_${key}`, ...args)([query.toSql()]);
            };
            const prepared = fn(preparer, this);
            for (key in prepared)
                this[key] = prepared[key]();
            return this;
        },
        all() {
            const q = this.toQuery();
            if (q.__query.take)
                return q.clone()._all();
            return q;
        },
        _all() {
            const model = this.toQuery();
            model.then = thenAll;
            if (model.__query && model.__query.take) {
                model.then = thenAll;
                delete model.__query.take;
            }
            return model;
        },
        take() {
            return this.clone()._take();
        },
        _take() {
            const model = this.toQuery();
            model.then = thenOne;
            model.__query.take = true;
            return model;
        },
        rows() {
            return this.clone()._rows();
        },
        _rows() {
            const model = this;
            model.then = thenRows;
            return model;
        },
        value() {
            return this.clone()._value();
        },
        _value() {
            const model = this;
            model.then = thenValue;
            return model;
        },
        exec() {
            return this.clone()._exec();
        },
        _exec() {
            const model = this;
            model.then = thenVoid;
            return model;
        },
        toSql() {
            return sql_1.toSql(this.toQuery());
        },
        toQuery() {
            return query_1.toQuery(this);
        },
        clone() {
            return query_1.createQuery(this.model || this, this.__query);
        },
        merge(...args) {
            return this.clone()._merge(...args);
        },
        _merge(...args) {
            return query_1.merge(this, args);
        },
        distinct(...args) {
            return this.clone()._distinct(...args);
        },
        _distinct(...args) {
            if (args[0] === false) {
                this.__query && delete this.__query.distinct;
                return this.toQuery();
            }
            return query_1.pushArrayAny(this, 'distinct', args);
        },
        distinctRaw(...args) {
            return this.clone()._distinctRaw(...args);
        },
        _distinctRaw(...args) {
            if (args[0] === false) {
                this.__query && delete this.__query.distinctRaw;
                return this.toQuery();
            }
            return query_1.pushArrayAny(this, 'distinctRaw', args);
        },
        select(...args) {
            return this.clone()._select(...args);
        },
        _select(...args) {
            return query_1.pushArrayAny(this, 'select', args);
        },
        selectRaw(...args) {
            return this.clone()._selectRaw(...args);
        },
        _selectRaw(...args) {
            return query_1.pushArrayAny(this, 'selectRaw', args);
        },
        from(source) {
            return this.clone()._from(source);
        },
        _from(source) {
            return query_1.setString(this, 'from', source);
        },
        as(as) {
            return this.clone()._as(as);
        },
        _as(as) {
            return query_1.setString(this, 'as', as);
        },
        wrap(query, as = 't') {
            return this.clone()._wrap(query.clone(), as);
        },
        _wrap(query, as = 't') {
            return query._as(as)._from(`(${this.toQuery().toSql()})`);
        },
        json() {
            return this.clone()._json();
        },
        _json() {
            const query = this.toQuery();
            const q = query.__query;
            let sql;
            if (q.take)
                sql = `COALESCE(row_to_json("t".*), '{}') AS json`;
            else
                sql = `COALESCE(json_agg(row_to_json("t".*)), '[]') AS json`;
            return this._wrap(query.model.selectRaw(sql))._value();
        },
        join(...args) {
            return this.clone()._join(...args);
        },
        _join(...args) {
            const query = this.toQuery();
            const q = query.__query;
            if (q.join)
                q.join.push(args);
            else
                q.join = [args];
            return query;
        },
        where(...args) {
            return this.and(...args);
        },
        _where(...args) {
            return this._and(...args);
        },
        and(...args) {
            return this.clone()._and(...args);
        },
        _and(...args) {
            return query_1.pushArrayAny(this, 'and', args);
        },
        or(...args) {
            return this.clone()._or(...args);
        },
        _or(...args) {
            return query_1.pushArrayAny(this, 'or', args);
        },
        find(id) {
            return this.clone()._find(id);
        },
        _find(id) {
            return this._and({ [this.primaryKey]: id })._take();
        },
        findBy(...args) {
            return this.clone()._findBy(...args);
        },
        _findBy(...args) {
            return this._where(...args)._take();
        },
        order(...args) {
            return this.clone()._order(...args);
        },
        _order(...args) {
            return query_1.pushArrayAny(this, 'order', args);
        },
        orderRaw(...args) {
            return this.clone()._orderRaw(...args);
        },
        _orderRaw(...args) {
            return query_1.pushArrayAny(this, 'orderRaw', args);
        },
        group(...args) {
            return this.clone()._group(...args);
        },
        _group(...args) {
            return query_1.pushArrayAny(this, 'group', args);
        },
        groupRaw(...args) {
            return this.clone()._groupRaw(...args);
        },
        _groupRaw(...args) {
            return query_1.pushArrayAny(this, 'groupRaw', args);
        },
        having(...args) {
            return this.clone()._having(...args);
        },
        _having(...args) {
            return query_1.pushArrayAny(this, 'having', args);
        },
        window(...args) {
            return this.clone()._window(...args);
        },
        _window(...args) {
            return query_1.pushArrayAny(this, 'window', args);
        },
        union(...args) {
            return this.clone()._union(...args);
        },
        _union(...args) {
            return query_1.pushArrayAny(this, 'union', args);
        },
        unionAll(...args) {
            return this.clone()._unionAll(...args);
        },
        _unionAll(...args) {
            return query_1.pushArrayAny(this, 'unionAll', args);
        },
        intersect(...args) {
            return this.clone()._intersect(...args);
        },
        _intersect(...args) {
            return query_1.pushArrayAny(this, 'intersect', args);
        },
        intersectAll(...args) {
            return this.clone()._intersectAll(...args);
        },
        _intersectAll(...args) {
            return query_1.pushArrayAny(this, 'intersectAll', args);
        },
        except(...args) {
            return this.clone()._except(...args);
        },
        _except(...args) {
            return query_1.pushArrayAny(this, 'except', args);
        },
        exceptAll(...args) {
            return this.clone()._exceptAll(...args);
        },
        _exceptAll(...args) {
            return query_1.pushArrayAny(this, 'exceptAll', args);
        },
        limit(value) {
            return this.clone()._limit(value);
        },
        _limit(value) {
            return query_1.setNumber(this, 'limit', value);
        },
        offset(value) {
            return this.clone()._offset(value);
        },
        _offset(value) {
            return query_1.setNumber(this, 'offset', value);
        },
        for(value) {
            return this.clone()._for(value);
        },
        _for(value) {
            return query_1.setString(this, 'for', value);
        },
        exists() {
            return this.clone()._exists();
        },
        _exists() {
            query_1.setBoolean(this._value(), 'exists', true);
            return this;
        },
    };
    self.model = self;
    self.belongsTo = (fn, options) => relations_1.belongsTo(self, fn, options);
    self.hasOne = (fn, options) => relations_1.hasOne(self, fn, options);
    self.hasMany = (fn, options) => relations_1.hasMany(self, fn, options);
    self.hasAndBelongsToMany = (fn, options) => relations_1.hasAndBelongsToMany(self, fn, options);
    const thenAll = function (resolve, reject) {
        return this.db.query(this.toSql()).then(resolve, reject);
    };
    const thenOne = function (resolve, reject) {
        return this.db.query(this.toSql()).then(([record]) => resolve && resolve(record), reject);
    };
    const thenRows = function (resolve, reject) {
        return this.db.arrays(this.toSql()).then(resolve, reject);
    };
    const thenValue = function (resolve, reject) {
        return this.db.value(this.toSql()).then(resolve, reject);
    };
    const thenVoid = function (resolve, reject) {
        return this.db.exec(this.toSql()).then(resolve, reject);
    };
    self.then = thenAll;
    return self;
};
// porm.hidden = ({constructor: target}: any, key: string) => {
//   if (!target.hiddenColumns) target.hiddenColumns = []
//   target.hiddenColumns.push(key)
// }
exports.default = porm;
