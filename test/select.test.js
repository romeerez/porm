const {models} = require('../src/porm')
const {line} = require('./utils')
let db = require('./db')

db = models(db, {
  users: {},
  chats: {},
  messages: {},
})

describe('toQuery', () => {
  it('creates a query with same props as model', () => {
    const query = db.users.toQuery()
    expect(query).not.toBe(db.users)
    for (let key in db.users)
      expect(query[key]).toBe(db.users[key])
  })
})

describe('all', () => {
  it('returns query, if `take` prop present query is cloned, clears `take` property', () => {
    const q = db.users.all()
    expect(q).toHaveProperty('__query')
    expect(q.all()).toBe(q)
    expect(q.__query).not.toHaveProperty('take')
    q._take()
    expect(q.__query).toHaveProperty('take')
    expect(q.all()).not.toBe(q)
  })

  it('has modifier', () => {
    const q = db.users._all()
    q._take()
    expect(q.__query).toHaveProperty('take')
    q._all()
    expect(q.__query).not.toHaveProperty('take')
  })
})

describe('clone', () => {
  it('clones a query', () => {
    const q = db.users
    expect(q.clone()).not.toBe(q)
  })
})

describe('toSql', () => {
  it('generates sql', () => {
    expect(db.users.toSql()).toBe(`SELECT "users".* FROM "users"`)
  })
})

describe('find', () => {
  it('searches one by primary key', () => {
    expect(db.users.find(1).toSql()).toBe(`SELECT "users".* FROM "users" WHERE "users"."id" = 1 LIMIT 1`)
  })

  it('has modifier', () => {
    const q = db.users.all()
    q._find(1)
    expect(q.toSql()).toBe(`SELECT "users".* FROM "users" WHERE "users"."id" = 1 LIMIT 1`)
  })
})

describe('wrap', () => {
  it('wraps query with another', () => {
    const q = db.users.select('innerQuery')
    expect(q.wrap(db.users.select('outerQuery')).toSql()).toBe(
      'SELECT "t"."outerQuery" FROM (SELECT "users"."innerQuery" FROM "users") "t"'
    )
  })

  it('accept `as` parameter', () => {
    const q = db.users.select('innerQuery')
    expect(q.wrap(db.users.select('outerQuery'), 'wrapped').toSql()).toBe(
      'SELECT "wrapped"."outerQuery" FROM (SELECT "users"."innerQuery" FROM "users") "wrapped"'
    )
  })
})

describe('json', () => {
  it('wraps a query with json functions', () => {
    const q = db.users.all()
    expect(q.json().toSql()).toBe(line(`
      SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
      FROM (
        SELECT "users".* FROM "users"
      ) "t"
    `))
    expect(q.toSql()).toBe('SELECT "users".* FROM "users"')
  })

  it('supports `take`', () => {
    expect(db.users.take().json().toSql()).toBe(line(`
      SELECT COALESCE(row_to_json("t".*), '{}') AS json
      FROM (
        SELECT "users".* FROM "users" LIMIT 1
      ) "t"
    `))
  })
})

describe('take', () => {
  it('limits to one and returns only one', () => {
    const q = db.users.all()
    expect(q.take().toSql()).toContain('LIMIT 1')
    expect(q.toSql()).not.toContain('LIMIT 1')
  })
})

describe('resultType', () => {
  it('calling on db when accessing `then`', () => {
    const q = db.users.all()
    q.resultType('value').then()
    expect(db.value).toBeCalledWith(expect.anything())
    q.then()
    expect(db.objects).toBeCalledWith(expect.anything())
  })

  it('has modifier', () => {
    const q = db.users.all()
    q._resultType('value')
    q.then()
    expect(db.value).toBeCalledWith(expect.anything())
  })
})

describe('objects', () => {
  it('calls objects method of db', () => {
    const q = db.users.arrays()
    q.objects().then()
    expect(db.objects).toBeCalledWith(expect.anything())
    q.then()
    expect(db.arrays).toBeCalledWith(expect.anything())
  })

  it('has modifier', () => {
    const q = db.users.arrays()
    q._resultType('objects')
    q.then()
    expect(db.objects).toBeCalledWith(expect.anything())
  })
})

