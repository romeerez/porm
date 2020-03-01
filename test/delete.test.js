const {models, belongsTo} = require('../src/porm')
const db = require('./db')
const {line} = require('./utils')

models(db, {
  users: {}
})

test('delete', () => {
  db.users.delete({id: 1})
  expect(db.exec).toBeCalledWith(line(`
    DELETE FROM "users"
    WHERE "users"."id" = 1
  `))
})
