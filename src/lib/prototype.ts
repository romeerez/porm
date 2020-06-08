import {MQ, Prototype, QueryDataArrayAny, QueryDataBoolean, QueryDataNumber, QueryDataString} from "../types"
import {toSql} from './sql'
import {createQuery, pushArrayAny, setString, setNumber, setBoolean} from './queryUtils'

export const prototype: Prototype = {
  model: undefined,
  __query: undefined,

  setDefaultScope(scope) {
    this.toQuery = function(this: MQ) {
      return this.__query ? this : scope(createQuery(this))
    }
  },

  unscoped() {
    return createQuery(this)
  },

  all() {
    if (this.__query && this.__query.take)
      return this.clone()._all()
    return this.toQuery()
  },
  _all() {
    const query = this.toQuery()
    delete query.__query.take
    return query
  },

  toQuery() {
    return this.__query ? this : createQuery(this)
  },

  clone() {
    return createQuery(this.model || this, this.__query)
  },

  toSql() {
    return toSql(this.toQuery())
  },

  resultType(type) {
    return this.clone()._resultType(type)
  },

  _resultType(type) {
    const query = this.toQuery()
    query.__query.type = type
    return query
  },

  query() {
    return this.resultType('objects')
  },
  _query() {
    return this._resultType('objects')
  },

  objects() {
    return this.resultType('objects')
  },
  _objects() {
    return this._resultType('objects')
  },

  arrays() {
    return this.resultType('arrays')
  },
  _arrays() {
    return this._resultType('arrays')
  },

  value() {
    return this.resultType('value')
  },
  _value() {
    return this._resultType('value')
  },

  exec() {
    return this.resultType('exec')
  },
  _exec() {
    return this._resultType('exec')
  },

  then(resolve, reject) {
    const query = this.toQuery()

    const type = query.__query.type || 'objects'

    if ((type === 'objects' || type === 'arrays') && query.__query.take) {
      const original = resolve
      resolve = (result: any[]) => {
        original(result[0])
      }
    }

    return (this.db as any)[type](this.toSql()).then(resolve, reject)
  },

  take() {
    return this.clone()._take()
  },
  _take() {
    return setBoolean(this, 'take', true)
  },

  and(...args) {
    return this.clone()._and(...args)
  },
  _and(...args) {
    return pushArrayAny(this, 'and', args)
  },

  or(...args) {
    return this.clone()._or(...args)
  },
  _or(...args) {
    return pushArrayAny(this, 'or', args)
  },

  where(...args) {
    return this.clone()._and(...args)
  },
  _where(...args) {
    return pushArrayAny(this, 'and', args)
  },

  find(id) {
    return this.clone()._find(id)
  },
  _find(id) {
    return this._where({[this.primaryKey]: id})._take()
  },

  findBy(...args) {
    return this.clone()._findBy(...args)
  },
  _findBy(...args) {
    return this._where(...args)._take()
  },

  distinct(...args) {
    return this.clone()._distinct(...args)
  },
  _distinct(...args) {
    if (args[0] === false) {
      this.__query && delete this.__query.distinct
      return this.toQuery()
    }
    return pushArrayAny(this, 'distinct', args)
  },

  distinctRaw(...args) {
    return this.clone()._distinctRaw(...args)
  },
  _distinctRaw(...args) {
    if (args[0] === false) {
      this.__query && delete this.__query.distinctRaw
      return this.toQuery()
    }
    return pushArrayAny(this, 'distinctRaw', args)
  },

  select(...args) {
    return this.clone()._select(...args)
  },
  _select(...args) {
    return pushArrayAny(this, 'select', args)
  },

  selectRaw(...args) {
    return this.clone()._selectRaw(...args)
  },
  _selectRaw(...args) {
    return pushArrayAny(this, 'selectRaw', args)
  },

  from(source) {
    return this.clone()._from(source)
  },
  _from(source) {
    return setString(this, 'from', source)
  },

  as(as) {
    return this.clone()._as(as)
  },
  _as(as) {
    return setString(this, 'as', as)
  },

  wrap(query, as = 't') {
    return this.clone()._wrap(query.clone(), as)
  },
  _wrap(query, as = 't') {
    return query._as(as)._from(`(${this.toQuery().toSql()})`)
  },

  json() {
    return this.clone()._json()
  },
  _json() {
    const query = this.toQuery()
    const q = query.__query
    let sql
    if (q.take)
      sql = `COALESCE(row_to_json("t".*), '{}') AS json`
    else
      sql = `COALESCE(json_agg(row_to_json("t".*)), '[]') AS json`
    return this._wrap(query.model.selectRaw(sql))._value()
  },

  group(...args) {
    return this.clone()._group(...args)
  },
  _group(...args) {
    return pushArrayAny(this, 'group', args)
  },

  groupRaw(...args) {
    return this.clone()._groupRaw(...args)
  },
  _groupRaw(...args) {
    return pushArrayAny(this, 'groupRaw', args)
  },

  having(...args) {
    return this.clone()._having(...args)
  },
  _having(...args) {
    return pushArrayAny(this, 'having', args)
  },

  window(...args) {
    return this.clone()._window(...args)
  },
  _window(...args) {
    return pushArrayAny(this, 'window', args)
  },

  union(...args) {
    return this.clone()._union(...args)
  },
  _union(...args) {
    return pushArrayAny(this, 'union', args)
  },

  unionAll(...args) {
    return this.clone()._unionAll(...args)
  },
  _unionAll(...args) {
    return pushArrayAny(this, 'unionAll', args)
  },

  intersect(...args) {
    return this.clone()._intersect(...args)
  },
  _intersect(...args) {
    return pushArrayAny(this, 'intersect', args)
  },

  intersectAll(...args) {
    return this.clone()._intersectAll(...args)
  },
  _intersectAll(...args) {
    return pushArrayAny(this, 'intersectAll', args)
  },

  except(...args) {
    return this.clone()._except(...args)
  },
  _except(...args) {
    return pushArrayAny(this, 'except', args)
  },

  exceptAll(...args) {
    return this.clone()._exceptAll(...args)
  },
  _exceptAll(...args) {
    return pushArrayAny(this, 'exceptAll', args)
  },

  order(...args) {
    return this.clone()._order(...args)
  },
  _order(...args) {
    return pushArrayAny(this, 'order', args)
  },

  orderRaw(...args) {
    return this.clone()._orderRaw(...args)
  },
  _orderRaw(...args) {
    return pushArrayAny(this, 'orderRaw', args)
  },

  limit(value) {
    return this.clone()._limit(value)
  },
  _limit(value) {
    return setNumber(this, 'limit', value)
  },

  offset(value) {
    return this.clone()._offset(value)
  },
  _offset(value) {
    return setNumber(this, 'offset', value)
  },

  for(value) {
    return this.clone()._for(value)
  },
  _for(value) {
    return setString(this, 'for', value)
  },

  join(...args) {
    return this.clone()._join(...args)
  },
  _join(...args) {
    const query = this.toQuery()
    const q = query.__query
    if (q.join)
      q.join.push(args)
    else
      q.join = [args]
    return query
  },

  exists() {
    return this.clone()._exists()
  },
  _exists() {
    return setBoolean(this._value(), 'exists', true)
  },
}
