const {models, belongsTo} = require('../src/pgorm')
const db = require('./db')
const {line} = require('./utils')

models(db, {
  users: {}
})

test('update', () => {
  db.users.update({id: 1}, {name: 'vasya', role: 'user'})
  expect(db.arrays).toBeCalledWith(line(`
    UPDATE "users"
    SET "users"."name" = 'vasya',
        "users"."role" = 'user'
    WHERE "users"."id" = 1
  `))
})
