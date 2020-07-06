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
User.columns = () => ({});
const WithUpdatedAt = model('users', class {
});
WithUpdatedAt.columns = () => ({ updatedAt: {} });
describe('updateAll', () => {
    it('updates using query', async () => {
        await User.where('a = b').updateAll({ name: 'vasya', role: 'user' });
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      UPDATE "users"
      SET "name" = 'vasya', "role" = 'user'
      WHERE a = b
    `));
    });
    it('updates with custom set', async () => {
        await User.updateAll('a = b');
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      UPDATE "users"
      SET a = b
    `));
    });
});
describe('update', () => {
    it('update by id number', async () => {
        await User.update(1, { name: 'vasya', role: 'user' });
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      UPDATE "users"
      SET "name" = 'vasya', "role" = 'user'
      WHERE "users"."id" = 1
    `));
    });
    it('update by id in object', async () => {
        const object = { id: 1 };
        await WithUpdatedAt.update(object, { name: 'vasya', role: 'user' });
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      UPDATE "users"
      SET
        "name" = 'vasya',
        "role" = 'user',
        "updatedAt" = '${object.updatedAt.toISOString()}'
      WHERE "users"."id" = 1
    `));
    });
    it('update custom set', async () => {
        await User.update(1, 'a = b');
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      UPDATE "users"
      SET a = b
      WHERE "users"."id" = 1
    `));
    });
});
