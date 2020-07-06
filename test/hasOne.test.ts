import porm from '../src'
import db from './db'
import {line} from './utils'

const model = porm(db)

const Profile = model('profiles', class {id: number; userId: number}).scopes({
  active() {
    return this.where({active: true})
  }
})

export const User = model('users', class {id: number}).relations(({hasOne}) => ({
  profile: hasOne((params: {id: number}) => Profile),
  profileWithScope: hasOne((params: {id: number}) => Profile.active())
}))

describe('hasOne', () => {
  it('makes proper query', async () => {
    const user = {id: 5}
    expect(await User.profile(user).toSql()).toBe(line(`
      SELECT "profiles".* FROM "profiles"
      WHERE "profiles"."userId" = ${user.id}
      LIMIT 1
    `))
    expect(await User.profileWithScope(user).toSql()).toBe(line(`
      SELECT "profiles".* FROM "profiles"
      WHERE "profiles"."active" = true
        AND "profiles"."userId" = ${user.id}
      LIMIT 1
    `))
  })

  it('can be joined', async () => {
    const q = User.all()
    expect(await q.join('profile').toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      JOIN "profiles"
        ON "profiles"."userId" = "users"."id"
    `))
    expect(await q.join('profileWithScope').toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      JOIN "profiles"
        ON "profiles"."active" = true
       AND "profiles"."userId" = "users"."id"
    `))
  })

  it('has json subquery', async () => {
    expect(await User.profile.json().toSql()).toBe(line(`
      SELECT COALESCE(row_to_json("t".*), '{}') AS json
      FROM (
        SELECT "profiles".* FROM "profiles"
        WHERE "profiles"."userId" = "users"."id"
        LIMIT 1
      ) "t"
    `))
    expect(await User.profileWithScope.json().toSql()).toBe(line(`
      SELECT COALESCE(row_to_json("t".*), '{}') AS json
      FROM (
        SELECT "profiles".* FROM "profiles"
        WHERE "profiles"."active" = true
          AND "profiles"."userId" = "users"."id"
        LIMIT 1
      ) "t"
    `))
  })
})
