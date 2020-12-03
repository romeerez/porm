import porm from '../src'
import db from './db'
import {line} from './utils'

const model = porm(db)

const User = model('users');
(User as any).columns = () => ({})

const WithUpdatedAt = model<{updatedAt: Date}>('users');
(WithUpdatedAt as any).columns = () => ({updatedAt: {}})

describe('updateAll', () => {
  it('updates using query', async () => {
    await User.where('a = b').updateAll({name: 'vasya', role: 'user'})
    expect(db.arrays).toBeCalledWith(line(`
      UPDATE "users"
      SET "name" = 'vasya', "role" = 'user'
      WHERE a = b
    `))
  })

  it('updates with custom set', async () => {
    await User.updateAll('a = b')
    expect(db.arrays).toBeCalledWith(line(`
      UPDATE "users"
      SET a = b
    `))
  })
})

describe('update', () => {
  it('update by id number', async () => {
    await User.update(1, {name: 'vasya', role: 'user'})
    expect(db.arrays).toBeCalledWith(line(`
      UPDATE "users"
      SET "name" = 'vasya', "role" = 'user'
      WHERE "users"."id" = 1
    `))
  })

  it('update by id in object', async () => {
    const object: any = {id: 1}
    await WithUpdatedAt.update(object, {name: 'vasya', role: 'user'})
    expect(db.arrays).toBeCalledWith(line(`
      UPDATE "users"
      SET
        "name" = 'vasya',
        "role" = 'user',
        "updatedAt" = '${object.updatedAt.toISOString()}'
      WHERE "users"."id" = 1
    `))
  })

  it('update custom set', async () => {
    await User.update(1, 'a = b')
    expect(db.arrays).toBeCalledWith(line(`
      UPDATE "users"
      SET a = b
      WHERE "users"."id" = 1
    `))
  })
})
