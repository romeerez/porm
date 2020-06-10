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
describe('updateAll', () => {
    it('updates using query', () => {
        User.where('a = b').updateAll({ name: 'vasya', role: 'user' });
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      UPDATE "users"
      SET "users"."name" = 'vasya', "users"."role" = 'user'
      WHERE a = b
    `));
    });
    it('updates with custom set', () => {
        User.updateAll('a = b');
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      UPDATE "users"
      SET a = b
    `));
    });
});
describe('update', () => {
    it('update by id number', () => {
        User.update(1, { name: 'vasya', role: 'user' });
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      UPDATE "users"
      SET "users"."name" = 'vasya', "users"."role" = 'user'
      WHERE "users"."id" = 1
    `));
    });
    it('update by id in object', () => {
        User.update({ id: 1 }, { name: 'vasya', role: 'user' });
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      UPDATE "users"
      SET "users"."name" = 'vasya', "users"."role" = 'user'
      WHERE "users"."id" = 1
    `));
    });
    it('update custom set', () => {
        User.update(1, 'a = b');
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      UPDATE "users"
      SET a = b
      WHERE "users"."id" = 1
    `));
    });
});
