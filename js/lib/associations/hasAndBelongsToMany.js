const {plural} = require('pluralize')
const {belongsTo} = require('./belongsTo')
const {hasOneOrMany} = require('./hasOneOrMany')
const {hasThrough} = require('./hasThrough')

exports.hasAndBelongsToMany = (db, self, name, model, scope, joinTable, foreignKey, associationForeignKey) => {
  if (model)
    model = db[model]
  else if (db[name])
    model = db[name]
  else
    model = db[plural(name)]

  const joinModel = Object.create(db.base)
  joinModel.table = joinTable || [self.table, model.table].sort().join('_')
  joinModel.quotedTable = `"${joinModel.table}"`

  const sourceQuery = belongsTo(
    db, joinModel, model, scope, associationForeignKey
  )

  const joinQuery = hasOneOrMany(
    self, joinModel, foreignKey
  )

  return hasThrough(self, joinQuery, sourceQuery)
}
