import porm from '../src'
import db from './db'
import {line} from './utils'

const model = porm(db)

describe('hasThrough', () => {
  // [true, false].forEach(one => {
  [true].forEach(one => {
    const Country = model('countries', class {id: number}).scopes({
      active() {
        return this.where({active: true})
      }
    })

    const User = model('users', class {id: number}).relations(({belongsTo}) => ({
      country: belongsTo((params: {countryId: number}) => Country)
    }))

    describe(`${one ? 'hasOne' : 'hasMany'} through belongsTo`, () => {
      const Profile = model('profiles', class {id: number; userId: number}).relations(({belongsTo, hasOne, hasMany}) => ({
        user: belongsTo((params: {userId: number}) => User),
        country: (one ? hasOne as any : hasMany as any)((params: {userId: number}) => Country.active(), {through: 'user'})
      }))

      it('makes proper query', () => {
        const profile = {userId: 5}
        expect(Profile.country(profile).toSql()).toBe(line(`
          SELECT "countries".* FROM "countries"
          JOIN "users" ON "users"."id" = 5
          WHERE "countries"."id" = "users"."countryId" AND "countries"."active" = true
          ${one ? 'LIMIT 1' : ''}
        `))
      })

      it('can be joined', () => {
        expect(Profile.join('country').toSql()).toBe(line(`
          SELECT "profiles".* FROM "profiles"
          JOIN "users" ON "users"."id" = "profiles"."userId"
          JOIN "countries" ON "countries"."id" = "users"."countryId" AND "countries"."active" = true
        `))
      })

      it('has json subquery', () => {
        expect(Profile.country.json().toSql()).toBe(line(`
          SELECT COALESCE(
            ${one ? '' : 'json_agg('}row_to_json("t".*)${one ? ',' : '),'}
            ${one ? "'{}'" : "'[]'"}
            ) AS json
          FROM (
            SELECT "countries".* FROM "countries"
            JOIN "users" ON "users"."id" = "profiles"."userId"
            WHERE "countries"."id" = "users"."countryId" AND "countries"."active" = true
            ${one ? 'LIMIT 1' : ''}
          ) "t"
        `))
      })
    })

    describe(`${one ? 'hasOne' : 'hasMany'} through hasOne`, () => {
      const Profile = model('profiles', class {id: number; userId: number}).relations(({belongsTo, hasOne, hasMany}) => ({
        user: hasOne((params: {userId: number}) => User),
        country: (one ? hasOne as any : hasMany as any)((params: {userId: number}) => Country.active(), {through: 'user'})
      }))

      it('makes proper query', () => {
        const profile = {id: 5}
        expect(Profile.country(profile).toSql()).toBe(line(`
          SELECT "countries".* FROM "countries"
          JOIN "users" ON "users"."profileId" = 5
          WHERE "countries"."id" = "users"."countryId" AND "countries"."active" = true
          ${one ? 'LIMIT 1' : ''}
        `))
      })

      it('can be joined', () => {
        expect(Profile.join('country').toSql()).toBe(line(`
          SELECT "profiles".* FROM "profiles"
          JOIN "users" ON "users"."profileId" = "profiles"."id"
          JOIN "countries" ON "countries"."id" = "users"."countryId" AND "countries"."active" = true
        `))
      })

      it('has json subquery', () => {
        expect(Profile.country.json().toSql()).toBe(line(`
          SELECT COALESCE(
            ${one ? '' : 'json_agg('}row_to_json("t".*)${one ? ',' : '),'}
            ${one ? "'{}'" : "'[]'"}
            ) AS json
          FROM (
            SELECT "countries".* FROM "countries"
            JOIN "users" ON "users"."profileId" = "profiles"."id"
            WHERE "countries"."id" = "users"."countryId" AND "countries"."active" = true
            ${one ? 'LIMIT 1' : ''}
          ) "t"
        `))
      })
    })

    describe(`${one ? 'hasOne' : 'hasMany'} through hasMany`, () => {
      const Team = model('teams', class {id: number; userId: number}).relations(({hasOne, hasMany}) => ({
        users: hasMany((params: {userId: number}) => User),
        country: (one ? hasOne as any : hasMany as any)((params: {userId: number}) => Country.active(), {through: 'users'})
      }))

      it('makes proper query', () => {
        const team = {id: 5}
        expect(Team.country(team).toSql()).toBe(line(`
          SELECT "countries".* FROM "countries"
          JOIN "users" ON "users"."teamId" = 5
          WHERE "countries"."id" = "users"."countryId" AND "countries"."active" = true
          ${one ? 'LIMIT 1' : ''}
        `))
      })

      it('can be joined', () => {
        expect(Team.join('country').toSql()).toBe(line(`
          SELECT "teams".* FROM "teams"
          JOIN "users" ON "users"."teamId" = "teams"."id"
          JOIN "countries"
            ON "countries"."id" = "users"."countryId" AND "countries"."active" = true
        `))
      })

      it('has json subquery', () => {
        expect(Team.country.json().toSql()).toBe(line(`
          SELECT COALESCE(
            ${one ? '' : 'json_agg('}row_to_json("t".*)${one ? ',' : '),'}
            ${one ? "'{}'" : "'[]'"}
            ) AS json
          FROM (
            SELECT "countries".* FROM "countries"
            JOIN "users" ON "users"."teamId" = "teams"."id"
            WHERE "countries"."id" = "users"."countryId" AND "countries"."active" = true
            ${one ? 'LIMIT 1' : ''}
          ) "t"
        `))
      })
    })


    describe(`${one ? 'hasOne' : 'hasMany'} through hasHasAndBelongsToMany`, () => {
      const Chat = model('chats', class {}).relations(({hasAndBelongsToMany, hasOne, hasMany}) => ({
        users: hasAndBelongsToMany((params: {id: number}) => User),
        country: (one ? hasOne as any : hasMany as any)((params: {userId: number}) => Country.active(), {through: 'users'})
      }))

      it('makes proper query', () => {
        const chat = {id: 5}
        expect(Chat.country(chat).toSql()).toBe(line(`
          SELECT "countries".* FROM "countries"
          JOIN "chatsUsers" ON "chatsUsers"."chatId" = 5
          JOIN "users" ON "users"."id" = "chatsUsers"."userId"
          WHERE "countries"."id" = "users"."countryId" AND "countries"."active" = true
          ${one ? 'LIMIT 1' : ''}
        `))
      })

      it('can be joined', () => {
        expect(Chat.join('country').toSql()).toBe(line(`
          SELECT "chats".* FROM "chats"
          JOIN "chatsUsers" ON "chatsUsers"."chatId" = "chats"."id"
          JOIN "users" ON "users"."id" = "chatsUsers"."userId"
          JOIN "countries" ON "countries"."id" = "users"."countryId" AND "countries"."active" = true
        `))
      })

      it('has json subquery', () => {
        expect(Chat.country.json().toSql()).toBe(line(`
          SELECT COALESCE(
            ${one ? '' : 'json_agg('}row_to_json("t".*)${one ? ',' : '),'}
            ${one ? "'{}'" : "'[]'"}
            ) AS json
          FROM (
            SELECT "countries".* FROM "countries"
            JOIN "chatsUsers" ON "chatsUsers"."chatId" = "chats"."id"
            JOIN "users" ON "users"."id" = "chatsUsers"."userId"
            WHERE "countries"."id" = "users"."countryId" AND "countries"."active" = true
            ${one ? 'LIMIT 1' : ''}
          ) "t"
        `))
      })
    })
  })
})
