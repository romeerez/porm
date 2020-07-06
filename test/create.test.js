"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = __importDefault(require("../src"));
const db_1 = __importDefault(require("./db"));
const utils_1 = require("./utils");
const model = src_1.default(db_1.default);
const User = model('users', class {
});
User.columnsPromise = {};
const WithCreatedAt = model('users', class {
});
WithCreatedAt.columns = () => ({ createdAt: {} });
const WithUpdatedAt = model('users', class {
});
WithUpdatedAt.columns = () => ({ updatedAt: {} });
const WithBoth = model('users', class {
});
WithBoth.columns = () => ({ createdAt: {}, updatedAt: {} });
describe('create', () => {
    describe('one record', () => {
        let arrays;
        beforeAll(() => {
            arrays = db_1.default.arrays;
            db_1.default.arrays = jest.fn(() => [[1]]);
        });
        afterAll(() => {
            db_1.default.arrays = arrays;
        });
        it('creates one record', async () => {
            const user = await User.create({ name: 'vasya', role: 'user' });
            expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
        INSERT INTO "users" ("name", "role")
        VALUES ('vasya', 'user')
        RETURNING "id"
      `));
            expect(user.id).toBe(1);
        });
        it('creates one record with createdAt', async () => {
            const user = await WithCreatedAt.create({ name: 'vasya', role: 'user' });
            expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
        INSERT INTO "users" ("name", "role", "createdAt")
        VALUES ('vasya', 'user', '${user.createdAt.toISOString()}')
        RETURNING "id"
      `));
            expect(user.id).toBe(1);
        });
        it('creates one record with updatedAt', async () => {
            const user = await WithUpdatedAt.create({ name: 'vasya', role: 'user' });
            expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
        INSERT INTO "users" ("name", "role", "updatedAt")
        VALUES ('vasya', 'user', '${user.updatedAt.toISOString()}')
        RETURNING "id"
      `));
            expect(user.id).toBe(1);
        });
        it('creates one record with both', async () => {
            const user = await WithBoth.create({ name: 'vasya', role: 'user' });
            expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
        INSERT INTO "users" ("name", "role", "createdAt", "updatedAt")
        VALUES ('vasya', 'user', '${user.createdAt.toISOString()}', '${user.updatedAt.toISOString()}')
        RETURNING "id"
      `));
            expect(user.id).toBe(1);
        });
        // it('creates record with custom returning', async () => {
        //   await User.create({name: 'vasya', role: 'user'}, 'custom')
        //   expect(db.arrays).toBeCalledWith(line(`
        //     INSERT INTO "users" ("name", "role")
        //     VALUES ('vasya', 'user')
        //     RETURNING custom
        //   `))
        // })
        it('creates record with returning of columns', async () => {
            await User.create({ name: 'vasya', role: 'user' }, ['id', 'name']);
            expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
        INSERT INTO "users" ("name", "role")
        VALUES ('vasya', 'user')
        RETURNING "id", "name"
      `));
        });
    });
    describe('multiple records', () => {
        let arrays;
        beforeAll(() => {
            arrays = db_1.default.arrays;
            db_1.default.arrays = jest.fn(() => [[1], [2]]);
        });
        afterAll(() => {
            db_1.default.arrays = arrays;
        });
        it('creates multiple records', async () => {
            const users = await User.create([{ name: 'vasya', role: 'user' }, { name: 'petya', role: 'admin' }]);
            expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
        INSERT INTO "users" ("name", "role")
        VALUES ('vasya', 'user'), ('petya', 'admin')
        RETURNING "id"
      `));
            expect(users.map(({ id }) => id)).toEqual([1, 2]);
        });
        it('creates multiple records with createdAt', async () => {
            const users = await WithCreatedAt.create([{ name: 'vasya', role: 'user' }, { name: 'petya', role: 'admin' }]);
            const date = users[0].createdAt.toISOString();
            expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
        INSERT INTO "users" ("name", "role", "createdAt")
        VALUES ('vasya', 'user', '${date}'), ('petya', 'admin', '${date}')
        RETURNING "id"
      `));
            expect(users.map(({ id }) => id)).toEqual([1, 2]);
        });
        it('creates multiple records with updatedAt', async () => {
            const users = await WithUpdatedAt.create([{ name: 'vasya', role: 'user' }, { name: 'petya', role: 'admin' }]);
            const date = users[0].updatedAt.toISOString();
            expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
        INSERT INTO "users" ("name", "role", "updatedAt")
        VALUES ('vasya', 'user', '${date}'), ('petya', 'admin', '${date}')
        RETURNING "id"
      `));
            expect(users.map(({ id }) => id)).toEqual([1, 2]);
        });
        it('creates multiple records with both', async () => {
            const users = await WithBoth.create([{ name: 'vasya', role: 'user' }, { name: 'petya', role: 'admin' }]);
            const date = users[0].createdAt.toISOString();
            expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
        INSERT INTO "users" ("name", "role", "createdAt", "updatedAt")
        VALUES ('vasya', 'user', '${date}', '${date}'), ('petya', 'admin', '${date}', '${date}')
        RETURNING "id"
      `));
            expect(users.map(({ id }) => id)).toEqual([1, 2]);
        });
    });
});
