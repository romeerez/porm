const toSql = require('./toSql')
const associations = require('./associations')
const create = require('./create')
const {update} = require('./update')
const {delete: deleteRecord} = require('./delete')

const createQuery = (model, prev) => {
  const object = Object.create(model)
  const query = {}
  Object.assign(object, {model, __query: query})
  if (prev)
    for (let key in prev)
      if (Array.isArray(prev[key]))
        query[key] = [...prev[key]]
      else
        query[key] = prev[key]
  return object
}

const cloneMethod = (key) => {
  const modify = `_${key}`
  return function () {
    const query = this.clone()
    return query[modify].apply(query, arguments)
  }
}

const modifyMethod = (key) =>
  function (...args) {
    const query = this.toQuery()
    const q = query.__query
    if (q[key])
      q[key].push(...args)
    else
      q[key] = args
    return query
  }

const setValueMethod = (key) =>
  function (value) {
    const query = this.toQuery()
    const q = query.__query
    q[key] = value
    return query
  }

const pushArgs = (model, key, args) => {
  const query = model.toQuery()
  const q = query.__query
  if (q[key])
    q[key].push(...args)
  else
    q[key] = args
  return query
}

const setValue = (model, key, value) => {
  const query = model.toQuery()
  const q = query.__query
  q[key] = value
  return query
}

module.exports = {
  ...associations,
  associations: {},
  create, update, delete: deleteRecord,

  toQuery() {
    return this.__query ? this : createQuery(this)
  },

  setDefaultScope(scope) {
    this.toQuery = function() {
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

  clone() {
    return createQuery(this.model || this, this.__query)
  },

  toSql() {
    return toSql(this.toQuery())
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

  take: cloneMethod('take'),
  _take() {
    const query = this.toQuery()
    const q = query.__query
    q.take = true
    return this
  },

  resultType(type) {
    return this.clone()._resultType(type)
  },

  _resultType(type) {
    const query = this.toQuery()
    query.__query.type = type
    return query
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

    if (type === 'objects' && query.__query.take) {
      const original = resolve
      resolve = (result) => {
        original(result[0])
      }
    }

    return this.db[type](this.toSql()).then(resolve, reject)
  },

  as(as) {
    return this.clone()._as(as)
  },

  _as(as) {
    const query = this.toQuery()
    query.__query.as = as
    return query
  },

  distinct(...args) {
    return this.clone()._distinct(...args)
  },

  _distinct(...args) {
    if (args[0] === false)
      this.__query && delete this.__query.distinct
    else
      return pushArgs(this, 'distinct', args)
  },

  distinctRaw(...args) {
    return this.clone()._distinctRaw(...args)
  },

  _distinctRaw(...args) {
    if (args[0] === false)
      this.__query && delete this.__query.distinctRaw
    else
      return pushArgs(this, 'distinctRaw', args)
  },

  select(...args) {
    return this.clone()._select(...args)
  },

  _select(...args) {
    return pushArgs(this, 'select', args)
  },

  selectRaw(...args) {
    return this.clone()._selectRaw(...args)
  },

  _selectRaw(...args) {
    return pushArgs(this, 'selectRaw', args)
  },

  from(source) {
    return this.clone()._from(source)
  },

  _from(source) {
    return setValue(this, 'from', source)
  },

  where(...args) {
    return this.and(...args)
  },

  _where(...args) {
    return pushArgs(this, 'and', args)
  },

  and(...args) {
    return this.clone()._and(...args)
  },

  _and(...args) {
    return pushArgs(this, 'and', args)
  },

  or(...args) {
    return this.clone()._or(...args)
  },

  _or(...args) {
    return pushArgs(this, 'or', args)
  },

  group(...args) {
    return this.clone()._group(...args)
  },

  _group(...args) {
    return pushArgs(this, 'group', args)
  },

  groupRaw(...args) {
    return this.clone()._groupRaw(...args)
  },

  _groupRaw(...args) {
    return pushArgs(this, 'groupRaw', args)
  },

  having(...args) {
    return this.clone()._having(...args)
  },

  _having(...args) {
    return pushArgs(this, 'having', args)
  },

  window(...args) {
    return this.clone()._window(...args)
  },

  _window(...args) {
    return pushArgs(this, 'window', args)
  },

  union(...args) {
    return this.clone()._union(...args)
  },

  _union(...args) {
    return pushArgs(this, 'union', args)
  },

  unionAll(...args) {
    return this.clone()._unionAll(...args)
  },

  _unionAll(...args) {
    return pushArgs(this, 'unionAll', args)
  },

  intersect(...args) {
    return this.clone()._intersect(...args)
  },

  _intersect(...args) {
    return pushArgs(this, 'intersect', args)
  },

  intersectAll(...args) {
    return this.clone()._intersectAll(...args)
  },

  _intersectAll(...args) {
    return pushArgs(this, 'intersectAll', args)
  },

  except(...args) {
    return this.clone()._except(...args)
  },

  _except(...args) {
    return pushArgs(this, 'except', args)
  },

  exceptAll(...args) {
    return this.clone()._exceptAll(...args)
  },

  _exceptAll(...args) {
    return pushArgs(this, 'exceptAll', args)
  },

  order(...args) {
    return this.clone()._order(...args)
  },

  _order(...args) {
    return pushArgs(this, 'order', args)
  },

  orderRaw(...args) {
    return this.clone()._orderRaw(...args)
  },

  _orderRaw(...args) {
    return pushArgs(this, 'orderRaw', args)
  },

  limit(value) {
    return this.clone()._limit(value)
  },

  _limit(value) {
    return setValue(this, 'limit', value)
  },

  offset(value) {
    return this.clone()._offset(value)
  },

  _offset(value) {
    return setValue(this, 'offset', value)
  },

  for(value) {
    return this.clone()._for(value)
  },

  _for(value) {
    return setValue(this, 'for', value)
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
    return setValue(this._value(), 'exists', true)
  }
}
