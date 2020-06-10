import porm from '../src'
import db from './db'
import {line} from './utils'

const model = porm(db)

const Message = model('messages', class {id: number; chatId: number}).scopes({
  active() {
    return this.where({active: true})
  }
})

const Chat = model('chats', class {id: number}).relations(({hasMany}) => ({
  messages: hasMany((params: {id: number}) => Message),
  messagesWithScope: hasMany((params: {id: number}) => Message.active())
}))

describe('hasMany', () => {
  it('makes proper query', () => {
    const chat = {id: 5}
    expect(Chat.messages(chat).toSql()).toBe(line(`
      SELECT "messages".* FROM "messages"
      WHERE "messages"."chatId" = ${chat.id}
    `))
    expect(Chat.messagesWithScope(chat).toSql()).toBe(line(`
      SELECT "messages".* FROM "messages"
      WHERE "messages"."active" = true
        AND "messages"."chatId" = ${chat.id}
    `))
  })

  it('can be joined', () => {
    const q = Chat.all()
    expect(q.join('messages').toSql()).toBe(line(`
      SELECT "chats".* FROM "chats"
      JOIN "messages" ON "messages"."chatId" = "chats"."id"
    `))
    expect(q.join('messagesWithScope').toSql()).toBe(line(`
      SELECT "chats".* FROM "chats"
      JOIN "messages"
        ON "messages"."active" = true
       AND "messages"."chatId" = "chats"."id"
    `))
  })

  it('has json subquery', () => {
    expect(Chat.messages.json().toSql()).toBe(line(`
      SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
      FROM (
        SELECT "messages".* FROM "messages"
        WHERE "messages"."chatId" = "chats"."id"
      ) "t"
    `))
    expect(Chat.messagesWithScope.json().toSql()).toBe(line(`
      SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
      FROM (
        SELECT "messages".* FROM "messages"
        WHERE "messages"."active" = true
          AND "messages"."chatId" = "chats"."id"
      ) "t"
    `))
  })
})