describe('arrays', () => {
  it('calls arrays method of db', () => {
    const q = db.users.arrays()
    q.arrays().then()
    expect(db.arrays).toBeCalledWith(expect.anything())
    q.then()
    expect(db.objects).toBeCalledWith(expect.anything())
  })

  it('has modifier', () => {
    const q = db.users.objects()
    q._resultType('arrays')
    q.then()
    expect(db.arrays).toBeCalledWith(expect.anything())
  })
})

describe('value', () => {
  it('calls value method of db', () => {
    const q = db.users.value()
    q.value().then()
    expect(db.value).toBeCalledWith(expect.anything())
    q.then()
    expect(db.objects).toBeCalledWith(expect.anything())
  })

  it('has modifier', () => {
    const q = db.users.objects()
    q._resultType('value')
    q.then()
    expect(db.value).toBeCalledWith(expect.anything())
  })
})

describe('exec', () => {
  it('calls exec method of db', () => {
    const q = db.users.exec()
    q.exec().then()
    expect(db.exec).toBeCalledWith(expect.anything())
    q.then()
    expect(db.objects).toBeCalledWith(expect.anything())
  })

  it('has modifier', () => {
    const q = db.users.objects()
    q._resultType('exec')
    q.then()
    expect(db.exec).toBeCalledWith(expect.anything())
  })
})

describe('as', () => {
  it('sets table alias', () => {
    const q = db.users.all()
    expect(q.select('id').as('as').toSql()).toBe(
      'SELECT "as"."id" FROM "users" "as"'
    )
    expect(q.toSql()).not.toContain('as')
  })
})

describe('distinct and distinctRaw', () => {
  it('add distinct', () => {
    const q = db.users.all()
    expect(q.distinct().toSql()).toBe(
      'SELECT DISTINCT "users".* FROM "users"'
    )
    expect(q.distinct('id', 'name').toSql()).toBe(line(`
      SELECT DISTINCT ON ("users"."id", "users"."name") "users".*
      FROM "users"
    `))
    expect(q.distinctRaw('raw').toSql()).toBe(line(`
      SELECT DISTINCT ON (raw) "users".*
      FROM "users"
    `))
    expect(q.distinct('one').distinctRaw('two').toSql()).toBe(line(`
      SELECT DISTINCT ON ("users"."one", two) "users".*
      FROM "users"
    `))
    expect(q.toSql()).not.toContain('DISTINCT')
  })

  it('has modifier', () => {
    const q = db.users.all()
    q._distinct()
    expect(q.toSql()).toContain('DISTINCT')
    q._distinct(false)
    expect(q.toSql()).not.toContain('DISTINCT')
    q._distinctRaw()
    expect(q.toSql()).toContain('DISTINCT')
    q._distinctRaw(false)
    expect(q.toSql()).not.toContain('DISTINCT')
  })
})

describe('select and selectRaw', () => {
  it('selects', () => {
    const q = db.users.all()
    expect(q.select('id', 'name').toSql()).toBe(line(`
      SELECT "users"."id", "users"."name" FROM "users"
    `))
    expect(q.select({firstName: 'name'}).toSql()).toBe(line(`
      SELECT "users"."name" AS "firstName" FROM "users"
    `))
    expect(q.select({subquery: db.users.all()}).toSql()).toBe(line(`
      SELECT
          (
            SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
            FROM (SELECT "users".* FROM "users") "t"
          ) AS "subquery"
      FROM "users"
    `))
    expect(q.selectRaw('raw').toSql()).toBe(line(`
      SELECT raw FROM "users"
    `))
    expect(q.toSql()).toBe(line(`
      SELECT "users".* FROM "users"
    `))
  })

  it('has modifier', () => {
    const q = db.users.all()
    q._select('id')
    expect(q.toSql()).toBe(line(`
      SELECT "users"."id" FROM "users"
    `))
  })
})

describe('from', () => {
  it('changes from', () => {
    const q = db.users.all()
    expect(q.as('t').from('otherTable').toSql()).toBe(line(`
      SELECT "t".* FROM otherTable "t"
    `))
    expect(q.toSql()).toContain('users')
  })

  it('has modifier', () => {
    const q = db.users.all()
    q._as('t')._from('otherTable')
    expect(q.toSql()).toBe(line(`
      SELECT "t".* FROM otherTable "t"
    `))
  })
})

