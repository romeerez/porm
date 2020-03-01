const {singular} = require('pluralize')

const init = (fn, through) => {
  fn.association = true
  fn.through = through
  return fn
}

const noopScope = q => q

const createProxy = (self, query, subquery, take, sourceModel) => {
  query.__subquery = subquery
  query.associationTake = take
  query.sourceModel = sourceModel

  return new Proxy(query, {
    get: (target, name) => name in query ? query[name] : subquery()[name]
  })
}

const hasThrough = (self, joinQuery, sourceQuery, scope, take) => {
  if (!scope) scope = noopScope

  let q = sourceQuery
  if (take) q = q.take()
  else q = q.all()

  const query = (record) =>
    scope(q.join(joinQuery(record)))

  const subquery = () =>
    scope(q.join(joinQuery.__subquery()))

  return createProxy(self, query, subquery, take, sourceQuery.sourceModel)
}

const belongsTo = (db, self, model, name, scope, foreignKey, take, primaryKey, polymorphic) => {
  if (polymorphic) {
    const query = (record) => {
      const model = db.modelByTable[record[`${name}_type`]]
      return model.find(record[`${name}_id`])
    }
    return query
  }

  const table = model.table
  if (!primaryKey) primaryKey = model.primaryKey
  let fk = foreignKey || `${singular(table)}_${primaryKey}`
  const selfTable = self.table

  let q = take ? model.take() : model.toQuery()
  if (!scope) scope = q => q

  const query = (record) => {
    const scoped = scope(q)
    const pk = `"${model.table}"."${primaryKey}"`
    return scoped.where(`${pk} = ${record[fk]}`)
  }

  const subquery = () => {
    const scoped = scope(q)
    const pk = `"${model.table}"."${primaryKey}"`
    return scoped.where(`${pk} = "${selfTable}"."${fk}"`)
  }

  return createProxy(self, query, subquery, take, model)
}

const hasOneOrMany = (
  self, model, foreignKey, name, through, scope, primaryKey, as, foreignType, take
) => {
  if (through) {
    const sourceQuery = self[through].sourceModel[name]
    return hasThrough(self, self[through], sourceQuery, scope, take)
  } else if (as) {
    let q = take ? model.take() : model.toQuery()
    if (!scope) scope = noopScope

    if (!primaryKey) primaryKey = self.primaryKey
    if (!foreignKey) foreignKey = `${as}_${primaryKey}`
    if (!foreignType) foreignType = `${as}_type`
    const type = self.table

    const query = (record) => {
      const scoped = scope(q)
      const fk = `"${model.table}"."${foreignKey}"`
      const ft = `"${model.table}"."${foreignType}"`
      return scoped.where(`${fk} = ${record[primaryKey]} AND ${ft} = '${type}'`)
    }

    const subquery = () => {
      const scoped = scope(q)
      const fk = `"${model.table}"."${foreignKey}"`
      const ft = `"${model.table}"."${foreignType}"`
      return scoped.where(`${fk} = ${self.quotedTable}."${primaryKey}" AND ${ft} = '${type}'`)
    }

    return createProxy(self, query, subquery, take, model)
  }

  const table = self.table
  if (!primaryKey) primaryKey = self.primaryKey
  if (!foreignKey) foreignKey = `${singular(table)}_${primaryKey}`

  let q = take ? model.take() : model.toQuery()
  if (!scope) scope = noopScope

  const query = (record) => {
    const scoped = scope(q)
    const fk = `"${model.table}"."${foreignKey}"`
    return scoped.where(`${fk} = ${record[primaryKey]}`)
  }

  const subquery = () => {
    const scoped = scope(q)
    const fk = `"${model.table}"."${foreignKey}"`
    return scoped.where(`${fk} = ${self.quotedTable}."${primaryKey}"`)
  }

  return createProxy(self, query, subquery, take, model)
}

module.exports = {
  belongsTo: (name, {scope, primaryKey, foreignKey, polymorphic} = {}) =>
    init((db, self) =>
      belongsTo(db, self, db[name], name, scope, foreignKey, true, primaryKey, polymorphic)
    ),

  hasOne: (name, {scope, through, primaryKey, foreignKey, as, foreignType} = {}) =>
    init((db, self) =>
      hasOneOrMany(
        self, db[name], foreignKey, name, through, scope, primaryKey, as, foreignType, true
      ),
      through
    ),

  hasMany: (name, {scope, through, primaryKey, foreignKey, as, foreignType} = {}) =>
    init((db, self) =>
      hasOneOrMany(self, db[name], foreignKey, name, through, scope, primaryKey, as, foreignType),
      through
    ),

  hasAndBelongsToMany: (source, {
    scope,
    joinTable,
    foreignKey,
    associationForeignKey
  } = {}) =>
    init((db, self) => {
      const model = db[source]
      const joinModel = Object.create(db.base)
      joinModel.table = joinTable || [self.table, model.table].sort().join('_')
      joinModel.quotedTable = `"${joinModel.table}"`

      const sourceQuery = belongsTo(
        db, joinModel, model, source, scope, associationForeignKey
      )

      const joinQuery = hasOneOrMany(
        self, joinModel, foreignKey
      )

      return hasThrough(self, joinQuery, sourceQuery)
    }),
}
