"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = __importDefault(require("../src"));
const utils_1 = require("./utils");
const db_1 = __importDefault(require("./db"));
const model = src_1.default(db_1.default);
const User = model('users', class {
});
const Chat = model('chats', class {
});
const Message = model('messages', class {
});
describe('toQuery', () => {
    it('creates a query with same props as model', () => {
        const query = User.toQuery();
        expect(query).not.toBe(User);
        for (let key in User) {
            const value = User[key];
            if (value !== undefined)
                expect(query[key]).toBe(value);
        }
    });
});
describe('all', () => {
    it('returns query, if `take` prop present query is cloned, clears `take` property', () => {
        const q = User.all();
        expect(q.all()).toBe(q);
        q._take();
        expect(q.__query).toHaveProperty('take');
        expect(q.all()).not.toBe(q);
    });
    it('has modifier', () => {
        const q = User._all();
        q._take();
        expect(q.__query).toHaveProperty('take');
        q._all();
        expect(q.__query).not.toHaveProperty('take');
    });
});
describe('clone', () => {
    it('clones a query', () => {
        const q = User;
        expect(q.clone()).not.toBe(q);
    });
});
describe('toSql', () => {
    it('generates sql', () => {
        expect(User.toSql()).toBe(`SELECT "users".* FROM "users"`);
    });
});
describe('find', () => {
    it('searches one by primary key', () => {
        expect(User.find(1).toSql()).toBe(`SELECT "users".* FROM "users" WHERE "users"."id" = 1 LIMIT 1`);
    });
    it('has modifier', () => {
        const q = User.all();
        q._find(1);
        expect(q.toSql()).toBe(`SELECT "users".* FROM "users" WHERE "users"."id" = 1 LIMIT 1`);
    });
});
describe('wrap', () => {
    it('wraps query with another', () => {
        const q = User.select('innerQuery');
        expect(q.wrap(User.select('outerQuery')).toSql()).toBe('SELECT "t"."outerQuery" FROM (SELECT "users"."innerQuery" FROM "users") "t"');
    });
    it('accept `as` parameter', () => {
        const q = User.select('innerQuery');
        expect(q.wrap(User.select('outerQuery'), 'wrapped').toSql()).toBe('SELECT "wrapped"."outerQuery" FROM (SELECT "users"."innerQuery" FROM "users") "wrapped"');
    });
});
describe('json', () => {
    it('wraps a query with json functions', () => {
        const q = User.all();
        expect(q.json().toSql()).toBe(utils_1.line(`
      SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
      FROM (
        SELECT "users".* FROM "users"
      ) "t"
    `));
        expect(q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('supports `take`', () => {
        expect(User.take().json().toSql()).toBe(utils_1.line(`
      SELECT COALESCE(row_to_json("t".*), '{}') AS json
      FROM (
        SELECT "users".* FROM "users" LIMIT 1
      ) "t"
    `));
    });
});
describe('take', () => {
    it('limits to one and returns only one', () => {
        const q = User.all();
        expect(q.take().toSql()).toContain('LIMIT 1');
        expect(q.toSql()).not.toContain('LIMIT 1');
    });
});
describe('arrays', () => {
    it('calls arrays method of db', async () => {
        await User.rows();
        expect(db_1.default.arrays).toBeCalledWith(expect.anything());
    });
    it('has modifier', async () => {
        const q = User.all();
        q._rows();
        await q;
        expect(db_1.default.arrays).toBeCalledWith(expect.anything());
    });
});
describe('value', () => {
    it('calls value method of db', async () => {
        const q = User.value();
        await q.value();
        expect(db_1.default.value).toBeCalledWith(expect.anything());
    });
    it('has modifier', async () => {
        const q = User.all();
        q._value();
        await q;
        expect(db_1.default.value).toBeCalledWith(expect.anything());
    });
});
describe('exec', () => {
    it('calls exec method of db', async () => {
        const q = User.exec();
        await q;
        expect(db_1.default.exec).toBeCalledWith(expect.anything());
    });
    it('has modifier', async () => {
        const q = User.all();
        q._exec();
        await q;
        expect(db_1.default.exec).toBeCalledWith(expect.anything());
    });
});
describe('as', () => {
    it('sets table alias', () => {
        const q = User.all();
        expect(q.select('id').as('as').toSql()).toBe('SELECT "as"."id" FROM "users" "as"');
        expect(q.toSql()).not.toContain('as');
    });
});
describe('distinct and distinctRaw', () => {
    it('add distinct', () => {
        const q = User.all();
        expect(q.distinct().toSql()).toBe('SELECT DISTINCT "users".* FROM "users"');
        expect(q.distinct('id', 'name').toSql()).toBe(utils_1.line(`
      SELECT DISTINCT ON ("users"."id", "users"."name") "users".*
      FROM "users"
    `));
        expect(q.distinctRaw('raw').toSql()).toBe(utils_1.line(`
      SELECT DISTINCT ON (raw) "users".*
      FROM "users"
    `));
        expect(q.distinct('one').distinctRaw('two').toSql()).toBe(utils_1.line(`
      SELECT DISTINCT ON ("users"."one", two) "users".*
      FROM "users"
    `));
        expect(q.toSql()).not.toContain('DISTINCT');
    });
    it('has modifier', () => {
        const q = User.all();
        q._distinct();
        expect(q.toSql()).toContain('DISTINCT');
        q._distinct(false);
        expect(q.toSql()).not.toContain('DISTINCT');
        q._distinctRaw();
        expect(q.toSql()).toContain('DISTINCT');
        q._distinctRaw(false);
        expect(q.toSql()).not.toContain('DISTINCT');
    });
});
describe('select and selectRaw', () => {
    it('selects', () => {
        const q = User.all();
        expect(q.select('id', 'name').toSql()).toBe(utils_1.line(`
      SELECT "users"."id", "users"."name" FROM "users"
    `));
        expect(q.select({ firstName: 'name' }).toSql()).toBe(utils_1.line(`
      SELECT "users"."name" AS "firstName" FROM "users"
    `));
        expect(q.select({ subquery: User.all() }).toSql()).toBe(utils_1.line(`
      SELECT
          (
            SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
            FROM (SELECT "users".* FROM "users") "t"
          ) AS "subquery"
      FROM "users"
    `));
        expect(q.selectRaw('raw').toSql()).toBe(utils_1.line(`
      SELECT raw FROM "users"
    `));
        expect(q.toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
    `));
    });
    it('has modifier', () => {
        const q = User.all();
        q._select('id');
        expect(q.toSql()).toBe(utils_1.line(`
      SELECT "users"."id" FROM "users"
    `));
    });
});
describe('from', () => {
    it('changes from', () => {
        const q = User.all();
        expect(q.as('t').from('otherTable').toSql()).toBe(utils_1.line(`
      SELECT "t".* FROM otherTable "t"
    `));
        expect(q.toSql()).toContain('users');
    });
    it('has modifier', () => {
        const q = User.all();
        q._as('t')._from('otherTable');
        expect(q.toSql()).toBe(utils_1.line(`
      SELECT "t".* FROM otherTable "t"
    `));
    });
});
describe('where', () => {
    let [and, _and] = [User.and, User._and];
    beforeEach(() => {
        User.and = jest.fn();
        User._and = jest.fn();
    });
    afterAll(() => {
        User.and = and;
        User._and = _and;
    });
    it('is alias to and', () => {
        const q = User.all();
        q.where();
        expect(q.and).toBeCalled();
    });
    it('has modifier', () => {
        const q = User.all();
        q._where();
        expect(q._and).toBeCalled();
    });
});
describe('and', () => {
    it('joins where conditions with and', () => {
        const q = User.all();
        expect(q.and({ column: null }).toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users" WHERE "users"."column" IS NULL
    `));
        expect(q.and({ a: 1 }).toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users" WHERE "users"."a" = 1
    `));
        expect(q.and({ a: { b: 1 } }).toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users" WHERE "a"."b" = 1
    `));
        expect(q.and({ a: 1 }, q.where({ b: 2 }).or({ c: 3, d: 4 })).toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      WHERE "users"."a" = 1 AND (
        "users"."b" = 2 OR "users"."c" = 3 AND "users"."d" = 4
      )
    `));
    });
    it('has modifier', () => {
        const q = User.all();
        q._and('q');
        expect(q.toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users" WHERE q
    `));
    });
});
describe('or', () => {
    it('joins conditions with or', () => {
        const q = User.all();
        expect(q.or('a', 'b').toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      WHERE a OR b
    `));
        expect(q.or({ a: 1 }, { a: 2 }).toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      WHERE "users"."a" = 1 OR "users"."a" = 2
    `));
        expect(q.or({ a: 1 }, q.where({ b: 2 }).or({ c: 3 })).toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      WHERE "users"."a" = 1 OR ("users"."b" = 2 OR "users"."c" = 3)
    `));
        expect(q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', () => {
        const q = User.all();
        q._or('a', 'b');
        expect(q.toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      WHERE a OR b
    `));
    });
});
describe('findBy', () => {
    it('like where but with take', () => {
        const q = User.all();
        expect(q.findBy({ a: 1 }).toSql()).toBe('SELECT "users".* FROM "users" WHERE "users"."a" = 1 LIMIT 1');
        expect(q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', () => {
        const q = User.all();
        q._findBy({ a: 1 });
        expect(q.toSql()).toBe('SELECT "users".* FROM "users" WHERE "users"."a" = 1 LIMIT 1');
    });
});
describe('group', () => {
    it('adds GROUP BY', () => {
        const q = User.all();
        expect(q.group('id', 'name').toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      GROUP BY "users"."id", "users"."name"
    `));
        expect(q.groupRaw('id', 'name').toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      GROUP BY id, name
    `));
        expect(q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', () => {
        const q = User.all();
        q._group('id');
        expect(q.toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      GROUP BY "users"."id"
    `));
        q._groupRaw('name');
        expect(q.toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      GROUP BY "users"."id", name
    `));
    });
});
describe('having', () => {
    it('adds HAVING', () => {
        const q = User.all();
        expect(q.having('sum(rating) > 30', 'count(id) > 5').toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      HAVING sum(rating) > 30, count(id) > 5
    `));
        expect(q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', () => {
        const q = User.all();
        q._having('sum(rating) > 30', 'count(id) > 5');
        expect(q.toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      HAVING sum(rating) > 30, count(id) > 5
    `));
    });
});
describe('window', () => {
    it('adds WINDOW', () => {
        const q = User.all();
        expect(q.window({ w: 'PARTITION BY depname ORDER BY salary DESC' }).toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      WINDOW w AS (PARTITION BY depname ORDER BY salary DESC)
    `));
        expect(q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', () => {
        const q = User.all();
        q._window({ w: 'PARTITION BY depname ORDER BY salary DESC' });
        expect(q.toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      WINDOW w AS (PARTITION BY depname ORDER BY salary DESC)
    `));
    });
});
['union', 'intersect', 'except'].forEach(what => {
    const upper = what.toUpperCase();
    describe(what, () => {
        it(`adds ${what}`, () => {
            const q = User.all();
            let query = q.select('id');
            query = query[what].call(query, Chat.select('id'), 'SELECT 1');
            query = query[what + 'All'].call(query, 'SELECT 2');
            query = query.wrap(Chat.select('id'));
            expect(query.toSql()).toBe(utils_1.line(`
        SELECT "t"."id" FROM (
          SELECT "users"."id" FROM "users"
          ${upper}
          SELECT "chats"."id" FROM "chats"
          ${upper}
          SELECT 1
          ${upper} ALL
          SELECT 2
        ) "t"
      `));
            expect(q.toSql()).toBe('SELECT "users".* FROM "users"');
        });
        it('has modifier', () => {
            const q = User.select('id');
            q[`_${what}`].call(q, 'SELECT 1');
            expect(q.toSql()).toBe(utils_1.line(`
        SELECT "users"."id" FROM "users"
        ${upper}
        SELECT 1
      `));
            q[`_${what}All`].call(q, 'SELECT 2');
            expect(q.toSql()).toBe(utils_1.line(`
        SELECT "users"."id" FROM "users"
        ${upper}
        SELECT 1
        ${upper} ALL
        SELECT 2
      `));
        });
    });
});
describe('order', () => {
    it(`defines order`, () => {
        const q = User.all();
        expect(q.order('id', { name: 'desc', something: 'asc nulls first' }, { a: { b: 'asc' } }).toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      ORDER BY
        "users"."id",
        "users"."name" desc,
        "users"."something" asc nulls first,
        "a"."b" asc
    `));
        expect(q.orderRaw('raw').toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      ORDER BY raw
    `));
        expect(q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', () => {
        const q = User.all();
        q._order('id');
        expect(q.toSql()).toBe('SELECT "users".* FROM "users" ORDER BY "users"."id"');
    });
});
describe('limit', () => {
    it('sets limit', () => {
        const q = User.all();
        expect(q.limit(5).toSql()).toBe('SELECT "users".* FROM "users" LIMIT 5');
        expect(q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', () => {
        const q = User.all();
        q._limit(5);
        expect(q.toSql()).toBe('SELECT "users".* FROM "users" LIMIT 5');
    });
});
describe('offset', () => {
    it('sets offset', () => {
        const q = User.all();
        expect(q.offset(5).toSql()).toBe('SELECT "users".* FROM "users" OFFSET 5');
        expect(q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', () => {
        const q = User.all();
        q._offset(5);
        expect(q.toSql()).toBe('SELECT "users".* FROM "users" OFFSET 5');
    });
});
describe('for', () => {
    it('sets for', () => {
        const q = User.all();
        expect(q.for('some sql').toSql()).toBe('SELECT "users".* FROM "users" FOR some sql');
        expect(q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', () => {
        const q = User.all();
        q._for('some sql');
        expect(q.toSql()).toBe('SELECT "users".* FROM "users" FOR some sql');
    });
});
describe('join', () => {
    it('sets join', () => {
        const q = User.all();
        expect(q.join('table', 'as', 'on').toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      JOIN "table" AS "as" ON on
    `));
        expect(q.join(Message.where('a').or('b').as('as')).toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      JOIN "messages" AS "as" ON a OR b
    `));
        expect(q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', () => {
        const q = User.all();
        q._join('table', 'as', 'on');
        expect(q.toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      JOIN "table" AS "as" ON on
    `));
    });
});
describe('exists', () => {
    it('selects 1', () => {
        const q = User.all();
        expect(q.exists().toSql()).toBe('SELECT 1 FROM "users"');
        expect(q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', () => {
        const q = User.all();
        q._exists();
        expect(q.toSql()).toBe('SELECT 1 FROM "users"');
    });
});
