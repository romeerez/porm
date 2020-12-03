import porm from '../src'
import {line} from './utils'
import db from './db'

const model = porm(db)

const User = model<{id: number; name: string}>('users')
User.columns = async () => ({})

describe('transaction', () => {
  it('executes queries inside a transaction', async () => {
    (db.arrays as any).mockReturnValueOnce([[1]])

    await porm.transaction({User}, async ({User}) => {
      await User.create({name: 'Vasya'})
    })

    expect(db.transaction).toBeCalled()
    expect(db.exec).toBeCalledWith('BEGIN')
    expect(db.arrays).toBeCalledWith(line(`
      INSERT INTO "users" ("name")
      VALUES ('Vasya')
      RETURNING "id"
    `))
    expect(db.exec).toBeCalledWith('COMMIT')
  })
})