describe('where', () => {
  beforeEach(() => {
    db.users._and = jest.fn()
  })
  afterAll(() => {
    delete db.users._and
  })

  it('is alias to and', () => {
    const q = db.users.all()
    q.where()
    expect(q._and).toBeCalled()
  })

  it('has modifier', () => {
    const q = db.users.all()
    q._where()
    expect(q.__query.and).not.toBeUndefined()
  })
})

describe('and', () => {
  it('joins where conditions with and', () => {
    const q = db.users.all()
    expect(q.and({column: null}).toSql()).toBe(line(`
      SELECT "users".* FROM "users" WHERE "users"."column" IS NULL
    `))
    expect(q.and({a: 1}).toSql()).toBe(line(`
      SELECT "users".* FROM "users" WHERE "users"."a" = 1
    `))
    expect(q.and({a: {b: 1}}).toSql()).toBe(line(`
      SELECT "users".* FROM "users" WHERE "a"."b" = 1
    `))
    expect(q.and({a: 1}, q.where({b: 2}).or({c: 3, d: 4})).toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      WHERE "users"."a" = 1 AND (
        "users"."b" = 2 OR "users"."c" = 3 AND "users"."d" = 4
      )
    `))
  })

  it('has modifier', () => {
    const q = db.users.all()
    q._and('q')
    expect(q.toSql()).toBe(line(`
      SELECT "users".* FROM "users" WHERE q
    `))
  })
})

describe('or', () => {
  it('joins conditions with or', () => {
    const q = db.users.all()
    expect(q.or('a', 'b').toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      WHERE a OR b
    `))
    expect(q.or({a: 1}, {a: 2}).toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      WHERE "users"."a" = 1 OR "users"."a" = 2
    `))
    expect(q.or({a: 1}, q.where({b: 2}).or({c: 3})).toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      WHERE "users"."a" = 1 OR ("users"."b" = 2 OR "users"."c" = 3)
    `))
    expect(q.toSql()).toBe('SELECT "users".* FROM "users"')
  })

  it('has modifier', () => {
    const q = db.users.all()
    q._or('a', 'b')
    expect(q.toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      WHERE a OR b
    `))
  })
})

describe('group', () => {
  it('adds GROUP BY', () => {
    const q = db.users.all()
    expect(q.group('id', 'name').toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      GROUP BY "users"."id", "users"."name"
    `))
    expect(q.groupRaw('id', 'name').toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      GROUP BY id, name
    `))
    expect(q.toSql()).toBe('SELECT "users".* FROM "users"')
  })

  it('has modifier', () => {
    const q = db.users.all()
    q._group('id')
    expect(q.toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      GROUP BY "users"."id"
    `))
    q._groupRaw('name')
    expect(q.toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      GROUP BY "users"."id", name
    `))
  })
})

describe('having', () => {
  it('adds HAVING', () => {
    const q = db.users.all()
    expect(q.having('sum(rating) > 30', 'count(id) > 5').toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      HAVING sum(rating) > 30, count(id) > 5
    `))
    expect(q.toSql()).toBe('SELECT "users".* FROM "users"')
  })

  it('has modifier', () => {
    const q = db.users.all()
    q._having('sum(rating) > 30', 'count(id) > 5')
    expect(q.toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      HAVING sum(rating) > 30, count(id) > 5
    `))
  })
})

describe('window', () => {
  it('adds WINDOW', () => {
    const q = db.users.all()
    expect(q.window({w: 'PARTITION BY depname ORDER BY salary DESC'}).toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      WINDOW w AS (PARTITION BY depname ORDER BY salary DESC)
    `))
    expect(q.toSql()).toBe('SELECT "users".* FROM "users"')
  })

  it('has modifier', () => {
    const q = db.users.all()
    q._window({w: 'PARTITION BY depname ORDER BY salary DESC'})
    expect(q.toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      WINDOW w AS (PARTITION BY depname ORDER BY salary DESC)
    `))
  })
});

['union', 'intersect', 'except'].forEach(what => {
  const upper = what.toUpperCase()
  describe(what, () => {
    it(`adds ${what}`, () => {
      const q = db.users.all()
      let query = q.select('id')
      query = query[what].call(query, db.chats.select('id'), 'SELECT 1')
      query = query[what + 'All'].call(query, 'SELECT 2')
      query = query.wrap(db.base.select('id'))

      expect(query.toSql()).toBe(line(`
        SELECT "t"."id" FROM (
          SELECT "users"."id" FROM "users"
          ${upper}
          SELECT "chats"."id" FROM "chats"
          ${upper}
          SELECT 1
          ${upper} ALL
          SELECT 2
        ) "t"
      `))
      expect(q.toSql()).toBe('SELECT "users".* FROM "users"')
    })

    it('has modifier', () => {
      const q = db.users.select('id')
      q[`_${what}`].call(q, 'SELECT 1')
      expect(q.toSql()).toBe(line(`
        SELECT "users"."id" FROM "users"
        ${upper}
        SELECT 1
      `))
      q[`_${what}All`].call(q, 'SELECT 2')
      expect(q.toSql()).toBe(line(`
        SELECT "users"."id" FROM "users"
        ${upper}
        SELECT 1
        ${upper} ALL
        SELECT 2
      `))
    })
  })
})

describe('order', () => {
  it(`defines order`, () => {
    const q = db.users.all()
    expect(
      q.order('id', {name: 'desc', something: 'asc nulls first'}, {a: {b: 'asc'}}).toSql()
    ).toBe(line(`
      SELECT "users".* FROM "users"
      ORDER BY
        "users"."id",
        "users"."name" desc,
        "users"."something" asc nulls first,
        "a"."b" asc
    `))
    expect(q.orderRaw('raw').toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      ORDER BY raw
    `))
    expect(q.toSql()).toBe('SELECT "users".* FROM "users"')
  })

  it('has modifier', () => {
    const q = db.users.all()
    q._order('id')
    expect(q.toSql()).toBe('SELECT "users".* FROM "users" ORDER BY "users"."id"')
  })
})

