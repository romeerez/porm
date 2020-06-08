import {Adapter} from 'pg-adapter'
import {Definition, Model} from './types'
import {prototype} from './lib/prototype'
// import {relation} from './lib/relation'

export const model = <T>(db: Adapter, table: string, def: Definition = {}): Model => {
  // const {relations} = def
  const model = Object.create(prototype)
  model.db = db
  model.table = def.table || table
  model.quotedTable = `"${model.table}"`
  model.primaryKey = def.primaryKey || 'id'
  // if (relations)
  //   Object.keys(relations).forEach(as => {
  //     model[as] = relation(model, as, relations[as])
  //   })
  return model
}
