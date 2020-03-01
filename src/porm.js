const {plural} = require('pluralize')
const base = require('./lib/base')
const associations = require('./lib/associations')

const models = (db, object) => {
  db.base = base
  if (!db.modelByTable) db.modelByTable = {}

  for (let key in object) {
    db[key] = model(db, key, object[key])
  }

  [false, true].forEach(loadThrough => {
    for (let modelName in object) {
      const model = db[modelName]
      for (let key in model) {
        const method = model[key]
        if (method && !method.subquery && method.association && (!method.through || loadThrough)) {
          model[key] = method(db, model, key)
        }
      }
    }
  })

  return db
}

const model = (db, name, object) => {
  const model = Object.create(base)
  model.db = db

  if (!object.table)
    model.table = plural(name)

  if (!object.primaryKey)
    model.primaryKey = 'id'

  Object.assign(model, object)
  db.modelByTable[model.table] = model
  model.quotedTable = `"${model.table}"`

  if (object.defaultScope)
    model.setDefaultScope(object.defaultScope)

  const {scopes} = model
  if (scopes) {
    for (let key in scopes)
      model[key] = function(...args) {
        return scopes[key](this, ...args)
      }
  }

  return model
}

module.exports = {models, model, base, ...associations}
