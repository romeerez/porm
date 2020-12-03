import porm from '../src'
import db from './db'
import {line} from './utils'

const model = porm(db)

const User = model('users').prepare((prepare, users) => ({
  searchByName: () => {
    const prepared = prepare(['text'], users.where('name = $1'))
    return (name: string) => prepared.then(({query}) => query(name))
  }
}))

describe('prepared', () => {
  it('makes query using prepared statement', async () => {
    await User.searchByName('vasya')
    expect(db.prepare).toBeCalledWith('users_searchByName', 'text')
    expect(db.prepareQuery).toBeCalledWith(line('vasya'))
  })
})
