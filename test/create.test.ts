import porm from '../src'
import db from './db'
import {line} from './utils'

const model = porm(db)
const User = model('users', class {name: string; role: string})

describe('create', () => {
  it('creates one record', () => {
    User.create({name: 'vasya', role: 'user'})
    expect(db.arrays).toBeCalledWith(line(`
      INSERT INTO "users" ("name", "role")
      VALUES ('vasya', 'user')
      RETURNING "id"
    `))
  })

  it('creates multiple records', () => {
    User.create([{name: 'vasya', role: 'user'}, {name: 'petya', role: 'admin'}])
    expect(db.arrays).toBeCalledWith(line(`
      INSERT INTO "users" ("name", "role")
      VALUES ('vasya', 'user'), ('petya', 'admin')
      RETURNING "id"
    `))
  })

  it('creates record with custom returning', () => {
    User.create({name: 'vasya', role: 'user'}, 'custom')
    expect(db.arrays).toBeCalledWith(line(`
      INSERT INTO "users" ("name", "role")
      VALUES ('vasya', 'user')
      RETURNING custom
    `))
  })

  it('creates record with returning of columns', () => {
    User.create({name: 'vasya', role: 'user'}, ['id', 'name'])
    expect(db.arrays).toBeCalledWith(line(`
      INSERT INTO "users" ("name", "role")
      VALUES ('vasya', 'user')
      RETURNING "id", "name"
    `))
  })
})
