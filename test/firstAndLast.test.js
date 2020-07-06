"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = __importDefault(require("../src"));
const db_1 = __importDefault(require("./db"));
const model = src_1.default(db_1.default);
const User = model('users', class {
});
describe('first', () => {
    it('returns first record if called without arguments', async () => {
        expect(await User.first().toSql()).toBe('SELECT "users".* FROM "users" ORDER BY "users"."id" LIMIT 1');
    });
    it('has modifier', async () => {
        expect(await User._first().toSql()).toBe('SELECT "users".* FROM "users" ORDER BY "users"."id" LIMIT 1');
    });
    it('returns first records if called with limit', async () => {
        expect(await User.first(3).toSql()).toBe('SELECT "users".* FROM "users" ORDER BY "users"."id" LIMIT 3');
    });
    it('has modifier with limit', async () => {
        expect(await User._first(3).toSql()).toBe('SELECT "users".* FROM "users" ORDER BY "users"."id" LIMIT 3');
    });
});
describe('last', () => {
    it('returns last record if called without arguments', async () => {
        expect(await User.last().toSql()).toBe('SELECT "users".* FROM "users" ORDER BY "users"."id" DESC LIMIT 1');
    });
    it('has modifier', async () => {
        expect(await User._last().toSql()).toBe('SELECT "users".* FROM "users" ORDER BY "users"."id" DESC LIMIT 1');
    });
    it('returns last records if called with limit', async () => {
        expect(await User.last(3).toSql()).toBe('SELECT "users".* FROM "users" ORDER BY "users"."id" DESC LIMIT 3');
    });
    it('has modifier with limit', async () => {
        expect(await User._last(3).toSql()).toBe('SELECT "users".* FROM "users" ORDER BY "users"."id" DESC LIMIT 3');
    });
});
