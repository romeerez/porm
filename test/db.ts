import {Adapter} from 'pg-adapter'

const prepareQuery = jest.fn()

export default {
  objects: jest.fn(() => ({then: (resolve: any) => resolve()})),
  query: jest.fn(() => ({then: (resolve: any) => resolve()})),
  arrays: jest.fn(() => ({then: (resolve: any) => resolve()})),
  value: jest.fn(() => ({then: (resolve: any) => resolve()})),
  exec: jest.fn(() => ({then: (resolve: any) => resolve()})),
  prepare: jest.fn((name: string, ...args: string[]) => () => ({
    query: prepareQuery
  })),
  prepareQuery,
} as unknown as Adapter & {prepareQuery: (...args: any) => any}
