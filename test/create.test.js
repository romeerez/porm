const {models} = require('../src/porm')
const db = require('./db')
const {line} = require('./utils')

models(db, {
  users: {}
})

test('create', () => {
  db.users.create({name: 'vasya', role: 'user'})
  expect(db.arrays).toBeCalledWith(line(`
    INSERT INTO "users" ("name", "role")
    VALUES ('vasya', 'user')
    RETURNING "id"
  `))
})
