import porm from '../src/index'
import db from './db'
import {line} from './utils'

const model = porm(db)

class Entity {
  id: number
}

const Chat = model('chats', Entity).scopes({
  active() {
    return this.where({active: true})
  }
})

const Message = model('messages', Entity).relations(({belongsTo}) => ({
  chat: belongsTo((params: {chatId: any}) => Chat),
  chatWithScope: belongsTo((params: {chatId: any}) => Chat.active())
}))

describe('belongsTo', () => {
  it('makes proper query', async () => {
    const message = {chatId: 5}
    expect(await Message.chat(message).toSql()).toBe(line(`
      SELECT "chats".* FROM "chats"
      WHERE "chats"."id" = ${message.chatId}
      LIMIT 1
    `))
    expect(await Message.chatWithScope(message).toSql()).toBe(line(`
      SELECT "chats".* FROM "chats"
      WHERE "chats"."active" = true
        AND "chats"."id" = ${message.chatId}
      LIMIT 1
    `))
  })

  it('can be joined', async () => {
    const q = Message.all()
    expect(await q.join('chat').toSql()).toBe(line(`
      SELECT "messages".* FROM "messages"
      JOIN "chats"
        ON "chats"."id" = "messages"."chatId"
    `))
    expect(await q.join('chatWithScope').toSql()).toBe(line(`
      SELECT "messages".* FROM "messages"
      JOIN "chats"
        ON "chats"."active" = true
       AND "chats"."id" = "messages"."chatId"
    `))
  })

  it('has json subquery', async () => {
    expect(await Message.chat.json().toSql()).toBe(line(`
      SELECT COALESCE(row_to_json("t".*), '{}') AS json
      FROM (
        SELECT "chats".* FROM "chats"
        WHERE "chats"."id" = "messages"."chatId"
        LIMIT 1
      ) "t"
    `))
    expect(await Message.chatWithScope.json().toSql()).toBe(line(`
      SELECT COALESCE(row_to_json("t".*), '{}') AS json
      FROM (
        SELECT "chats".* FROM "chats"
        WHERE "chats"."active" = true
          AND "chats"."id" = "messages"."chatId"
        LIMIT 1
      ) "t"
    `))
  })
})
