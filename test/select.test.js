"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
    it('generates sql', async () => {
        expect(await User.toSql()).toBe(`SELECT "users".* FROM "users"`);
    });
});
describe('find', () => {
    it('searches one by primary key', async () => {
        expect(await User.find(1).toSql()).toBe(`SELECT "users".* FROM "users" WHERE "users"."id" = 1 LIMIT 1`);
    });
    it('has modifier', async () => {
        const q = User.all();
        q._find(1);
        expect(await q.toSql()).toBe(`SELECT "users".* FROM "users" WHERE "users"."id" = 1 LIMIT 1`);
    });
});
describe('wrap', () => {
    it('wraps query with another', async () => {
        const q = User.select('innerQuery');
        expect(await q.wrap(User.select('outerQuery')).toSql()).toBe('SELECT "t"."outerQuery" FROM (SELECT "users"."innerQuery" FROM "users") "t"');
    });
    it('accept `as` parameter', async () => {
        const q = User.select('innerQuery');
        expect(await q.wrap(User.select('outerQuery'), 'wrapped').toSql()).toBe('SELECT "wrapped"."outerQuery" FROM (SELECT "users"."innerQuery" FROM "users") "wrapped"');
    });
});
describe('json', () => {
    it('wraps a query with json functions', async () => {
        const q = User.all();
        expect(await q.json().toSql()).toBe(utils_1.line(`
      SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
      FROM (
        SELECT "users".* FROM "users"
      ) "t"
    `));
        expect(await q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('supports `take`', async () => {
        expect(await User.take().json().toSql()).toBe(utils_1.line(`
      SELECT COALESCE(row_to_json("t".*), '{}') AS json
      FROM (
        SELECT "users".* FROM "users" LIMIT 1
      ) "t"
    `));
    });
});
describe('take', () => {
    it('limits to one and returns only one', async () => {
        const q = User.all();
        expect(await q.take().toSql()).toContain('LIMIT 1');
        expect(await q.toSql()).not.toContain('LIMIT 1');
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
    it('sets table alias', async () => {
        const q = User.all();
        expect(await q.select('id').as('as').toSql()).toBe('SELECT "as"."id" FROM "users" "as"');
        expect(await q.toSql()).not.toContain('as');
    });
});
describe('distinct and distinctRaw', () => {
    it('add distinct', async () => {
        const q = User.all();
        expect(await q.distinct().toSql()).toBe('SELECT DISTINCT "users".* FROM "users"');
        expect(await q.distinct('id', 'name').toSql()).toBe(utils_1.line(`
      SELECT DISTINCT ON ("users"."id", "users"."name") "users".*
      FROM "users"
    `));
        expect(await q.distinctRaw('raw').toSql()).toBe(utils_1.line(`
      SELECT DISTINCT ON (raw) "users".*
      FROM "users"
    `));
        expect(await q.distinct('one').distinctRaw('two').toSql()).toBe(utils_1.line(`
      SELECT DISTINCT ON ("users"."one", two) "users".*
      FROM "users"
    `));
        expect(await q.toSql()).not.toContain('DISTINCT');
    });
    it('has modifier', async () => {
        const q = User.all();
        q._distinct();
        expect(await q.toSql()).toContain('DISTINCT');
        q._distinct(false);
        expect(await q.toSql()).not.toContain('DISTINCT');
        q._distinctRaw();
        expect(await q.toSql()).toContain('DISTINCT');
        q._distinctRaw(false);
        expect(await q.toSql()).not.toContain('DISTINCT');
    });
});
describe('select and selectRaw', () => {
    it('selects', async () => {
        const q = User.all();
        expect(await q.select('id', 'name').toSql()).toBe(utils_1.line(`
      SELECT "users"."id", "users"."name" FROM "users"
    `));
        expect(await q.select({ firstName: 'name' }).toSql()).toBe(utils_1.line(`
      SELECT "users"."name" AS "firstName" FROM "users"
    `));
        expect(await q.select({ subquery: User.all() }).toSql()).toBe(utils_1.line(`
      SELECT
          (
            SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
            FROM (SELECT "users".* FROM "users") "t"
          ) AS "subquery"
      FROM "users"
    `));
        expect(await q.selectRaw('raw').toSql()).toBe(utils_1.line(`
      SELECT raw FROM "users"
    `));
        expect(await q.toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
    `));
    });
    it('has modifier', async () => {
        const q = User.all();
        q._select('id');
        expect(await q.toSql()).toBe(utils_1.line(`
      SELECT "users"."id" FROM "users"
    `));
    });
});
describe('from', () => {
    it('changes from', async () => {
        const q = User.all();
        expect(await q.as('t').from('otherTable').toSql()).toBe(utils_1.line(`
      SELECT "t".* FROM otherTable "t"
    `));
        expect(await q.toSql()).toContain('users');
    });
    it('has modifier', async () => {
        const q = User.all();
        q._as('t')._from('otherTable');
        expect(await q.toSql()).toBe(utils_1.line(`
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
    it('joins where conditions with and', async () => {
        const q = User.all();
        expect(await q.and({ column: null }).toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users" WHERE "users"."column" IS NULL
    `));
        expect(await q.and({ a: 1 }).toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users" WHERE "users"."a" = 1
    `));
        expect(await q.and({ a: { b: 1 } }).toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users" WHERE "a"."b" = 1
    `));
        expect(await q.and({ a: 1 }, q.where({ b: 2 }).or({ c: 3, d: 4 })).toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      WHERE "users"."a" = 1 AND (
        "users"."b" = 2 OR "users"."c" = 3 AND "users"."d" = 4
      )
    `));
    });
    it('has modifier', async () => {
        const q = User.all();
        q._and('q');
        expect(await q.toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users" WHERE q
    `));
    });
});
describe('or', () => {
    it('joins conditions with or', async () => {
        const q = User.all();
        expect(await q.or('a', 'b').toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      WHERE a OR b
    `));
        expect(await q.or({ a: 1 }, { a: 2 }).toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      WHERE "users"."a" = 1 OR "users"."a" = 2
    `));
        expect(await q.or({ a: 1 }, q.where({ b: 2 }).or({ c: 3 })).toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      WHERE "users"."a" = 1 OR ("users"."b" = 2 OR "users"."c" = 3)
    `));
        expect(await q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', async () => {
        const q = User.all();
        q._or('a', 'b');
        expect(await q.toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      WHERE a OR b
    `));
    });
});
describe('findBy', () => {
    it('like where but with take', async () => {
        const q = User.all();
        expect(await q.findBy({ a: 1 }).toSql()).toBe('SELECT "users".* FROM "users" WHERE "users"."a" = 1 LIMIT 1');
        expect(await q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', async () => {
        const q = User.all();
        q._findBy({ a: 1 });
        expect(await q.toSql()).toBe('SELECT "users".* FROM "users" WHERE "users"."a" = 1 LIMIT 1');
    });
});
describe('group', () => {
    it('adds GROUP BY', async () => {
        const q = User.all();
        expect(await q.group('id', 'name').toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      GROUP BY "users"."id", "users"."name"
    `));
        expect(await q.groupRaw('id', 'name').toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      GROUP BY id, name
    `));
        expect(await q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', async () => {
        const q = User.all();
        q._group('id');
        expect(await q.toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      GROUP BY "users"."id"
    `));
        q._groupRaw('name');
        expect(await q.toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      GROUP BY "users"."id", name
    `));
    });
});
describe('having', () => {
    it('adds HAVING', async () => {
        const q = User.all();
        expect(await q.having('sum(rating) > 30', 'count(id) > 5').toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      HAVING sum(rating) > 30, count(id) > 5
    `));
        expect(await q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', async () => {
        const q = User.all();
        q._having('sum(rating) > 30', 'count(id) > 5');
        expect(await q.toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      HAVING sum(rating) > 30, count(id) > 5
    `));
    });
});
describe('window', () => {
    it('adds WINDOW', async () => {
        const q = User.all();
        expect(await q.window({ w: 'PARTITION BY depname ORDER BY salary DESC' }).toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      WINDOW w AS (PARTITION BY depname ORDER BY salary DESC)
    `));
        expect(await q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', async () => {
        const q = User.all();
        q._window({ w: 'PARTITION BY depname ORDER BY salary DESC' });
        expect(await q.toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      WINDOW w AS (PARTITION BY depname ORDER BY salary DESC)
    `));
    });
});
['union', 'intersect', 'except'].forEach(what => {
    const upper = what.toUpperCase();
    describe(what, () => {
        it(`adds ${what}`, async () => {
            const q = User.all();
            let query = q.select('id');
            query = query[what].call(query, Chat.select('id'), 'SELECT 1');
            query = query[what + 'All'].call(query, 'SELECT 2');
            query = query.wrap(Chat.select('id'));
            expect(await query.toSql()).toBe(utils_1.line(`
        SELECT "t"."id" FROM (
          SELECT "users"."id" FROM "users"
          ${upper}
          SELECT 1
          ${upper}
          SELECT "chats"."id" FROM "chats"
          ${upper} ALL
          SELECT 2
        ) "t"
      `));
            expect(await q.toSql()).toBe('SELECT "users".* FROM "users"');
        });
        it('has modifier', async () => {
            const q = User.select('id');
            q[`_${what}`].call(q, 'SELECT 1');
            expect(await q.toSql()).toBe(utils_1.line(`
        SELECT "users"."id" FROM "users"
        ${upper}
        SELECT 1
      `));
            q[`_${what}All`].call(q, 'SELECT 2');
            expect(await q.toSql()).toBe(utils_1.line(`
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
    it(`defines order`, async () => {
        const q = User.all();
        expect(await q.order('id', { name: 'desc', something: 'asc nulls first' }, { a: { b: 'asc' } }).toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      ORDER BY
        "users"."id",
        "users"."name" desc,
        "users"."something" asc nulls first,
        "a"."b" asc
    `));
        expect(await q.orderRaw('raw').toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      ORDER BY raw
    `));
        expect(await q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', async () => {
        const q = User.all();
        q._order('id');
        expect(await q.toSql()).toBe('SELECT "users".* FROM "users" ORDER BY "users"."id"');
    });
});
describe('limit', () => {
    it('sets limit', async () => {
        const q = User.all();
        expect(await q.limit(5).toSql()).toBe('SELECT "users".* FROM "users" LIMIT 5');
        expect(await q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', async () => {
        const q = User.all();
        q._limit(5);
        expect(await q.toSql()).toBe('SELECT "users".* FROM "users" LIMIT 5');
    });
});
describe('offset', () => {
    it('sets offset', async () => {
        const q = User.all();
        expect(await q.offset(5).toSql()).toBe('SELECT "users".* FROM "users" OFFSET 5');
        expect(await q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', async () => {
        const q = User.all();
        q._offset(5);
        expect(await q.toSql()).toBe('SELECT "users".* FROM "users" OFFSET 5');
    });
});
describe('for', () => {
    it('sets for', async () => {
        const q = User.all();
        expect(await q.for('some sql').toSql()).toBe('SELECT "users".* FROM "users" FOR some sql');
        expect(await q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', async () => {
        const q = User.all();
        q._for('some sql');
        expect(await q.toSql()).toBe('SELECT "users".* FROM "users" FOR some sql');
    });
});
describe('join', () => {
    it('sets join', async () => {
        const q = User.all();
        expect(await q.join('table', 'as', 'on').toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      JOIN "table" AS "as" ON on
    `));
        expect(await q.join(Message.where('a').or('b').as('as')).toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      JOIN "messages" AS "as" ON a OR b
    `));
        expect(await q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', async () => {
        const q = User.all();
        q._join('table', 'as', 'on');
        expect(await q.toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      JOIN "table" AS "as" ON on
    `));
    });
});
describe('exists', () => {
    it('selects 1', async () => {
        const q = User.all();
        expect(await q.exists().toSql()).toBe('SELECT 1 FROM "users"');
        expect(await q.toSql()).toBe('SELECT "users".* FROM "users"');
    });
    it('has modifier', async () => {
        const q = User.all();
        q._exists();
        expect(await q.toSql()).toBe('SELECT 1 FROM "users"');
    });
});
describe('model with hidden column', () => {
    it('selects by default all columns except hidden', async () => {
        class ModelInterface {
        }
        __decorate([
            src_1.default.hidden,
            __metadata("design:type", String)
        ], ModelInterface.prototype, "password", void 0);
        const Model = model('table', ModelInterface);
        Model.columnNames = jest.fn(() => ['id', 'name', 'password']);
        const q = Model.all();
        expect(await q.toSql()).toBe('SELECT "table"."id", "table"."name" FROM "table"');
    });
});
