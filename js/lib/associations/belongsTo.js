const {singular} = require('pluralize')
const {createProxy} = require('./utils')

exports.belongsTo = (db, self, model, scope, foreignKey, name, take, primaryKey, polymorphic) => {
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
