const {singular} = require('pluralize')
const {noopScope, createProxy} = require('./utils')

exports.hasOneOrMany = (
  self, model, foreignKey, name, source, scope, primaryKey, foreignType, take
) => {
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
