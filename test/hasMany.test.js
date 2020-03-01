const {models, hasMany, belongsTo} = require('../src/pgorm')
const db = require('./db')
const {line} = require('./utils')

models(db, {
  chats: {
    messages: hasMany('messages'),
    messagesWithScope: hasMany('messages', {
      scope: (messages) => messages.active()
    })
  },
  messages: {
    images: hasMany('images', {as: 'object'}),
    imagesWithScope: hasMany('images', {
      as: 'object',
      scope: (query) => query.where('active'),
    }),
    scopes: {
      active: (messages) => messages.where({active: true})
    }
  },
  images: {
    object: belongsTo('object', {polymorphic: true})
  }
})

describe('hasMany', () => {
  it('makes proper query', () => {
    const chat = {id: 5}
    expect(db.chats.messages(chat).toSql()).toBe(line(`
      SELECT "messages".* FROM "messages"
      WHERE "messages"."chat_id" = ${chat.id}
    `))
    expect(db.chats.messagesWithScope(chat).toSql()).toBe(line(`
      SELECT "messages".* FROM "messages"
      WHERE "messages"."active" = true
        AND "messages"."chat_id" = ${chat.id}
    `))
  })

  it('can be joined', () => {
    const q = db.chats.all()
    expect(q.join('messages').toSql()).toBe(line(`
      SELECT "chats".* FROM "chats"
      JOIN "messages" ON "messages"."chat_id" = "chats"."id"
    `))
    expect(q.join('messagesWithScope').toSql()).toBe(line(`
      SELECT "chats".* FROM "chats"
      JOIN "messages"
        ON "messages"."active" = true
       AND "messages"."chat_id" = "chats"."id"
    `))
  })

  it('has json subquery', () => {
    expect(db.chats.messages.json().toSql()).toBe(line(`
      SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
      FROM (
        SELECT "messages".* FROM "messages"
        WHERE "messages"."chat_id" = "chats"."id"
      ) "t"
    `))
    expect(db.chats.messagesWithScope.json().toSql()).toBe(line(`
      SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
      FROM (
        SELECT "messages".* FROM "messages"
        WHERE "messages"."active" = true
          AND "messages"."chat_id" = "chats"."id"
      ) "t"
    `))
  })

  describe('as', () => {
    it('makes proper query', () => {
      const message = {id: 5}
      expect(db.messages.images(message).toSql()).toBe(line(`
        SELECT "images".* FROM "images"
        WHERE "images"."object_id" = ${message.id}
          AND "images"."object_type" = 'messages'
      `))
      expect(db.messages.imagesWithScope(message).toSql()).toBe(line(`
        SELECT "images".* FROM "images"
        WHERE active
          AND "images"."object_id" = ${message.id}
          AND "images"."object_type" = 'messages'
      `))
    })

    it('can be joined', () => {
      const q = db.messages.all()
      expect(q.join('images').toSql()).toBe(line(`
        SELECT "messages".* FROM "messages"
        JOIN "images"
          ON "images"."object_id" = "messages"."id"
         AND "images"."object_type" = 'messages'
      `))
      expect(q.join('imagesWithScope').toSql()).toBe(line(`
        SELECT "messages".* FROM "messages"
        JOIN "images"
          ON active
         AND "images"."object_id" = "messages"."id"
         AND "images"."object_type" = 'messages'
      `))
    })

    it('has json subquery', () => {
      expect(db.messages.images.json().toSql()).toBe(line(`
        SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
        FROM (
          SELECT "images".* FROM "images"
          WHERE "images"."object_id" = "messages"."id"
            AND "images"."object_type" = 'messages'
        ) "t"
      `))
      expect(db.messages.imagesWithScope.json().toSql()).toBe(line(`
        SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
        FROM (
          SELECT "images".* FROM "images"
          WHERE active
            AND "images"."object_id" = "messages"."id"
            AND "images"."object_type" = 'messages'
        ) "t"
      `))
    })
  })
})
