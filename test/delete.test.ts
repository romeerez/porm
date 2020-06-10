import porm from '../src'
import db from './db'
import {line} from './utils'

const model = porm(db)
const User = model('users', class {})

describe('deleteAll', () => {
  it('deletes using query', () => {
    User.findBy('a = b').deleteAll('returning')
    expect(db.arrays).toBeCalledWith(line(`
      DELETE FROM "users"
      WHERE a = b
      LIMIT 1
      RETURNING returning
    `))
  })
})

describe('delete', () => {
  it('delete by id', () => {
    User.delete(1, 'id')
    expect(db.arrays).toBeCalledWith(line(`
      DELETE FROM "users"
      WHERE "users"."id" = 1
      RETURNING id
    `))
  })

  it('delete by array of ids', () => {
    User.delete([1, 2, 3], ['id', 'name'])
    expect(db.arrays).toBeCalledWith(line(`
      DELETE FROM "users"
      WHERE "users"."id" IN (1, 2, 3)
      RETURNING "id", "name"
    `))
  })

  it('delete by array of records', () => {
    User.delete([{id: 1}, {id: 2}, {id: 3}])
    expect(db.arrays).toBeCalledWith(line(`
      DELETE FROM "users"
      WHERE "users"."id" IN (1, 2, 3)
    `))
  })
})
