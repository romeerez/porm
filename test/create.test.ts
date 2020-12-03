import porm from '../src'
import db from './db'
import {line} from './utils'

const model = porm(db)
const User = model<{id: number; name: string; role: string}>('users');
(User as any).columnsPromise = {}

const WithCreatedAt = model<{id: number; name: string; role: string; createdAt: Date}>('users');
(WithCreatedAt as any).columns = () => ({createdAt: {}})

const WithUpdatedAt = model<{id: number; name: string; role: string; updatedAt: Date}>('users');
(WithUpdatedAt as any).columns = () => ({updatedAt: {}})

const WithBoth = model<{id: number; name: string; role: string; createdAt: Date; updatedAt: Date}>('users');
(WithBoth as any).columns = () => ({createdAt: {}, updatedAt: {}})

describe('create', () => {
  describe('one record', () => {
    let arrays: any
    beforeAll(() => {
      arrays = db.arrays;
      (db as any).arrays = jest.fn(() => [[1]])
    })
    afterAll(() => {
      (db as any).arrays = arrays
    })

    it('creates one record', async () => {
      const user = await User.create({name: 'vasya', role: 'user'})
      expect(db.arrays).toBeCalledWith(line(`
        INSERT INTO "users" ("name", "role")
        VALUES ('vasya', 'user')
        RETURNING "id"
      `))
      expect(user.id).toBe(1)
    })

    it('creates one record with createdAt', async () => {
      const user = await WithCreatedAt.create({name: 'vasya', role: 'user'})
      expect(db.arrays).toBeCalledWith(line(`
        INSERT INTO "users" ("name", "role", "createdAt")
        VALUES ('vasya', 'user', '${user.createdAt.toISOString()}')
        RETURNING "id"
      `))
      expect(user.id).toBe(1)
    })

    it('creates one record with updatedAt', async () => {
      const user = await WithUpdatedAt.create({name: 'vasya', role: 'user'})
      expect(db.arrays).toBeCalledWith(line(`
        INSERT INTO "users" ("name", "role", "updatedAt")
        VALUES ('vasya', 'user', '${user.updatedAt.toISOString()}')
        RETURNING "id"
      `))
      expect(user.id).toBe(1)
    })

    it('creates one record with both', async () => {
      const user = await WithBoth.create({name: 'vasya', role: 'user'})
      expect(db.arrays).toBeCalledWith(line(`
        INSERT INTO "users" ("name", "role", "createdAt", "updatedAt")
        VALUES ('vasya', 'user', '${user.createdAt.toISOString()}', '${user.updatedAt.toISOString()}')
        RETURNING "id"
      `))
      expect(user.id).toBe(1)
    })

    // it('creates record with custom returning', async () => {
    //   await User.create({name: 'vasya', role: 'user'}, 'custom')
    //   expect(db.arrays).toBeCalledWith(line(`
    //     INSERT INTO "users" ("name", "role")
    //     VALUES ('vasya', 'user')
    //     RETURNING custom
    //   `))
    // })

    it('creates record with returning of columns', async () => {
      await User.create({name: 'vasya', role: 'user'}, ['id', 'name'])
      expect(db.arrays).toBeCalledWith(line(`
        INSERT INTO "users" ("name", "role")
        VALUES ('vasya', 'user')
        RETURNING "id", "name"
      `))
    })
  })

  describe('multiple records', () => {
    let arrays: any
    beforeAll(() => {
      arrays = db.arrays;
      (db as any).arrays = jest.fn(() => [[1], [2]])
    })
    afterAll(() => {
      (db as any).arrays = arrays
    })

    it('creates multiple records', async () => {
      const users = await User.create([{name: 'vasya', role: 'user'}, {name: 'petya', role: 'admin'}])
      expect(db.arrays).toBeCalledWith(line(`
        INSERT INTO "users" ("name", "role")
        VALUES ('vasya', 'user'), ('petya', 'admin')
        RETURNING "id"
      `))
      expect(users.map(({id}) => id)).toEqual([1, 2])
    })

    it('creates multiple records with createdAt', async () => {
      const users = await WithCreatedAt.create([{name: 'vasya', role: 'user'}, {name: 'petya', role: 'admin'}])
      const date = users[0].createdAt.toISOString()
      expect(db.arrays).toBeCalledWith(line(`
        INSERT INTO "users" ("name", "role", "createdAt")
        VALUES ('vasya', 'user', '${date}'), ('petya', 'admin', '${date}')
        RETURNING "id"
      `))
      expect(users.map(({id}) => id)).toEqual([1, 2])
    })

    it('creates multiple records with updatedAt', async () => {
      const users = await WithUpdatedAt.create([{name: 'vasya', role: 'user'}, {name: 'petya', role: 'admin'}])
      const date = users[0].updatedAt.toISOString()
      expect(db.arrays).toBeCalledWith(line(`
        INSERT INTO "users" ("name", "role", "updatedAt")
        VALUES ('vasya', 'user', '${date}'), ('petya', 'admin', '${date}')
        RETURNING "id"
      `))
      expect(users.map(({id}) => id)).toEqual([1, 2])
    })

    it('creates multiple records with both', async () => {
      const users = await WithBoth.create([{name: 'vasya', role: 'user'}, {name: 'petya', role: 'admin'}])
      const date = users[0].createdAt.toISOString()
      expect(db.arrays).toBeCalledWith(line(`
        INSERT INTO "users" ("name", "role", "createdAt", "updatedAt")
        VALUES ('vasya', 'user', '${date}', '${date}'), ('petya', 'admin', '${date}', '${date}')
        RETURNING "id"
      `))
      expect(users.map(({id}) => id)).toEqual([1, 2])
    })
  })
})
