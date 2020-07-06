import porm from '../src'
import db from './db'
import {line} from './utils'

const model = porm(db)

const Chat = model('chats', class {}).scopes({
  active() {
    return this.where({active: true})
  }
})

const User = model('users', class {}).relations(({hasAndBelongsToMany}) => ({
  chats: hasAndBelongsToMany((params: {id: number}) => Chat),
  chatsWithScope: hasAndBelongsToMany((params: {id: number}) => Chat.active())
}))

describe('hasAndBelongsToMany', () => {
  it('makes proper query', async () => {
    const user = {id: 5}
    expect(await User.chats(user).toSql()).toBe(line(`
      SELECT "chats".* FROM "chats"
      JOIN "chatsUsers"
        ON "chatsUsers"."userId" = 5
      WHERE "chats"."id" = "chatsUsers"."chatId"
    `))
    expect(await User.chatsWithScope(user).toSql()).toBe(line(`
      SELECT "chats".* FROM "chats"
      JOIN "chatsUsers"
        ON "chatsUsers"."userId" = 5
      WHERE "chats"."id" = "chatsUsers"."chatId"
        AND "chats"."active" = true
    `))
  })

  it('can be joined', async () => {
    const q = User.all()
    expect(await q.join('chats').toSql()).toBe(line(`
      SELECT "users".* FROM "users"
        JOIN "chatsUsers"
          ON "chatsUsers"."userId" = "users"."id"
        JOIN "chats" ON "chats"."id" = "chatsUsers"."chatId"
    `))
    expect(await q.join('chatsWithScope').toSql()).toBe(line(`
      SELECT "users".* FROM "users"
        JOIN "chatsUsers"
          ON "chatsUsers"."userId" = "users"."id"
        JOIN "chats"
          ON "chats"."id" = "chatsUsers"."chatId"
         AND "chats"."active" = true
    `))
  })

  it('has json subquery', async () => {
    expect(await User.chats.json().toSql()).toBe(line(`
      SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
      FROM (
        SELECT "chats".* FROM "chats"
        JOIN "chatsUsers"
          ON "chatsUsers"."userId" = "users"."id"
        WHERE "chats"."id" = "chatsUsers"."chatId"
      ) "t"
    `))
    expect(await User.chatsWithScope.json().toSql()).toBe(line(`
      SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
      FROM (
        SELECT "chats".* FROM "chats"
        JOIN "chatsUsers"
          ON "chatsUsers"."userId" = "users"."id"
        WHERE "chats"."id" = "chatsUsers"."chatId"
          AND "chats"."active" = true
      ) "t"
    `))
  })
})
