import {Adapter} from 'pg-adapter'

export default {
  objects: jest.fn(() => ({then: () => {}})),
  arrays: jest.fn(() => ({then: () => {}})),
  value: jest.fn(() => ({then: () => {}})),
  exec: jest.fn(() => ({then: () => {}})),
} as unknown as Adapter
