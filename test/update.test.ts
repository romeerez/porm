import porm from '../src'
import db from './db'
import {line} from './utils'

const model = porm(db)

const User = model('users', class {})

describe('updateAll', () => {
  it('updates using query', () => {
    User.where('a = b').updateAll({name: 'vasya', role: 'user'})
    expect(db.arrays).toBeCalledWith(line(`
      UPDATE "users"
      SET "users"."name" = 'vasya', "users"."role" = 'user'
      WHERE a = b
    `))
  })

  it('updates with custom set', () => {
    User.updateAll('a = b')
    expect(db.arrays).toBeCalledWith(line(`
      UPDATE "users"
      SET a = b
    `))
  })
})

describe('update', () => {
  it('update by id number', () => {
    User.update(1, {name: 'vasya', role: 'user'})
    expect(db.arrays).toBeCalledWith(line(`
      UPDATE "users"
      SET "users"."name" = 'vasya', "users"."role" = 'user'
      WHERE "users"."id" = 1
    `))
  })

  it('update by id in object', () => {
    User.update({id: 1}, {name: 'vasya', role: 'user'})
    expect(db.arrays).toBeCalledWith(line(`
      UPDATE "users"
      SET "users"."name" = 'vasya', "users"."role" = 'user'
      WHERE "users"."id" = 1
    `))
  })

  it('update custom set', () => {
    User.update(1, 'a = b')
    expect(db.arrays).toBeCalledWith(line(`
      UPDATE "users"
      SET a = b
      WHERE "users"."id" = 1
    `))
  })
})
