import {Adapter} from 'pg-adapter'
import {Model} from './model'

const getDb = (models: Record<string, Model<any>>) => {
  for (let key in models)
    return models[key].db
}

export const transaction = <T extends Record<string, Model<any>>>(models: T, fn: (models: T) => Promise<any>) => {
  const db = getDb(models) as Adapter
  return db.transaction(async transaction => {
    const transactionModels: typeof models = {} as T
    for (let key in models) {
      const model = Object.create(models[key])
      model.db = transaction
      transactionModels[key] = model
    }

    await fn(transactionModels)
  })
}