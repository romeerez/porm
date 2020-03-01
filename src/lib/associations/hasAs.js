const {noopScope, createProxy} = require('./utils')

exports.hasAs = (self, model, as, foreignKey, scope, primaryKey, foreignType, take) => {
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
