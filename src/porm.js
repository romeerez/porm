const {plural} = require('pluralize')
const base = require('./lib/base')
const associations = require('./lib/associations')

const models = (db, object) => {
  if (!db.base) {
    db.base = Object.create(base)
    db.base.db = db
  }
  if (!db.modelByTable) db.modelByTable = {}

  for (let name in object) {
    const mod = object[name].isModel ? object[name] : model(name, object[name])
    db.modelByTable[mod.table] = mod
    db[name] = mod
    mod.db = db
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

const model = (name, object) => {
  const model = Object.create(base)
  model.isModel = true

  if (!object.table)
    model.table = plural(name)

  if (!object.primaryKey)
    model.primaryKey = 'id'

  Object.assign(model, object)

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
