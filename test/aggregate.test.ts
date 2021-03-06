import porm from '../src'
import db from './db'

const model = porm(db)

const User = model<{id: number; name: string}>('users')

describe('aggregateSql', () => {
  it('return sql for aggregate function', () => {
    expect(User.aggregateSql('count', '*')).toBe('count(*)')
  })

  it('has distinct option', () => {
    expect(User.aggregateSql('count', 'name', {distinct: true}))
      .toBe('count(DISTINCT name)')
  })

  it('has order option', () => {
    expect(User.aggregateSql('count', 'name', {order: 'name DESC'}))
    .toBe('count(name ORDER BY name DESC)')
  })

  it('has filter option', () => {
    expect(User.aggregateSql('count', 'name', {filter: 'name IS NOT NULL'}))
    .toBe('count(name) FILTER (WHERE name IS NOT NULL)')
  })

  it('gives appropriate sql with all options', () => {
    expect(User.aggregateSql('count', 'name', {
      distinct: true,
      order: 'name DESC',
      filter: 'name IS NOT NULL'
    }))
    .toBe('count(DISTINCT name ORDER BY name DESC) FILTER (WHERE name IS NOT NULL)')
  })

  it('gives appropriate sql with all options WITHIN GROUP mode', () => {
    expect(User.aggregateSql('count', 'name', {
      distinct: true,
      order: 'name DESC',
      filter: 'name IS NOT NULL',
      withinGroup: true
    }))
    .toBe('count(name) WITHIN GROUP (ORDER BY name DESC) FILTER (WHERE name IS NOT NULL)')
  })
})

describe('count', () => {
  it('makes count query', async () => {
    expect(await User.count().toSql()).toBe('SELECT count(*) FROM "users"')
  })

  it('has modifier', async () => {
    expect(await User._count().toSql()).toBe('SELECT count(*) FROM "users"')
  })
})

describe('avg', () => {
  it('makes avg query', async () => {
    expect(await User.avg('age').toSql()).toBe('SELECT avg(age) FROM "users"')
  })

  it('has modifier', async () => {
    expect(await User._avg('age').toSql()).toBe('SELECT avg(age) FROM "users"')
  })
})

describe('min', () => {
  it('makes min query', async () => {
    expect(await User.min('age').toSql()).toBe('SELECT min(age) FROM "users"')
  })

  it('has modifier', async () => {
    expect(await User._min('age').toSql()).toBe('SELECT min(age) FROM "users"')
  })
})

describe('max', () => {
  it('makes max query', async () => {
    expect(await User.max('age').toSql()).toBe('SELECT max(age) FROM "users"')
  })

  it('has modifier', async () => {
    expect(await User._max('age').toSql()).toBe('SELECT max(age) FROM "users"')
  })
})

describe('sum', () => {
  it('makes sum query', async () => {
    expect(await User.sum('age').toSql()).toBe('SELECT sum(age) FROM "users"')
  })

  it('has modifier', async () => {
    expect(await User._sum('age').toSql()).toBe('SELECT sum(age) FROM "users"')
  })
})
