const {plural, singular} = require('pluralize')
const {init} = require('./associations/utils')
const {hasAs} = require('./associations/hasAs')
const {belongsTo} = require('./associations/belongsTo')
const {hasThrough} = require('./associations/hasThrough')
const {hasOneOrMany} = require('./associations/hasOneOrMany')
const {hasAndBelongsToMany} = require('./associations/hasAndBelongsToMany')

module.exports = {
  belongsTo: ({model, scope, primaryKey, foreignKey, polymorphic} = {}) =>
    init((db, self, name) => {
      if (model) name = model
      else if (!polymorphic && !db[name]) name = plural(name)
      return belongsTo(db, self, db[name], scope, foreignKey, name, true, primaryKey, polymorphic)
    }),

  hasOne: ({model, scope, through, source, primaryKey, foreignKey, as, foreignType} = {}) =>
    init((db, self, name) => {
      if (model) name = model
      else if (!as && !through && !(db[name] && db[name].table)) name = plural(name)
      if (through) {
        const {sourceModel} = self[through]
        if (source) name = source
        else if (!sourceModel[name]) name = singular(name)
        const sourceQuery = sourceModel[name]
        return hasThrough(self, self[through], sourceQuery, scope, true)
      }
      if (as)
        return hasAs(self, db[name], as, foreignKey, scope, primaryKey, foreignType, true)
      return hasOneOrMany(self, db[name], foreignKey, name, source, scope, primaryKey, foreignType, true)
    }, through),

  hasMany: ({model, scope, through, source, primaryKey, foreignKey, as, foreignType} = {}) =>
    init((db, self, name) => {
      if (model) name = model
      else if (!as && !through && !db[name]) name = plural(name)
      if (through) {
        const {sourceModel} = self[through]
        if (source) name = source
        else if (!sourceModel[name]) name = singular(name)
        const sourceQuery = sourceModel[name]
        return hasThrough(self, self[through], sourceQuery, scope)
      }
      if (as)
        return hasAs(self, db[name], as, foreignKey, scope, primaryKey, foreignType)
      return hasOneOrMany(self, db[name], foreignKey, name, source, scope, primaryKey, foreignType)
    }, through),

  hasAndBelongsToMany: ({
    model,
    scope,
    joinTable,
    foreignKey,
    associationForeignKey
  } = {}) =>
    init((db, self, name) =>
      hasAndBelongsToMany(db, self, name, model, scope, joinTable, foreignKey, associationForeignKey)
    ),
}
