import porm from '../src'
import db from './db'
import {line} from './utils'

const model = porm(db)

const ProfileModel = model('profiles', class {id: number; userId: number})

const UserModel = model('users', class {id: number})

const Profile = ProfileModel.relations(({belongsTo}) => ({
  user: belongsTo((params: {userId: number}) => UserModel)
}))

export const User = UserModel.relations(({hasOne}) => ({
  profile: hasOne((params: {id: number}) => Profile),
}))

describe('include', () => {
  describe('belongs to', () => {
    describe('string argument', () => {
      const expected = `
        SELECT "profiles".*, (
          SELECT COALESCE(row_to_json("t".*), '{}') AS json FROM (
            SELECT "users".*
            FROM "users"
            WHERE "users"."id" = "profiles"."userId"
            LIMIT 1
          ) "t"
        ) AS "user"
        FROM "profiles"
      `

      it('includes by string argument', async () => {
        expect(await Profile.include('user').toSql()).toBe(line(expected))
      })

      it('has modifier', async () => {
        const q = Profile.all()
        q._include('user')
        expect(await q.toSql()).toBe(line(expected))
      })
    })

    describe('object argument', () => {
      const expected = `
        SELECT "profiles".*, (
          SELECT COALESCE(row_to_json("t".*), '{}') AS json FROM (
            SELECT "users".*
            FROM "users"
            WHERE "users"."id" = "profiles"."userId"
            LIMIT 1
          ) "t"
        ) AS "customName"
        FROM "profiles"
      `

      it('includes relation with custom key', async () => {
        expect(await Profile.include({user: 'customName'}).toSql()).toBe(line(expected))
      })

      it('has modifier', async () => {
        const q = Profile.all()
        q._include({user: 'customName'})
        expect(await q.toSql()).toBe(line(expected))
      })
    })

    describe('object argument with query', () => {
      const expected = `
        SELECT "profiles".*, (
          SELECT COALESCE(row_to_json("t".*), '{}') AS json FROM (
            SELECT "customName".*
            FROM "users" "customName"
            WHERE a = b AND "customName"."id" = "profiles"."userId"
            LIMIT 1
          ) "t"
        ) AS "customName"
        FROM "profiles"
      `

      it('includes relation with query', async () => {
        expect(
          await Profile.include({user: User.as('customName').where('a = b')}).toSql()
        ).toBe(line(expected))
      })

      // it('has modifier', async () => {
      //   const q = Profile.all()
      //   q._include({profile: User.as('customName').where('a = b')})
      //   expect(await q.toSql()).toBe(line(expected))
      // })
    })
  })

  describe('has one', () => {
    describe('string argument', () => {
      const expected = `
        SELECT "users".*, (
          SELECT COALESCE(row_to_json("t".*), '{}') AS json FROM (
            SELECT "profiles".*
            FROM "profiles"
            WHERE "profiles"."userId" = "users"."id"
            LIMIT 1
          ) "t"
        ) AS "profile"
        FROM "users"
      `

      it('includes by string argument', async () => {
        expect(await User.include('profile').toSql()).toBe(line(expected))
      })

      it('has modifier', async () => {
        const q = User.all()
        q._include('profile')
        expect(await q.toSql()).toBe(line(expected))
      })
    })

    describe('object argument', () => {
      const expected = `
        SELECT "users".*, (
          SELECT COALESCE(row_to_json("t".*), '{}') AS json FROM (
            SELECT "profiles".*
            FROM "profiles"
            WHERE "profiles"."userId" = "users"."id"
            LIMIT 1
          ) "t"
        ) AS "customName"
        FROM "users"
      `

      it('includes relation with custom key', async () => {
        expect(await User.include({profile: 'customName'}).toSql()).toBe(line(expected))
      })

      it('has modifier', async () => {
        const q = User.all()
        q._include({profile: 'customName'})
        expect(await q.toSql()).toBe(line(expected))
      })
    })

    describe('object argument with query', () => {
      const expected = `
        SELECT "users".*, (
          SELECT COALESCE(row_to_json("t".*), '{}') AS json FROM (
            SELECT "customName".*
            FROM "profiles" "customName"
            WHERE a = b AND "customName"."userId" = "users"."id"
            LIMIT 1
          ) "t"
        ) AS "customName"
        FROM "users"
      `

      it('includes relation with query', async () => {
        expect(
          await User.include({profile: Profile.as('customName').where('a = b')}).toSql()
        ).toBe(line(expected))
      })

      it('has modifier', async () => {
        const q = User.all()
        q._include({profile: Profile.as('customName').where('a = b')})
        expect(await q.toSql()).toBe(line(expected))
      })
    })
  })
})
