import {Adapter} from 'pg-adapter'

const prepareQuery = jest.fn()

const db = {
  objects: jest.fn(() => ({then: (resolve: any) => resolve()})),
  query: jest.fn(() => ({then: (resolve: any) => resolve()})),
  arrays: jest.fn(() => ({then: (resolve: any) => resolve()})),
  value: jest.fn(() => ({then: (resolve: any) => resolve()})),
  exec: jest.fn(() => ({then: (resolve: any) => resolve()})),
  prepare: jest.fn((name: string, ...args: string[]) => () => ({
    query: prepareQuery
  })),
  prepareQuery,
  transaction: jest.fn(async (fn: (transaction: any) => any) => {
    db.exec('BEGIN')
    const transaction = Object.create(db)
    await fn(db)
    db.exec('COMMIT')
  })
} as unknown as Adapter & {prepareQuery: (...args: any) => any}

export default db
