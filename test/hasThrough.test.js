const {models, belongsTo, hasOne, hasMany, hasAndBelongsToMany} = require('../src/pgorm')
const db = require('./db')
const {line} = require('./utils')

describe('hasThrough', () => {
  [true, false].forEach(one => {
    describe(`${one ? 'hasOne' : 'hasMany'} through belongsTo`, () => {
      beforeAll(() => {
        models(db, {
          profiles: {
            user: belongsTo('users'),
            country: (one ? hasOne : hasMany)('country', {through: 'user', scope: (query) => query.active()}),
          },
          users: {
            country: belongsTo('countries')
          },
          countries: {
            scopes: {
              active: (query) => query.where({active: true})
            }
          }
        })
      })

      it('makes proper query', () => {
        const profile = {user_id: 5}
        expect(db.profiles.country(profile).toSql()).toBe(line(`
          SELECT "countries".* FROM "countries"
          JOIN "users" ON "users"."id" = 5
          WHERE "countries"."id" = "users"."country_id" AND "countries"."active" = true
          ${one ? 'LIMIT 1' : ''}
        `))
      })

      it('can be joined', () => {
        expect(db.profiles.join('country').toSql()).toBe(line(`
          SELECT "profiles".* FROM "profiles"
          JOIN "users" ON "users"."id" = "profiles"."user_id"
          JOIN "countries" ON "countries"."id" = "users"."country_id" AND "countries"."active" = true
        `))
      })

      it('has json subquery', () => {
        expect(db.profiles.country.json().toSql()).toBe(line(`
          SELECT COALESCE(
            ${one ? '' : 'json_agg('}row_to_json("t".*)${one ? ',' : '),'}
            ${one ? "'{}'" : "'[]'"}
            ) AS json
          FROM (
            SELECT "countries".* FROM "countries"
            JOIN "users" ON "users"."id" = "profiles"."user_id"
            WHERE "countries"."id" = "users"."country_id" AND "countries"."active" = true
            ${one ? 'LIMIT 1' : ''}
          ) "t"
        `))
      })
    })

    describe(`${one ? 'hasOne' : 'hasMany'} through hasOne`, () => {
      beforeAll(() => {
        models(db, {
          profiles: {
            user: (one ? hasOne : hasMany)('users'),
            country: (one ? hasOne : hasMany)('country', {through: 'user', scope: (query) => query.active()}),
          },
          users: {
            country: belongsTo('countries')
          },
          countries: {
            scopes: {
              active: (query) => query.where({active: true})
            }
          }
        })
      })

      it('makes proper query', () => {
        const profile = {id: 5}
        expect(db.profiles.country(profile).toSql()).toBe(line(`
          SELECT "countries".* FROM "countries"
          JOIN "users" ON "users"."profile_id" = 5
          WHERE "countries"."id" = "users"."country_id" AND "countries"."active" = true
          ${one ? 'LIMIT 1' : ''}
        `))
      })

      it('can be joined', () => {
        expect(db.profiles.join('country').toSql()).toBe(line(`
          SELECT "profiles".* FROM "profiles"
          JOIN "users" ON "users"."profile_id" = "profiles"."id"
          JOIN "countries" ON "countries"."id" = "users"."country_id" AND "countries"."active" = true
        `))
      })

      it('has json subquery', () => {
        expect(db.profiles.country.json().toSql()).toBe(line(`
          SELECT COALESCE(
            ${one ? '' : 'json_agg('}row_to_json("t".*)${one ? ',' : '),'}
            ${one ? "'{}'" : "'[]'"}
            ) AS json
          FROM (
            SELECT "countries".* FROM "countries"
            JOIN "users" ON "users"."profile_id" = "profiles"."id"
            WHERE "countries"."id" = "users"."country_id" AND "countries"."active" = true
            ${one ? 'LIMIT 1' : ''}
          ) "t"
        `))
      })
    })

    describe(`${one ? 'hasOne' : 'hasMany'} through hasMany`, () => {
      beforeAll(() => {
        models(db, {
          teams: {
            users: hasMany('users'),
            country: (one ? hasOne : hasMany)('country', {through: 'users', scope: (query) => query.active()}),
          },
          users: {
            country: belongsTo('country')
          },
          country: {
            scopes: {
              active: (query) => query.where({active: true})
            }
          }
        })
      })

      it('makes proper query', () => {
        const team = {id: 5}
        expect(db.teams.country(team).toSql()).toBe(line(`
          SELECT "countries".* FROM "countries"
          JOIN "users" ON "users"."team_id" = 5
          WHERE "countries"."id" = "users"."country_id" AND "countries"."active" = true
          ${one ? 'LIMIT 1' : ''}
        `))
      })

      it('can be joined', () => {
        expect(db.teams.join('country').toSql()).toBe(line(`
          SELECT "teams".* FROM "teams"
          JOIN "users" ON "users"."team_id" = "teams"."id"
          JOIN "countries"
            ON "countries"."id" = "users"."country_id" AND "countries"."active" = true
        `))
      })

      it('has json subquery', () => {
        expect(db.teams.country.json().toSql()).toBe(line(`
          SELECT COALESCE(
            ${one ? '' : 'json_agg('}row_to_json("t".*)${one ? ',' : '),'}
            ${one ? "'{}'" : "'[]'"}
            ) AS json
          FROM (
            SELECT "countries".* FROM "countries"
            JOIN "users" ON "users"."team_id" = "teams"."id"
            WHERE "countries"."id" = "users"."country_id" AND "countries"."active" = true
            ${one ? 'LIMIT 1' : ''}
          ) "t"
        `))
      })
    })


    describe(`${one ? 'hasOne' : 'hasMany'} through hasHasAndBelongsToMany`, () => {
      beforeAll(() => {
        models(db, {
          chats: {
            users: hasAndBelongsToMany('users'),
            country: (one ? hasOne : hasMany)('country', {through: 'users', scope: (query) => query.active()}),
          },
          users: {
            country: belongsTo('countries')
          },
          countries: {
            scopes: {
              active: (query) => query.where({active: true})
            }
          },
        })
      })

      it('makes proper query', () => {
        const chat = {id: 5}
        expect(db.chats.country(chat).toSql()).toBe(line(`
          SELECT "countries".* FROM "countries"
          JOIN "chats_users" ON "chats_users"."chat_id" = 5
          JOIN "users" ON "users"."id" = "chats_users"."user_id"
          WHERE "countries"."id" = "users"."country_id" AND "countries"."active" = true
          ${one ? 'LIMIT 1' : ''}
        `))
      })

      it('can be joined', () => {
        expect(db.chats.join('country').toSql()).toBe(line(`
          SELECT "chats".* FROM "chats"
          JOIN "chats_users" ON "chats_users"."chat_id" = "chats"."id"
          JOIN "users" ON "users"."id" = "chats_users"."user_id"
          JOIN "countries" ON "countries"."id" = "users"."country_id" AND "countries"."active" = true
        `))
      })

      it('has json subquery', () => {
        expect(db.chats.country.json().toSql()).toBe(line(`
          SELECT COALESCE(
            ${one ? '' : 'json_agg('}row_to_json("t".*)${one ? ',' : '),'}
            ${one ? "'{}'" : "'[]'"}
            ) AS json
          FROM (
            SELECT "countries".* FROM "countries"
            JOIN "chats_users" ON "chats_users"."chat_id" = "chats"."id"
            JOIN "users" ON "users"."id" = "chats_users"."user_id"
            WHERE "countries"."id" = "users"."country_id" AND "countries"."active" = true
            ${one ? 'LIMIT 1' : ''}
          ) "t"
        `))
      })
    })
  })
})