describe('limit', () => {
  it('sets limit', () => {
    const q = db.users.all()
    expect(q.limit(5).toSql()).toBe('SELECT "users".* FROM "users" LIMIT 5')
    expect(q.toSql()).toBe('SELECT "users".* FROM "users"')
  })

  it('has modifier', () => {
    const q = db.users.all()
    q._limit(5)
    expect(q.toSql()).toBe('SELECT "users".* FROM "users" LIMIT 5')
  })
})

describe('offset', () => {
  it('sets offset', () => {
    const q = db.users.all()
    expect(q.offset(5).toSql()).toBe('SELECT "users".* FROM "users" OFFSET 5')
    expect(q.toSql()).toBe('SELECT "users".* FROM "users"')
  })

  it('has modifier', () => {
    const q = db.users.all()
    q._offset(5)
    expect(q.toSql()).toBe('SELECT "users".* FROM "users" OFFSET 5')
  })
})

describe('for', () => {
  it('sets for', () => {
    const q = db.users.all()
    expect(q.for('some sql').toSql()).toBe('SELECT "users".* FROM "users" FOR some sql')
    expect(q.toSql()).toBe('SELECT "users".* FROM "users"')
  })

  it('has modifier', () => {
    const q = db.users.all()
    q._for('some sql')
    expect(q.toSql()).toBe('SELECT "users".* FROM "users" FOR some sql')
  })
})

describe('join', () => {
  it('sets join', () => {
    const q = db.users.all()
    expect(q.join('table', 'as', 'on').toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      JOIN "table" AS "as" ON on
    `))
    expect(q.join(db.messages.where('a').or('b').as('as')).toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      JOIN "messages" AS "as" ON a OR b
    `))
    expect(q.toSql()).toBe('SELECT "users".* FROM "users"')
  })

  it('has modifier', () => {
    const q = db.users.all()
    q._join('table', 'as', 'on')
    expect(q.toSql()).toBe(line(`
      SELECT "users".* FROM "users"
      JOIN "table" AS "as" ON on 
    `))
  })
})
