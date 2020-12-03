import { Adapter } from 'pg-adapter'

const getDb = (models: Record<string, { db: Adapter }>) => {
  for (const key in models) return models[key].db
}

export const transaction = <T extends Record<string, { db: Adapter }>>(
  models: T,
  fn: (models: T) => Promise<unknown>,
) => {
  const db = getDb(models) as Adapter
  return db.transaction(async (transaction) => {
    const transactionModels: typeof models = {} as T
    for (const key in models) {
      const model = Object.create(models[key])
      model.db = transaction
      transactionModels[key] = model
    }

    await fn(transactionModels)
  })
}
