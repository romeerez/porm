const {models, belongsTo, hasOne} = require('../src/porm')
const db = require('./db')
const {line} = require('./utils')

models(db, {
  users: {
    avatar: hasOne({model: 'images', as: 'object'}),
    avatarWithScope: hasOne({
      model: 'images',
      as: 'object',
      scope: (query) => query.where('active')
    }),
    profile: hasOne(),
    profileWithScope: hasOne({
      model: 'profiles',
      scope: (profiles) => profiles.active()
    })
  },
  profiles: {
    scopes: {
      active: (profiles) => profiles.where({active: true})
    }
  },
  images: {
    object: belongsTo({polymorphic: true})
  }
})

describe('hasOne', () => {
  it('makes proper query', () => {
    const user = {id: 5}
    expect(db.users.profile(user).toSql()).toBe(line(`
      SELECT "profiles".* FROM "profiles"
      WHERE "profiles"."user_id" = ${user.id}
      LIMIT 1
    `))
    expect(db.users.profileWithScope(user).toSql()).toBe(line(`
      SELECT "profiles".* FROM "profiles"
      WHERE "profiles"."active" = true
        AND "profiles"."user_id" = ${user.id}
      LIMIT 1
    `))
  })

  it('can be joined', () => {
    const q = db.users.all()
    expect(q.join('profile').toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      JOIN "profiles"
        ON "profiles"."user_id" = "users"."id"
    `))
    expect(q.join('profileWithScope').toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      JOIN "profiles"
        ON "profiles"."active" = true
       AND "profiles"."user_id" = "users"."id"
    `))
  })

  it('has json subquery', () => {
    expect(db.users.profile.json().toSql()).toBe(line(`
      SELECT COALESCE(row_to_json("t".*), '{}') AS json
      FROM (
        SELECT "profiles".* FROM "profiles"
        WHERE "profiles"."user_id" = "users"."id"
        LIMIT 1
      ) "t"
    `))
    expect(db.users.profileWithScope.json().toSql()).toBe(line(`
      SELECT COALESCE(row_to_json("t".*), '{}') AS json
      FROM (
        SELECT "profiles".* FROM "profiles"
        WHERE "profiles"."active" = true
          AND "profiles"."user_id" = "users"."id"
        LIMIT 1
      ) "t"
    `))
  })

  describe('as', () => {
    it('makes proper query', () => {
      const user = {id: 5}
      expect(db.users.avatar(user).toSql()).toBe(line(`
        SELECT "images".* FROM "images"
        WHERE "images"."object_id" = ${user.id}
          AND "images"."object_type" = 'users'
        LIMIT 1
      `))
      expect(db.users.avatarWithScope(user).toSql()).toBe(line(`
        SELECT "images".* FROM "images"
        WHERE active
          AND "images"."object_id" = ${user.id}
          AND "images"."object_type" = 'users'
        LIMIT 1
      `))
    })

    it('can be joined', () => {
      const q = db.users.all()
      expect(q.join('avatar').toSql()).toBe(line(`
        SELECT "users".* FROM "users"
        JOIN "images"
          ON "images"."object_id" = "users"."id"
         AND "images"."object_type" = 'users'
      `))
      expect(q.join('avatarWithScope').toSql()).toBe(line(`
        SELECT "users".* FROM "users"
        JOIN "images"
          ON active
         AND "images"."object_id" = "users"."id"
         AND "images"."object_type" = 'users'
      `))
    })

    it('has json subquery', () => {
      expect(db.users.avatar.json().toSql()).toBe(line(`
        SELECT COALESCE(row_to_json("t".*), '{}') AS json
        FROM (
          SELECT "images".* FROM "images"
          WHERE "images"."object_id" = "users"."id"
            AND "images"."object_type" = 'users'
          LIMIT 1
        ) "t"
      `))
      expect(db.users.avatarWithScope.json().toSql()).toBe(line(`
        SELECT COALESCE(row_to_json("t".*), '{}') AS json
        FROM (
          SELECT "images".* FROM "images"
          WHERE active
            AND "images"."object_id" = "users"."id"
            AND "images"."object_type" = 'users'
          LIMIT 1
        ) "t"
      `))
    })
  })
})
