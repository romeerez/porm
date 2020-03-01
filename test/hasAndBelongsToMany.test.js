const {models, hasAndBelongsToMany} = require('../src/pgorm')
const db = require('./db')
const {line} = require('./utils')

models(db, {
  users: {
    chats: hasAndBelongsToMany('chats'),
    chatsWithScope: hasAndBelongsToMany('chats', {
      scope: (chats) => chats.active()
    })
  },
  chats: {
    scopes: {
      active: (chats) => chats.where({active: true})
    }
  }
})

describe('hasAndBelongsToMany', () => {
  it('makes proper query', () => {
    const user = {id: 5}
    expect(db.users.chats(user).toSql()).toBe(line(`
      SELECT "chats".* FROM "chats"
      JOIN "chats_users"
        ON "chats_users"."user_id" = 5
      WHERE "chats"."id" = "chats_users"."chat_id"
    `))
    expect(db.users.chatsWithScope(user).toSql()).toBe(line(`
      SELECT "chats".* FROM "chats"
      JOIN "chats_users"
        ON "chats_users"."user_id" = 5
      WHERE "chats"."active" = true
        AND "chats"."id" = "chats_users"."chat_id"
    `))
  })

  it('can be joined', () => {
    const q = db.users.all()
    expect(q.join('chats').toSql()).toBe(line(`
      SELECT "users".* FROM "users"
        JOIN "chats_users"
          ON "chats_users"."user_id" = "users"."id"
        JOIN "chats" ON "chats"."id" = "chats_users"."chat_id"
    `))
    expect(q.join('chatsWithScope').toSql()).toBe(line(`
      SELECT "users".* FROM "users"
        JOIN "chats_users"
          ON "chats_users"."user_id" = "users"."id"
        JOIN "chats"
          ON "chats"."active" = true
         AND "chats"."id" = "chats_users"."chat_id"
    `))
  })

  it('has json subquery', () => {
    expect(db.users.chats.json().toSql()).toBe(line(`
      SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
      FROM (
        SELECT "chats".* FROM "chats"
        JOIN "chats_users"
          ON "chats_users"."user_id" = "users"."id"
        WHERE "chats"."id" = "chats_users"."chat_id"
      ) "t"
    `))
    expect(db.users.chatsWithScope.json().toSql()).toBe(line(`
      SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
      FROM (
        SELECT "chats".* FROM "chats"
        JOIN "chats_users"
          ON "chats_users"."user_id" = "users"."id"
        WHERE "chats"."active" = true
          AND "chats"."id" = "chats_users"."chat_id"
      ) "t"
    `))
  })
})
